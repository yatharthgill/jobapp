import motor.motor_asyncio
from scrapy.exceptions import DropItem

class MongoDBPipeline:
    def __init__(self, mongo_uri, mongo_db, mongo_collection):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db
        self.mongo_collection = mongo_collection
        self.saved_count = 0

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_uri=crawler.settings.get("MONGO_URI"),
            mongo_db=crawler.settings.get("MONGO_DATABASE"),
            mongo_collection=crawler.settings.get("MONGO_COLLECTION")
        )

    def open_spider(self, spider):
        self.client = motor.motor_asyncio.AsyncIOMotorClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]

    def close_spider(self, spider):
        self.client.close()
        spider.logger.info(f"Saved {self.saved_count} items to MongoDB")

    async def process_item(self, item, spider):
        existing = await self.db[self.mongo_collection].find_one({"url": item["url"]})
        if existing:
            raise DropItem(f"Duplicate job found: {item['title']}")

        await self.db[self.mongo_collection].insert_one(dict(item))
        self.saved_count += 1
        return item
