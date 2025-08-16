from pydantic import BaseModel

class JobIn(BaseModel):
    jobRole: str
    location: str

class JobOut(BaseModel):
    id: str
    title: str
    company: str | None
    location: str | None
    url: str
    source: str