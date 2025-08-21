from app. agents.agents import job_scraper, skills_extractor, profile_fetcher, master_agent

# Function: Scrape Jobs
def scrape_jobs(keyword: str):
    result = job_scraper.run(f"Find the latest LinkedIn jobs for keyword: {keyword}")
    return result

# Function: Extract Skills
def extract_skills(profile_text: str):
    result = skills_extractor.run(f"Extract skills and experience from this profile:\n{profile_text}")
    return result

# Function: Fetch Profile
def fetch_profile(profile_url: str):
    result = profile_fetcher.run(f"Fetch LinkedIn profile data from: {profile_url}")
    return result

# Function: Recommend Jobs (master agent uses all others)
def recommend_jobs(keyword: str, profile_text: str, profile_url: str):
    jobs = scrape_jobs(keyword)
    skills = extract_skills(profile_text)
    profile = fetch_profile(profile_url)

    master_prompt = f"""
    Candidate Profile:
    {profile}

    Skills Extracted:
    {skills}

    Jobs Scraped for "{keyword}":
    {jobs}

    Now, recommend the most relevant jobs for this candidate.
    """

    result = master_agent.run(master_prompt)
    return result
