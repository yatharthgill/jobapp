import httpx
import re


GITHUB_REGEX = re.compile(r"github.com/([A-Za-z0-9_-]+)")

async def analyze_github(username: str):
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(f"https://api.github.com/users/{username}")
        if r.status_code != 200:
            return {"error": "GitHub profile not found or API error"}
        user = r.json()
        return {
            "username": user.get("login"),
            "name": user.get("name"),
            "id": user.get("id"),
            "node_id": user.get("node_id"),
            "type": user.get("type"),
            "site_admin": user.get("site_admin"),
            "public_repos": user.get("public_repos"),
            "followers": user.get("followers"),
            "following": user.get("following"),
            "bio": user.get("bio"),
            "avatar_url": user.get("avatar_url"),
            "location": user.get("location"),
            "company": user.get("company"),
            "blog": user.get("blog"),
            "created_at": user.get("created_at"),
            "updated_at": user.get("updated_at"),
            "profile_url": user.get("html_url"),
        }
    
