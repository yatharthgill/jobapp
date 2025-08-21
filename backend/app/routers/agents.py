from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.crew import job_recommendation_crew

router = APIRouter()

class JobRequest(BaseModel):
    keyword: str
    profile_text: str 
    profile_url: str

@router.post("/recommend-jobs")
async def recommend_jobs_route(req: JobRequest):
    result = job_recommendation_crew.kickoff(
        inputs={
            "keyword": req.keyword,
            "profile_text": req.profile_text,   # 👈 fixed (was username)
            "profile_url": req.profile_url,
        }
    )
    return {"recommendations": result}


@router.post("/recommend-jobs-new")
async def get_recommendations(req: JobRequest):
    # Call a helper/service function instead of the route
    from app.agents.functions import recommend_jobs  # 👈 import your helper here
    result = recommend_jobs(req.keyword, req.profile_text, req.profile_url)
    return {"recommendations": result}
