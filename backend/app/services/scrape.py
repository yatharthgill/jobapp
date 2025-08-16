import aiohttp

SCRAPYD_BASE_URL = "http://localhost:6800"

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


async def schedule_scrape(project: str, spider: str, domain: str, location: str):
    """
    Schedule a Scrapy spider via Scrapyd.
    Returns the jobid if successfully scheduled, else None.
    """
    schedule_url = f"{SCRAPYD_BASE_URL}/schedule.json"
    payload = {
        "project": project,
        "spider": spider,
        "domain": domain,
        "location": location
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(schedule_url, data=payload) as resp:
            if resp.status != 200:
                text = await resp.text()
                print(f"Scrapyd schedule error: {resp.status}, {text}")
                return None

            data = await resp.json()
            if data.get("status") == "ok" and "jobid" in data:
                return data
            else:
                print(f"Scrapyd failed to schedule: {data}")
                return None
