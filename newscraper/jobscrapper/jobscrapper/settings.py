import logging

# ----------------------------
# Basic Logging
# ----------------------------
LOG_LEVEL = 'INFO'
logging.getLogger("pymongo").setLevel(logging.WARNING)

# ----------------------------
# Bot / Project Settings
# ----------------------------
BOT_NAME = "jobscrapper"

SPIDER_MODULES = ["jobscrapper.spiders"]
NEWSPIDER_MODULE = "jobscrapper.spiders"

MONGO_URI = "mongodb://localhost:27017"
MONGO_DATABASE = "jobapp"
MONGO_COLLECTION = "linkedin_jobs"

ROBOTSTXT_OBEY = False
DOWNLOAD_DELAY = 0.5

SCRAPERAPI_KEY = "62c50c17b8a9f46e120679a59624346f"

DEFAULT_REQUEST_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/127.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9"
}

ITEM_PIPELINES = {
    'jobscrapper.pipelines.MongoDBPipeline': 300,
}

