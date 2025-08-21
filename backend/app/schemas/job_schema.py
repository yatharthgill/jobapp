from pydantic import BaseModel

class JobIn(BaseModel):
    jobRole: str
    location: str

class LinkedinJobOut(BaseModel):
    id: str
    title: str
    company: str | None
    location: str | None
    url: str
    source: str

class InternshalaJobOut(BaseModel):
    id: str
    title: str
    company: str | None
    location: str | None
    salary: str | None
    url: str
    source: str