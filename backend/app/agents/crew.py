from crewai import Crew
from app.agents.tasks import scrape_jobs, extract_skills, fetch_profile, match_jobs

# Define Crew (all agents working together)
job_recommendation_crew = Crew(
    agents=[scrape_jobs.agent, extract_skills.agent, fetch_profile.agent, match_jobs.agent],
    tasks=[scrape_jobs, extract_skills, fetch_profile, match_jobs],
)
