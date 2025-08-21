from fastapi import APIRouter
from app.services.suggester import suggest_improvements

router = APIRouter()

@router.post("/")
def suggest(resume_text: str, target_role: str | None = None):
    return suggest_improvements(resume_text, target_role)
