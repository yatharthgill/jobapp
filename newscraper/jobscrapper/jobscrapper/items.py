import scrapy


class LinkedinJobScraperItem(scrapy.Item):
    title = scrapy.Field()
    company = scrapy.Field()
    location = scrapy.Field()
    url = scrapy.Field()
    published = scrapy.Field()
    source = scrapy.Field()
    user_id = scrapy.Field()


class InternshalaJobScraperItem(scrapy.Item):
    title = scrapy.Field()
    company = scrapy.Field()
    location = scrapy.Field()
    salary = scrapy.Field()
    url = scrapy.Field()
    source = scrapy.Field()
    published = scrapy.Field()
    user_id = scrapy.Field()
