from motor.motor_asyncio import AsyncIOMotorClient  # type: ignore
import asyncio
from app.core.settings import settings

MONGO_URI = settings.MONGO_URI
DB_NAME = settings.DB_NAME


client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

async def check_mongo_connection():
    try:
        await client.admin.command('ping')
        print("✅ Connected to MongoDB Atlas")
    except Exception as e:
        print("❌ MongoDB connection failed:", e)

# Run the check
try:
    loop = asyncio.get_running_loop()
except RuntimeError:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
loop.create_task(check_mongo_connection())
