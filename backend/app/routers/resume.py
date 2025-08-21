from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.services.resume_parser import parse_resume_from_url
from app.services.cloudinary import upload_resume as upload_to_cloudinary
from app.db.mongodb import db
from app.utils.api_response import api_response
from app.utils.jwt_handler import get_current_user
from app.services.resume import fetch_resumes_by_uid

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
        cloudinary_res = upload_to_cloudinary(file)
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
        resumes = await fetch_resumes_by_uid(firebase_uid)
        if not resumes:
            return api_response(message="No resumes found", data=[])

        return api_response(data=resumes, message="Resumes fetched successfully")
    except Exception as e:
        return api_response(message=str(e), status_code=500)