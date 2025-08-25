import re
import json
from collections import OrderedDict
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from fastapi.encoders import jsonable_encoder
from app.utils.api_response import api_response
from app.utils.groq import get_groq_response
from app.schemas.user_schema import UserProfile
from app.services.resume import fetch_resumes_by_uid
from app.db.mongodb import db
from app.utils.jwt_handler import get_current_user  # <- your auth util
from app.services.profile_analyzer import analyze_github
from bson import ObjectId

router = APIRouter()
profile_collection = db["profiles"]

@router.post("/analyze/github")
async def analyze_github_profile(
    github_username: str,
    current_user: dict = Depends(get_current_user)
):
    """Analyze GitHub profile and return structured data, store in profile"""
    try:
        if not github_username:
            raise HTTPException(status_code=400, detail="GitHub username is required")

        response = await analyze_github(github_username)
        if "error" in response:
            raise HTTPException(status_code=404, detail=response["error"])

        # Add the GitHub analysis to the user's profile under github_analysis array
        await profile_collection.update_one(
            {"firebase_uid": current_user["firebase_uid"]},
            {"$set": {"github_analysis": response}},  # push the new analysis
            upsert=True  # create profile if it doesn't exist
        )
        # Fetch the updated profile
        updated_profile = await profile_collection.find_one(
            {"firebase_uid": current_user["firebase_uid"]},
            {"_id": 0}  # exclude MongoDB internal ID
        )

        safe_json = jsonable_encoder(updated_profile, custom_encoder={ObjectId: str})

        return api_response(
            data=safe_json,
            message="GitHub profile analyzed and saved successfully",
            status_code=200
        )

    except Exception as e:
        return api_response(
            message=f"Error analyzing GitHub profile: {str(e)}",
            status_code=500
        )

@router.post("/create")
async def create_profile(
    profile_data: UserProfile | None = None,
    current_user: dict = Depends(get_current_user)
):
    # 1️⃣ Fetch resumes
    resumes = await fetch_resumes_by_uid(current_user["firebase_uid"])
    profile_dict = None
    resume_data = resumes[0] if resumes else None

    if resume_data and resume_data.get("parsed_data", {}).get("content"):
        resume_text = resume_data["parsed_data"]["content"]

        groq_prompt = f"""
        Convert the following resume text into JSON matching the UserProfile schema.
        Only return valid JSON. Do not include explanations or markdown fences.

        Resume text:
        {resume_text}

        Schema fields:
        id, firebase_uid, email, first_name, last_name, phone_number, profile_picture,
        github_link, linkedin_link, bio, skills, experience, projects, certifications,
        languages, education, created_at, updated_at.
        """
        groq_response = await get_groq_response(groq_prompt)
        print(groq_response)

        try:
            match = re.search(r"```json\s*(.*?)```", groq_response, re.DOTALL)
            clean_json = match.group(1).strip() if match else groq_response.strip()
            profile_dict = json.loads(clean_json)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse Groq response into JSON: {str(e)}"
            )
    elif profile_data:
        profile_dict = profile_data.model_dump()
    else:
        raise HTTPException(
            status_code=400,
            detail="No resume data (parsed text) found and no profile input provided."
        )

    # 2️⃣ Ensure firebase_uid & email are correct
    profile_dict["firebase_uid"] = current_user["firebase_uid"]
    profile_dict["email"] = current_user["email"]

    # 3️⃣ GitHub analysis
    profile_dict["github_analysis"] = []  # default empty list

    github_link = profile_dict.get("github_link")
    if github_link:
        if not github_link.startswith("http"):
            github_link = "https://" + github_link
        profile_dict["github_link"] = github_link

        match = re.search(r"github\.com/([A-Za-z0-9_-]+)", github_link)
        if match:
            github_username = match.group(1)
            response = await analyze_github(github_username)
            if "error" not in response:
                profile_dict["github_analysis"] = [response]

    # 4️⃣ Build ordered dict to preserve field order exactly
    ordered_profile = OrderedDict(
        [
            ("firebase_uid", profile_dict["firebase_uid"]),
            ("email", profile_dict["email"]),
            ("first_name", profile_dict.get("first_name")),
            ("last_name", profile_dict.get("last_name")),
            ("phone_number", profile_dict.get("phone_number")),
            ("profile_picture", profile_dict.get("profile_picture")),
            ("github_link", profile_dict.get("github_link")),
            ("linkedin_link", profile_dict.get("linkedin_link")),
            ("bio", profile_dict.get("bio")),
            ("skills", profile_dict.get("skills") or []),
            ("experience", profile_dict.get("experience") or []),
            ("projects", profile_dict.get("projects") or []),
            ("certifications", profile_dict.get("certifications") or []),
            ("languages", profile_dict.get("languages") or []),
            ("education", profile_dict.get("education") or []),
            ("github_analysis", profile_dict.get("github_analysis") or []),
            ("created_at", profile_dict.get("created_at") or datetime.now(timezone.utc).isoformat()),
            ("updated_at", datetime.now(timezone.utc).isoformat())
        ]
    )

    # 5️⃣ Upsert into MongoDB
    try:
        await profile_collection.update_one(
            {"firebase_uid": current_user["firebase_uid"]},
            {"$set": jsonable_encoder(ordered_profile)},
            upsert=True
        )

        saved_profile = await profile_collection.find_one(
            {"firebase_uid": current_user["firebase_uid"]},
            {"_id": 0}  # exclude MongoDB _id from response
        )

        return api_response(
            data=saved_profile,
            message="User profile created/updated successfully",
            status_code=200
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error saving profile to database: {str(e)}"
        )
@router.get("/me")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Fetch profile of logged-in user"""
    profile = await profile_collection.find_one(
        {"firebase_uid": current_user["firebase_uid"]},
        {"_id": 0}  # exclude ObjectId
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    safe_json = jsonable_encoder(profile, custom_encoder={ObjectId: str})

    return api_response(
        data=safe_json,
        message="User profile fetched successfully",
        status_code=200
    )

@router.put("/update")
async def update_profile(
    updates: dict,
    current_user: dict = Depends(get_current_user)
):
    """Update logged-in user's profile"""
    profile = await profile_collection.find_one({"firebase_uid": current_user["firebase_uid"]})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    updates["updated_at"] = datetime.now(timezone.utc).isoformat()

    await profile_collection.update_one(
        {"firebase_uid": current_user["firebase_uid"]},
        {"$set": updates}
    )

    updated_profile = await profile_collection.find_one(
        {"firebase_uid": current_user["firebase_uid"]},
        {"_id": 0}
    )

    safe_json = jsonable_encoder(updated_profile, custom_encoder={ObjectId: str})

    return api_response(
        data=safe_json,
        message="User profile updated successfully",
        status_code=200
    )
