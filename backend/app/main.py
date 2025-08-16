from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import jobs, tasks, resumes, email
from .db.db import connect_to_mongo, close_mongo_connection, db

app = FastAPI(title="JobApp API")



app.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
app.include_router(resumes.router, prefix="/resumes", tags=["Resumes"])
app.include_router(email.router, prefix="/email", tags=["Email"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TEMP for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

@app.get("/")
def health():
    return {"status": "ok"}
