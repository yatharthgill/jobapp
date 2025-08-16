import scrapy
from urllib.parse import urlencode

class LinkedinJobsSpider(scrapy.Spider):
    name = "linkedin_jobs"
    allowed_domains = ["linkedin.com"]

    def start_requests(self):
        domain = getattr(self, "domain", "").strip()
        location = getattr(self, "location", "").strip()

        if not domain or not location:
            self.logger.error("Both 'domain' and 'location' arguments are required.")
            return

        query_params = {"keywords": domain, "location": location}
        base_url = "https://www.linkedin.com/jobs/search/?" + urlencode(query_params)

        yield scrapy.Request(url=base_url, callback=self.parse)

    def parse(self, response):
        if response.status == 403:
            self.logger.error("Got 403 — LinkedIn blocked the request. You might need headers or login.")
            return

        jobs = response.css("ul.jobs-search__results-list li")
        print(jobs)

        if not jobs:
            self.logger.warning("No jobs found — LinkedIn may require login or selectors may be outdated.")
            return

        for job in jobs:
            title = job.css("h3.base-search-card__title::text").get()
            company = job.css("h4.base-search-card__subtitle a::text").get()
            if not company:
                # Fallback to plain text
                company = job.css("h4.base-search-card__subtitle::text").get()
            if company:
                company = company.strip()
            print(f"Company: {company}")
            location = job.css("span.job-search-card__location::text").get()
            url = job.css("a.base-card__full-link::attr(href)").get()

            yield {
                "title": title.strip() if title else "",
                "company": company.strip() if company else "",
                "location": location.strip() if location else "",
                "url": url.strip() if url else "",
                "source": "LinkedIn"
            }
