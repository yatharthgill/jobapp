from app.db.mongodb import db

resume_collection = db["resumes"]

async def fetch_resumes_by_uid(firebase_uid: str):
    try:
        resumes = await resume_collection.find({"firebase_uid": firebase_uid}).to_list(100)

        if not resumes:
            return []

        # Serialize _id
        serialized = []
        for resume in resumes:
            resume["id"] = str(resume["_id"])
            del resume["_id"]
            serialized.append(resume)

        return serialized
    except Exception as e:
        raise RuntimeError(f"Error fetching resumes: {str(e)}")
