from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    DATABASE_URL: str = Field(default="mongodb://localhost:27017'")
    REDIS_URL: str = Field(default="redis://localhost:6379/0")
    SCRAPYD_URL: str = Field(default="http://localhost:6800")

    class Config:
        env_file = "../.env"

settings = Settings()
