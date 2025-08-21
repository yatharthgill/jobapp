from crewai import Task
from app.agents.agents import job_scraper, skills_extractor, profile_fetcher, master_agent

# Job scraping task
scrape_jobs = Task(
    description="Find LinkedIn jobs for keyword: {keyword}",
    agent=job_scraper,
    expected_output="A list of job postings with title, company, and link",
)

# Skills extraction task
extract_skills = Task(
    description="Extract skills and experiences from LinkedIn profile: {profile_url}",
    agent=skills_extractor,
    expected_output="List of skills and experiences",
)

# Profile fetching task
fetch_profile = Task(
    description="Fetch LinkedIn profile for username: {username}",
    agent=profile_fetcher,
    expected_output="Full LinkedIn profile data in structured format",
)

# Master task
match_jobs = Task(
    description=(
        "Coordinate with other agents: fetch profile, extract skills, "
        "scrape jobs, and return a ranked list of jobs that fit the candidate."
    ),
    agent=master_agent,
    expected_output="Top 5 job recommendations with reasoning",
)
