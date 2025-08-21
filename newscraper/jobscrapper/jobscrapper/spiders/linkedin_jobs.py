import scrapy
from urllib.parse import urlencode
from jobscrapper.items import LinkedinJobScraperItem


class LinkedinJobsSpider(scrapy.Spider):
    name = "linkedin_jobs"
    allowed_domains = ["linkedin.com"]

    custom_headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                      "AppleWebKit/537.36 (KHTML, like Gecko) "
                      "Chrome/115.0 Safari/537.36"
    }

    def start_requests(self):
        domain = getattr(self, "domain", "").strip()
        location = getattr(self, "location", "").strip()
        user_id = getattr(self, "user_id", None)

        if not domain or not location:
            self.logger.error("❌ Both 'domain' and 'location' arguments are required.")
            return

        query_params = {"keywords": domain, "location": location}
        base_url = "https://www.linkedin.com/jobs/search/?" + urlencode(query_params)

        yield scrapy.Request(
            url=base_url,
            headers=self.custom_headers,
            callback=self.parse,
            cb_kwargs={"user_id": user_id}
        )

    def clean_text(self, text):
        """Helper to strip and handle None."""
        return text.strip() if text else ""

    def parse(self, response, user_id):
        if response.status == 403:
            self.logger.error("🚫 Got 403 — LinkedIn blocked the request. Add proxies, rotate UA, or login.")
            return

        jobs = response.css("ul.jobs-search__results-list li")
        if not jobs:
            self.logger.warning("⚠️ No jobs found — selectors may be outdated or login required.")
            return

        for job in jobs:
            item = LinkedinJobScraperItem()

            item["title"] = self.clean_text(job.css("h3.base-search-card__title::text").get())
            item["company"] = self.clean_text(
                job.css("h4.base-search-card__subtitle a::text").get()
                or job.css("h4.base-search-card__subtitle::text").get()
            )
            item["location"] = self.clean_text(job.css("span.job-search-card__location::text").get())
            item["url"] = self.clean_text(job.css("a.base-card__full-link::attr(href)").get())
            item["published"] = self.clean_text(job.css("time.job-search-card__listdate::attr(datetime)").get())
            item["source"] = "LinkedIn"
            item["user_id"] = user_id

            yield item
