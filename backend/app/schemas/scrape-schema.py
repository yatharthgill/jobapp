from pydantic import BaseModel
class ScrapeResponse(BaseModel):
    task_id: str