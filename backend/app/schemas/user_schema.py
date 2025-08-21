from pydantic import BaseModel, EmailStr
class Token(BaseModel):
    token: str  = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjU3YmZiMmExMWRkZmZjMGFkMmU2ODE0YzY4NzYzYjhjNjg3NTgxZDgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vam9iYXBwLTA1IiwiYXVkIjoiam9iYXBwLTA1IiwiYXV0aF90aW1lIjoxNzU1NDEzNjI2LCJ1c2VyX2lkIjoib1hDQnRjOWpGSFl1emVaTzdHRVpwN0I2cXd0MSIsInN1YiI6Im9YQ0J0YzlqRkhZdXplWk83R0VacDdCNnF3dDEiLCJpYXQiOjE3NTU0MTM2MjYsImV4cCI6MTc1NTQxNzIyNiwiZW1haWwiOiJ5YXRoYXJ0aC5naWxsLmRldkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsieWF0aGFydGguZ2lsbC5kZXZAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.KVQsj3l-y2HXRbi_zk63OMjhJCKvgDbOpK9kbqsg9SFMV_FML4qxivcINTbShSrnWKIxIEN-C-G7FCBHE_llD4PT9Gd6RKa4VO6wABCm6PDDuoSyW_b7VDn73t3Sp7_GVTjSMo0gRJCaK9s-HmK2A72CP6soyHXFCBXwk2JB3nj6PoJzuLbRg_3Bsee0T7AwAqKSmlaxcOd_r7ceKYliOS6vCjebRaqbl0AaT0HXVHJ5DiMYt-TQlh0FziTiofmHsXHIpQx9Aa7hXAs0IFljz22gXA6rZtR6eZ2cmFlbUKwhAWmpQXYZQZ1AXxOrmt6dX3hAnJ96khyz6V4rzVpP8A"


from pydantic import BaseModel, EmailStr, Field

class UserProfile(BaseModel):
    firebase_uid: str
    email: EmailStr
    first_name: str | None = None
    last_name: str | None = None
    phone_number: str | None = None
    profile_picture: str | None = None
    github_link: str | None = None
    linkedin_link: str | None = None
    bio: str | None = None
    skills: list[str] = Field(default_factory=list)
    experience: list[dict] = Field(default_factory=list)
    projects: list[dict] = Field(default_factory=list)
    certifications: list[dict] = Field(default_factory=list)
    languages: list[str] = Field(default_factory=list)
    education: list[dict] = Field(default_factory=list)
    github_analysis: list[dict] = Field(default_factory=list)
    created_at: str
    updated_at: str | None = None
