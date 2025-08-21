from fastapi import APIRouter, Depends
from app.db.mongodb import db
from app.utils.api_response import api_response
from app.utils.jwt_handler import get_current_user
from bson import ObjectId

router = APIRouter()


def serialize_job(job: dict) -> dict:
    """Convert MongoDB document to JSON serializable dict."""
    if not job:
        return None
    job["_id"] = str(job["_id"])
    return job


@router.get("/all")
async def get_all_jobs(current_user: dict = Depends(get_current_user)):
    try:
        user_id = str(current_user.get("firebase_uid"))
        jobs_doc = await db["user_jobs"].find_one({"user_id": user_id})

        if not jobs_doc:
            return api_response(data=[], message="No jobs found", status_code=200)

        return api_response(
            data=serialize_job(jobs_doc),
            message="All jobs fetched successfully",
            status_code=200,
        )

    except Exception as e:
        return api_response(message=f"Error fetching jobs: {str(e)}", status_code=500)
