import cloudinary
import cloudinary.uploader
from fastapi import UploadFile

cloudinary.config( 
    cloud_name = "drjpjrhkt", 
    api_key = "749658735275817", 
    api_secret = "njBl3E9CHTy4Syz8NX8JVqzOcSc" 
)

def upload_resume(file: UploadFile, user_id: str):
    public_id = f"{user_id}_{file.filename.rsplit('.', 1)[0]}"
    return cloudinary.uploader.upload(
        file.file,
        resource_type="raw",
        folder="resumes",
        public_id=public_id,
        use_filename=True,
        unique_filename=False,
        overwrite=True
    )

