import cloudinary
import cloudinary.uploader
from fastapi import UploadFile

cloudinary.config( 
    cloud_name = "drjpjrhkt", 
    api_key = "749658735275817", 
    api_secret = "njBl3E9CHTy4Syz8NX8JVqzOcSc" 
)

def upload_resume(file: UploadFile):
    return cloudinary.uploader.upload(
        file.file,
        resource_type="raw",
        folder="resumes",
        public_id=file.filename.rsplit(".", 1)[0],
        use_filename=True,       
        unique_filename=False       
    )
