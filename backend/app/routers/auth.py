from fastapi import APIRouter, Response
from datetime import datetime
from app.schemas.user_schema import Token
from app.db.mongodb import db
from firebase_admin import auth as firebase_auth 
from app.utils.api_response import api_response
from app.utils.jwt_handler import create_access_token ,set_token_cookie
from app.core import firebase_config

router = APIRouter()
users_collection = db["users"]

# Signup
@router.post("/signup")
async def signup(token: Token, response: Response):
    try:
        decoded_token = firebase_auth.verify_id_token(token.token)
        uid = decoded_token["uid"]
        email = decoded_token.get("email")
        provider = decoded_token.get("firebase", {}).get("sign_in_provider", "email")

        users_collection.update_one(
            {"firebase_uid": uid},
            {"$setOnInsert": {
                "firebase_uid": uid,
                "email": email,
                "provider": provider,
                "created_at": datetime.now()
            }},
            upsert=True
        )

        backend_token = create_access_token({"user_id": uid, "email": email})
        set_token_cookie(response, backend_token)  # set cookie

        return api_response(
            message="User created successfully",
            data={"uid": uid, "email": email, "provider": provider},
            status_code=201
        )
    except Exception as e:
        return api_response(
            message="Error creating user",
            data={"error": str(e)},
            status_code=400
        )

# Login
@router.post("/login")
async def login(token: Token, response: Response):
    try:
        decoded_token = firebase_auth.verify_id_token(token.token)
        uid = decoded_token["uid"]
        email = decoded_token.get("email")
        provider = decoded_token.get("firebase", {}).get("sign_in_provider", "email")

        users_collection.update_one(
            {"firebase_uid": uid},
            {
                "$set": {"last_login": datetime.now()},
                "$setOnInsert": {
                    "firebase_uid": uid,
                    "email": email,
                    "provider": provider,
                    "created_at": datetime.now()
                }
            },
            upsert=True
        )

        backend_token = create_access_token({"user_id": uid, "email": email})
        set_token_cookie(response, backend_token)  # set cookie

        return api_response(
            message="User logged in successfully",
            data={"uid": uid, "email": email, "provider": provider},
            status_code=200
        )
    except Exception as e:
        return api_response(
            message="Login failed",
            data={"error": str(e)},
            status_code=400
        )

@router.post("/logout")
def logout(response: Response):
    """
    Logout user by clearing the auth cookie
    """
    response.delete_cookie(key="appToken", path="/")
    return api_response(
        message="Logout Successfull!",
        status_code=200
    )