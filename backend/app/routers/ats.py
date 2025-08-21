from fastapi import APIRouter
from app.services.ats_score import ats_score

router = APIRouter()

@router.post("/score")
def calculate_ats(resume_text: str, jd_text: str):
    return ats_score(resume_text, jd_text)
