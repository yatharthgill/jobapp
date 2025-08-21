from pydantic import BaseModel, EmailStr
class ScrapeResponse(BaseModel):
    task_id: str


