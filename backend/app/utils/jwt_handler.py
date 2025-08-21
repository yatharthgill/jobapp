from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from app.db.mongodb import db
from app.core.settings import settings
from typing import Dict, Any

# HTTPBearer is better than OAuth2PasswordBearer for JWT-only auth
bearer_scheme = HTTPBearer(auto_error=True)

def create_access_token(data: dict, expires_delta: int = settings.JWT_EXPIRE_MINUTES) -> str:
    """
    Create a JWT token for backend authentication.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_delta)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt


async def get_current_user(request: Request) -> Dict[str, Any]:
    """
    Get current user from backend JWT token stored in HTTP-only cookie.
    """
    token = request.cookies.get("appToken")
    if not token:
        raise HTTPException(status_code=403, detail="Not authenticated")

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        uid = payload.get("user_id")
        if not uid:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = await db["users"].find_one({"firebase_uid": uid})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")