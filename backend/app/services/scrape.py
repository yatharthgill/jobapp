import aiohttp
from app.core.settings import settings

SCRAPYD_BASE_URL = settings.SCRAPYD_BASE_URL

async def check_scrape_status(project: str, jobid: str):
    listjobs_url = f"{SCRAPYD_BASE_URL}/listjobs.json"
    async with aiohttp.ClientSession() as session:
        params = {"project": project}
        async with session.get(listjobs_url, params=params) as resp:
            if resp.status != 200:
                text = await resp.text()
                print(f"Error fetching job list: {resp.status}, {text}")
                return {"status": "error", "job": None}

            data = await resp.json()
            for status, jobs in data.items():
                if isinstance(jobs, list):
                    for job in jobs:
                        if job.get("id") == jobid:
                            return {"status": status, "job": job}
            return {"status": "not_found", "job": None}


async def schedule_scrape(project: str, spider: str, domain: str, location: str , user_id: str):
    """
    Schedule a Scrapy spider via Scrapyd.
    Returns the jobid if successfully scheduled, else None.
    """
    schedule_url = f"{SCRAPYD_BASE_URL}/schedule.json"
    payload = {
        "project": project,
        "spider": spider,
        "domain": domain,
        "location": location,
        "user_id": user_id
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(schedule_url, data=payload) as resp:
                text = await resp.text()
                if resp.status != 200:
                    print(resp)
                    print(f"Scrapyd schedule error: {resp.status}, {text}")
                    return None

                data = await resp.json()
                jobid = data.get("jobid")
                if data.get("status") == "ok" and jobid:
                    return {"jobid": jobid}
                else:
                    print(f"Scrapyd failed to schedule '{spider}': {data}")
                    return None
    except Exception as e:
        print(f"Exception while scheduling '{spider}': {e}")
        return None
