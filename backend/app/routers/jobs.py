from fastapi import APIRouter, HTTPException
from typing import List
from ..schemas.job_schema import JobOut
from ..db import db as db_module

router = APIRouter()

def serialize_job(job: dict) -> dict:
    """Convert MongoDB _id to id as string."""
    job["id"] = str(job["_id"])
    del job["_id"]
    return job

@router.get("", response_model=List[JobOut])
async def get_jobs():
    database = db_module.db
    if database is None:
        raise HTTPException(status_code=500, detail="Database not connected")
    jobs = await database.linkedin_jobs.find().to_list(100)
    return [serialize_job(job) for job in jobs]

