from fastapi import APIRouter , Depends
from ..schemas.job_schema import JobIn
from ..services.scrape import schedule_scrape, check_scrape_status
import asyncio
from app.utils.jwt_handler import get_current_user
router = APIRouter()

@router.post("/scrape")
async def start_scrape(job: JobIn , current_user: dict = Depends(get_current_user)):
    spiders = ["linkedin_jobs", "internshala_jobs"]
    user_id = current_user.get("firebase_uid")
    print("userid",user_id)
    tasks = [
        schedule_scrape(
            project="jobscrapper",
            spider=spider,
            domain=job.jobRole,
            location=job.location,
            user_id=user_id
        )
        for spider in spiders
    ]

    results = await asyncio.gather(*tasks, return_exceptions=True)

    response = []
    for spider, result in zip(spiders, results):
        if isinstance(result, Exception) or not result:
            response.append({"spider": spider, "jobid": None, "status": "failed"})
        else:
            response.append({"spider": spider, "jobid": result.get("jobid"), "status": "scheduled"})

    return response


@router.get("/scrape/status/{job_id}")
async def get_scrape_status(job_id: str, project: str = "jobscrapper"):
    """
    Check the status of a Scrapyd job.
    Returns 'pending', 'running', 'finished', 'failed', or 'not_found'.
    """
    timeout_seconds = 10
    poll_interval = 1
    waited = 0

    while waited < timeout_seconds:
        status_data = await check_scrape_status(project, job_id)
        if status_data["status"] != "not_found":
            return status_data
        await asyncio.sleep(poll_interval)
        waited += poll_interval

    return {"status": "not_found", "job": None}
