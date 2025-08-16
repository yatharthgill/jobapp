from fastapi import APIRouter
from ..schemas.job_schema import JobIn
from ..services.scrape import schedule_scrape, check_scrape_status
import asyncio
router = APIRouter()


@router.post("/scrape")
async def start_scrape(job: JobIn):
    result = await schedule_scrape(
        project="jobscrapper",
        spider="linkedin_jobs",
        domain=job.jobRole,
        location=job.location
    )
    if not result:
        return {"jobid": None, "status": "failed"}
    return {"jobid": result.get("jobid"), "status": "scheduled"}

@router.get("/scrape/status/{job_id}")
async def get_scrape_status(job_id: str, project: str = "jobscrapper"):
    """
    Check the status of a Scrapyd job.
    Returns 'pending', 'running', 'finished', 'failed', or 'not_found'.
    """
    timeout_seconds = 10  # total wait time
    poll_interval = 1     # seconds between checks
    waited = 0

    while waited < timeout_seconds:
        status_data = await check_scrape_status(project, job_id)
        if status_data["status"] != "not_found":
            return status_data
        await asyncio.sleep(poll_interval)
        waited += poll_interval

    # If still not found after timeout
    return {"status": "not_found", "job": None}
