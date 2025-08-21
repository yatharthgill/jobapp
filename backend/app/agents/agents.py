from crewai import Agent
from langchain_groq import ChatGroq
from app.core.settings import settings

# Load model
llm = ChatGroq(
    model_name="groq/llama-3.3-70b-versatile",
    temperature=0.7,
    api_key=settings.GROQ_API_KEY
)

# Agent 1: Job Scraper
job_scraper = Agent(
    role="Job Scraper",
    goal="Scrape LinkedIn jobs for given keywords",
    backstory="Expert at finding jobs on LinkedIn and returning structured job data.",
    llm=llm,
)

# Agent 2: Skills Extractor
skills_extractor = Agent(
    role="Skills Extractor",
    goal="Extract skills and experiences from LinkedIn profiles",
    backstory="HR AI that parses LinkedIn profiles and highlights skills.",
    llm=llm,
)

# Agent 3: Profile Fetcher
profile_fetcher = Agent(
    role="Profile Fetcher",
    goal="Fetch LinkedIn profile data for given usernames",
    backstory="Searches LinkedIn and retrieves profile details.",
    llm=llm,
)

# Master Agent
master_agent = Agent(
    role="Master Recruiter",
    goal="Find the best matching jobs for a candidate",
    backstory="A recruiter AI that coordinates with other agents to match jobs with candidate profiles.",
    llm=llm,
)
