from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import jobs, tasks, resume, profiles, ats, suggest, auth

app = FastAPI(title="JobApp API")



# Routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(profiles.router, prefix="/profiles", tags=["Profiles"])
app.include_router(resume.router, prefix="/resume", tags=["Resume"])
app.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
app.include_router(ats.router, prefix="/ats", tags=["ATS"])
app.include_router(suggest.router, prefix="/suggest", tags=["Suggestions"])


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://aijobapp.netlify.app"],  # TEMP: Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/")
def health():
    return {"status": "ok"}
