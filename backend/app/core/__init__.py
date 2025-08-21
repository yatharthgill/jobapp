import os
from pydantic import BaseModel

class Settings(BaseModel):
    ALLOW_ORIGINS: list[str] = ["*"]
    GITHUB_TOKEN: str | None = os.getenv("GITHUB_TOKEN")

settings = Settings()