from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.services.resume_parser import parse_resume_from_url
from app.services.cloudinary import upload_resume as upload_to_cloudinary
from app.db.mongodb import db
from app.utils.api_response import api_response
from app.utils.jwt_handler import get_current_user
from app.services.resume import fetch_resumes_by_uid
from app.utils.groq import get_groq_response
import re
import json
from bson import ObjectId

router = APIRouter()
resume_collection = db["resumes"]


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    try:
        # Ensure firebase_uid exists
        firebase_uid = current_user.get("firebase_uid")
        if not firebase_uid:
            raise HTTPException(status_code=400, detail="Firebase UID missing. Cannot save resume.")

        # Upload to Cloudinary
        cloudinary_res = upload_to_cloudinary(file , user_id=firebase_uid)
        cloudinary_url = cloudinary_res.get("secure_url")
        if not cloudinary_url:
            return api_response(message="Failed to upload file to Cloudinary", status_code=500)

        # Save to MongoDB
        resume_doc = {
            "file_url": cloudinary_url,
            "firebase_uid": firebase_uid,
            "parsed": False
        }
        result = await resume_collection.insert_one(resume_doc)

        return api_response(
            data={"id": str(result.inserted_id), "file_url": cloudinary_url},
            message="File uploaded and saved successfully"
        )
    except Exception as e:
        return api_response(message=f"Error uploading resume: {str(e)}", status_code=500)


@router.post("/parse")
async def parse_resume(current_user: dict = Depends(get_current_user)):
    try:
        firebase_uid = current_user.get("firebase_uid")
        if not firebase_uid:
            raise HTTPException(status_code=400, detail="Firebase UID missing.")

        # Fetch resume by id & user
        resume_doc = await resume_collection.find_one({
            "firebase_uid": firebase_uid
        })
        if not resume_doc:
            raise HTTPException(status_code=404, detail="Resume not found for this user")

        file_url = resume_doc["file_url"]
        filename = file_url.split("/")[-1]

        # Parse the resume
        parsed_data = await parse_resume_from_url(filename, file_url)

        # Update resume with parsed data
        await resume_collection.update_one(
            {"firebase_uid": firebase_uid},
            {"$set": {"parsed_data": parsed_data, "parsed": True}}
        )

        return api_response(
            message="Resume parsed and updated successfully",
            data={"firebase_uid": firebase_uid, "file_url": file_url, "parsed_data": parsed_data}
        )
    except Exception as e:
        return api_response(message=f"Error parsing resume: {str(e)}", status_code=500)


@router.get("/resumes")
async def get_resumes(current_user: dict = Depends(get_current_user)):
    firebase_uid = current_user.get("firebase_uid")
    if not firebase_uid:
        raise HTTPException(status_code=400, detail="Firebase UID missing.")

    try:
        # 1️⃣ Fetch resumes
        resumes = await fetch_resumes_by_uid(firebase_uid)
        if not resumes:
            return api_response(message="No resumes found", data=[])

        resume_data = resumes[0]  # take first resume
        profile_dict = resume_data.get("profile")

        if not profile_dict:
            # Only call AI if structured profile is missing
            parsed_content = resume_data.get("parsed_data", {}).get("content")
            if parsed_content:
                groq_prompt = f"""
                You are an AI that extracts structured information from resumes. 
                Your task is to convert the following resume text into a clean JSON object.

                Rules:
                1. Always include the required fields listed below in the JSON (even if empty).
                2. Dynamically add any additional relevant fields found in the resume 
                (e.g., hobbies, awards, publications, volunteering, interests, portfolio, patents, etc.).
                3. Do not include null, empty, or placeholder values. Remove such fields entirely.
                4. Ensure arrays (skills, experience, projects, certifications, languages, education) 
                are properly formatted as JSON arrays of objects or strings.
                5. The JSON must be syntactically valid and parseable.
                6. Only return the JSON object. Do not add explanations, comments, or markdown fences.

                Resume text:
                {parsed_content}

                Required schema fields:
                email, name, phone_number, github_link, linkedin_link, bio, 
                skills, experience, projects, certifications, languages, education
                """

                groq_response = await get_groq_response(groq_prompt)

                try:
                    # Clean Groq response → JSON
                    match = re.search(r"```json\s*(.*?)```", groq_response, re.DOTALL)
                    clean_json = match.group(1).strip() if match else groq_response.strip()
                    profile_dict = json.loads(clean_json)


                    await resume_collection.update_one(
                            {"firebase_uid": str(firebase_uid)},
                            {"$set": {"profile": profile_dict}}
                        )

                except Exception as e:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Failed to parse Groq response into JSON: {str(e)}"
                    )

        return api_response(
            data={"resumes": resumes, "profile": profile_dict},
            message="Resumes fetched successfully"
        )

    except Exception as e:
        return api_response(message=str(e), status_code=500)