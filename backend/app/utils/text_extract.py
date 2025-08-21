from io import BytesIO
import requests
import pdfplumber   

def extract_text(filename: str, file_url: str) -> str:
    response = requests.get(file_url)
    pdf_file = BytesIO(response.content)

    # Extract text
    text = ""
    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text