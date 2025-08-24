from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GITHUB_TOKEN: str
    SECRET_KEY: str
    JWT_EXPIRE_DAYS: int 
    MONGO_URI: str
    DB_NAME: str
    FIREBASE_CREDENTIALS_PATH: str
    SCRAPYD_BASE_URL:str
    GROQ_API_KEY : str
    ENVIRONMENT:str

    class Config:
        env_file = ".env"

settings = Settings()
