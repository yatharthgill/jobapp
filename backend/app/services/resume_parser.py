import aiohttp
import re
from app.utils.text_extract import extract_text



async def parse_resume_from_url(filename: str, file_url: str):
    # Download the file from Cloudinary

    text = extract_text(filename, file_url)
    cleaned_text = re.sub(r'\s+', ' ', text).strip() 

    return {
        "filename": filename,
        "content": cleaned_text,
    }
