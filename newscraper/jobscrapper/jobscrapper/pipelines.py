import pymongo
from scrapy.exceptions import DropItem

class MongoDBPipeline:
    def __init__(self, mongo_uri, mongo_db):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_uri='mongodb+srv://yatharthchaudhary05:yatharth05@cluster0.tstdfjz.mongodb.net/',
            mongo_db='jobsapp'
        )

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]
        self.collection = self.db['user_jobs']

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):

        user_id = item.get('user_id')
        if not user_id:
            raise DropItem("Missing user_id in item")

        source = item.get('source', '').lower().strip()
        if not source:
            raise DropItem("Missing or invalid source in item")

        job_data = {
            'title': item['title'],
            'company': item['company'],
            'location': item['location'],
            'salary': item.get('salary', ''),
            'url': item['url'],
            'source': source,
            'published': item.get('published', ''),
        }

        # Check for duplicate job for this user
        query = {
            'user_id': user_id,
            f'jobs.{source}': {'$elemMatch': {'title': item['title'], 'company': item['company']}}
        }
        if self.collection.find_one(query):
            raise DropItem(f"Duplicate job for user {user_id}: {item['title']} at {item['company']} ({source})")

        # Ensure 'jobs' and 'jobs.source' exist
        self.collection.update_one(
            {'user_id': user_id},
            {'$setOnInsert': {'jobs': {}}},
            upsert=True
        )

        # Add job under the correct source
        self.collection.update_one(
            {'user_id': user_id},
            {'$push': {f'jobs.{source}': job_data}}
        )

        return item
