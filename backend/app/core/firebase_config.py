import firebase_admin
from firebase_admin import credentials
from app.core.settings import settings

cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
firebase_admin.initialize_app(cred)
