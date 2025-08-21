import requests
from bs4 import BeautifulSoup

def fetch_internshala_jobs(skill: str):
    url = f"https://internshala.com/internships/{skill}-internship"
    r = requests.get(url)
    soup = BeautifulSoup(r.text, "html.parser")

    jobs = []
    for div in soup.find_all("div", class_="individual_internship"):
        title = div.find("h3").text.strip()
        company = div.find("p", class_="company-name").text.strip()
        jobs.append({"title": title, "company": company})

    return jobs
