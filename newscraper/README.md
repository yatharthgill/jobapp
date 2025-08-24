# Newscraper - JobApp

The newscraper component of the JobApp is responsible for scraping job listings from various sources, primarily LinkedIn, using Scrapy.

## 🚀 Features

- **Scrapy**: A powerful web scraping framework for Python.
- **Scrapyd**: A service daemon for running Scrapy spiders.
- **LinkedIn Integration**: Scrapes job listings from LinkedIn.
- **Real-time Updates**: Continuously monitors and updates job listings.

## 📁 Project Structure

```
newscraper/
├── jobscrapper/
│   ├── spiders/
│   │   └── linkedin_jobs.py  # LinkedIn job scraper
│   ├── settings.py           # Scrapy configuration
│   └── pipelines.py          # Data processing pipelines
├── scrapy.cfg               # Scrapy project configuration
└── scrapyd.conf             # Scrapyd service configuration
```

## 🛠️ Setup Instructions

1. Navigate to the newscraper directory:
   ```bash
   cd newscraper
   ```

2. Install Scrapy and Scrapyd:
   ```bash
   pip install scrapy scrapyd
   ```

3. Deploy the spider:
   ```bash
   scrapyd-deploy
   ```

## 🔧 Configuration

### Scrapy Configuration

The LinkedIn scraper can be configured with:
- `domain`: Job role keywords (e.g., "software engineer")
- `location`: Job location (e.g., "San Francisco, CA")

### Environment Variables

Create a `.env` file in the newscraper directory:

```env
SCRAPYD_URL=http://localhost:6800
SCRAPYD_PROJECT=jobscrapper
```

## 🐛 Troubleshooting

### Common Issues

1. **Scraping failures**: LinkedIn may block requests - consider using rotating proxies.
2. **Configuration errors**: Ensure the Scrapy settings are correctly configured.
3. **Deployment issues**: Check the Scrapyd service is running and accessible.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.
