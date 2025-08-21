import scrapy
import re
from datetime import datetime, timedelta
from jobscrapper.items import InternshalaJobScraperItem


class InternshalaJobsSpider(scrapy.Spider):
    name = "internshala_jobs"
    allowed_domains = ["internshala.com"]

    custom_headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/115.0 Safari/537.36"
        )
    }

    def start_requests(self):
        domain = getattr(self, "domain", "").strip()
        location = getattr(self, "location", "").strip()
        user_id = getattr(self, "user_id", None)

        if not domain or not location:
            self.logger.error("❌ Both 'domain' and 'location' arguments are required.")
            return

        base_url = f"https://internshala.com/fresher-jobs/{domain}-jobs-in-{location}"
        yield scrapy.Request(
            url=base_url,
            headers=self.custom_headers,
            callback=self.parse,
            cb_kwargs={"user_id": user_id}
        )

    def clean_text(self, text: str) -> str:
        """Helper function to safely strip text."""
        return text.strip() if text else ""

    def parse_posted_date(self, posted_text: str) -> str:
        """Convert Internshala 'posted' text into YYYY-MM-DD date string."""
        posted_text = posted_text.lower().strip()
        today = datetime.today()

        if "today" in posted_text:
            return today.strftime("%Y-%m-%d")
        elif "yesterday" in posted_text:
            return (today - timedelta(days=1)).strftime("%Y-%m-%d")

        # Days
        match = re.search(r"(\d+)\s+day", posted_text)
        if match:
            days = int(match.group(1))
            return (today - timedelta(days=days)).strftime("%Y-%m-%d")

        # Weeks
        match = re.search(r"(\d+)\s+week", posted_text)
        if match:
            weeks = int(match.group(1))
            return (today - timedelta(weeks=weeks)).strftime("%Y-%m-%d")

        # Months (approximate as 30 days)
        match = re.search(r"(\d+)\s+month", posted_text)
        if match:
            months = int(match.group(1))
            return (today - timedelta(days=months * 30)).strftime("%Y-%m-%d")

        # Hours/minutes → treat as today
        if "hour" in posted_text or "minute" in posted_text:
            return today.strftime("%Y-%m-%d")

        # Fallback
        return today.strftime("%Y-%m-%d")

    def parse(self, response, user_id):
        jobs = response.css("div.container-fluid.individual_internship")
        self.logger.info(f"✅ Found {len(jobs)} jobs on {response.url}")

        if not jobs:
            self.logger.warning("⚠️ No jobs found — check selectors or login requirement.")
            return

        for job in jobs:
            item = InternshalaJobScraperItem()
            item["title"] = self.clean_text(job.css("a.job-title-href::text").get())
            item["company"] = self.clean_text(job.css("p.company-name::text").get())
            item["location"] = self.clean_text(job.css("p.locations a::text").get())
            item["salary"] = self.clean_text(
                job.css("div.row-1-item i.ic-16-money + span.desktop::text").get()
            )
            item["url"] = response.urljoin(job.css("a.job-title-href::attr(href)").get())
            item["source"] = "Internshala"
            item["user_id"] = user_id

            # ✅ Posted date conversion
            posted_raw = self.clean_text(job.css("div.color-labels > div > span::text").get())
            item["published"] = self.parse_posted_date(posted_raw)

            yield item

        # Pagination
        next_page = response.css('a[rel="next"]::attr(href)').get()
        if next_page:
            self.logger.info(f"➡️ Moving to next page: {next_page}")
            yield response.follow(
                next_page,
                headers=self.custom_headers,
                callback=self.parse,
                cb_kwargs={"user_id": user_id}
            )
        else:
            self.logger.info("🏁 No more pages left.")
