from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from app.utils.jwt_handler import get_current_user
from app.utils.api_response import api_response
from app.services.resume import fetch_resumes_by_uid
from app.utils.groq import get_groq_response
from app.db.mongodb import db

import json
import re
from bson import ObjectId  # to handle MongoDB IDs

router = APIRouter()

resume_collection = db["resumes"]

# --- SCHEMA ---
class JobDescriptionSchema(BaseModel):
    job_description: str = Field(..., min_length=10, description="The job description text")


# --- Helper: Clean text ---
def clean_text(text: str) -> str:
    text = text.replace("\n", " ").replace("\t", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


# --- Helper: Parse Groq JSON safely ---
def extract_json(response: str):
    try:
        return json.loads(response)
    except json.JSONDecodeError:
        cleaned = re.sub(r"^```json|```$", "", response, flags=re.MULTILINE).strip()
        start = cleaned.find("{")
        end = cleaned.rfind("}") + 1
        if start == -1 or end == -1:
            raise ValueError("No valid JSON found in response")
        return json.loads(cleaned[start:end])


@router.post("/score")
async def calculate_ats(
    payload: JobDescriptionSchema,
    current_user: dict = Depends(get_current_user)
):
    firebase_uid = current_user.get("firebase_uid")
    resumes = await fetch_resumes_by_uid(firebase_uid)

    if not resumes:
        return api_response(message="No resumes found", status_code=404, data={})

    resume_doc = resumes[0]   # pick the first resume
    resume_text = clean_text(resume_doc["parsed_data"].get("content") or "")
    job_desc = clean_text(payload.job_description)

    prompt = f"""
    You are an ATS scoring system. Compare the following resume text with the given job description.

    Resume: {resume_text}

    Job Description: {job_desc}

    Return strictly JSON only:

    {{
      "score": <number between 0 and 100>,
      "matched_keywords": ["keyword1", "keyword2", ...],
      "missing_keywords": ["keyword1", "keyword2", ...],
      "suggestions": ["improvement1", "improvement2", ...]
    }}
    """

    ats = await get_groq_response(prompt)

    try:
        ats_json = extract_json(ats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Invalid response from Groq: {str(e)}")

    # --- Save ATS results inside the same resume doc ---
    await resume_collection.update_one(
        {"_id": ObjectId(resume_doc["id"])},  # always update the exact resume
        {"$set": {"ats": ats_json}}
    )

    return api_response(
        message="Successfully calculated ATS",
        status_code=200,
        data=ats_json
    )


@router.post("/suggest")
async def suggest(current_user: dict = Depends(get_current_user)):
    firebase_uid = current_user.get("firebase_uid")
    resumes = await fetch_resumes_by_uid(firebase_uid)

    if not resumes:
        return api_response(message="No resumes found", status_code=404, data={})

    resume_doc = resumes[0]
    resume_text = clean_text(resume_doc["parsed_data"].get("content") or "")

    prompt = f"""
    You are a professional resume coach and ATS optimization expert. 
    Analyze the following resume text and provide actionable improvement suggestions.  

    Resume: {resume_text}

    Return strictly JSON in the following format ONLY:

    {{
    "suggestions": [
        {{
        "improve": "A short improvement title, e.g., 'Enhance technical skills'",
        "description": "A detailed explanation of why and how to improve this aspect of the resume",
        "example": "A concrete example showing the suggested improvement, e.g., 'Add JavaScript frameworks like React.js and Node.js to your skills section'"
        }},
        {{
        "improve": "Next improvement title",
        "description": "Detailed explanation",
        "example": "Concrete example"
        }}
    ]
    }}

    Do NOT include any text outside this JSON structure. Do NOT return explanations, notes, or comments.
    """


    groq_response = await get_groq_response(prompt)

    try:
        suggestions_json = extract_json(groq_response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Invalid response from Groq: {str(e)}")

    # --- Save suggestions inside the same resume doc ---
    await resume_collection.update_one(
        {"_id": ObjectId(resume_doc["id"])},  # always update the exact resume
        {"$set": {"suggestions": suggestions_json.get("suggestions", [])}}
    )

    return api_response(
        message="Resume improvement suggestions",
        status_code=200,
        data=suggestions_json
    )

@router.get("/score")
async def get_ats_score(current_user: dict = Depends(get_current_user)):
    firebase_uid = current_user.get("firebase_uid")
    resumes = await fetch_resumes_by_uid(firebase_uid)

    if not resumes:
        return api_response(message="No resumes found", status_code=404, data={})

    resume_doc = resumes[0]

    ats_data = resume_doc.get("ats")
    if not ats_data:
        return api_response(message="No ATS score found", status_code=404, data={})

    return api_response(
        message="ATS score fetched successfully",
        status_code=200,
        data=ats_data
    )


@router.get("/suggest")
async def get_resume_suggestions(current_user: dict = Depends(get_current_user)):
    firebase_uid = current_user.get("firebase_uid")
    resumes = await fetch_resumes_by_uid(firebase_uid)

    if not resumes:
        return api_response(message="No resumes found", status_code=404, data={})

    resume_doc = resumes[0]

    suggestions_data = resume_doc.get("suggestions")
    if not suggestions_data:
        return api_response(message="No suggestions found", status_code=404, data={})

    return api_response(
        message="Resume suggestions fetched successfully",
        status_code=200,
        data={"suggestions": suggestions_data}
    )
