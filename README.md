# JobApp - Automated Job Board Aggregator

A comprehensive web application that automatically scrapes job listings from LinkedIn and provides a clean, searchable interface for job seekers. Built with FastAPI backend, React frontend, and Scrapy-based web scraping.

## 🚀 Features

- **Automated Scraping**: Continuously scrapes job listings from LinkedIn using Scrapy
- **Real-time Updates**: Live job feed with instant notifications and status tracking
- **Advanced Search**: Filter jobs by keywords, location, and other criteria
- **Clean UI**: Modern, responsive React interface with Tailwind CSS
- **RESTful API**: FastAPI backend with comprehensive endpoints
- **Database Storage**: MongoDB integration with job persistence
- **Logging System**: Detailed logging for debugging and monitoring
- **Task Management**: Background scraping tasks with status tracking

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for Python
- **MongoDB** - NoSQL database for job storage
- **Pydantic** - Data validation and settings management
- **Uvicorn** - ASGI server

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

### Scraping
- **Scrapy** - Web scraping framework
- **Scrapyd** - Scrapy service daemon
- **BeautifulSoup** - HTML/XML parser

## 📁 Project Structure

```
JobApp/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI application entry
│   │   ├── settings.py     # Configuration settings
│   │   ├── db/             # Database models and connection
│   │   ├── routers/        # API endpoints
│   │   │   ├── jobs.py     # Job management endpoints
│   │   │   ├── tasks.py    # Scraping task endpoints
│   │   │   ├── resumes.py  # Resume management
│   │   │   └── email.py    # Email notifications
│   │   ├── schemas/        # Pydantic models
│   │   └── services/       # Business logic
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── main.jsx        # React entry point
│   │   └── pages/
│   │       └── App.jsx     # Main application component
│   ├── package.json        # Node.js dependencies
│   └── index.html          # HTML template
├── newscraper/             # Scrapy scraping service
│   ├── jobscrapper/
│   │   ├── spiders/
│   │   │   └── linkedin_jobs.py  # LinkedIn job scraper
│   │   └── settings.py     # Scrapy configuration
│   └── scrapy.cfg         # Scrapy project configuration
├── scraper.zip             # Pre-configured scraper package
└── test.py                 # Testing utilities
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB
- Scrapy

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the FastAPI server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Scraping Service Setup

1. Navigate to the scraper directory:
```bash
cd newscraper
```

2. Install Scrapy:
```bash
pip install scrapy scrapyd
```

3. Deploy the spider:
```bash
scrapyd-deploy
```

## 📡 API Endpoints

### Jobs
- `GET /jobs/` - Retrieve all jobs

### Tasks
- `POST /tasks/scrape` - Start new scraping task
- `GET /tasks/scrape/status/{task_id}` - Get scraping task status



## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=jobapp
SECRET_KEY=your-secret-key
```

### Scrapy Configuration

The LinkedIn scraper can be configured with:
- `domain`: Job role keywords (e.g., "software engineer")
- `location`: Job location (e.g., "San Francisco, CA")

## 🧪 Usage

### Starting a Scraping Task

1. Open the frontend at `http://localhost:5173`
2. Enter job role keywords and location
3. Click "Scrape" to start the scraping task
4. Monitor the task status in real-time
5. View scraped jobs once complete

### Viewing Jobs

- Use the "Load Demo Jobs" button to load sample data
- Jobs are displayed with title, company, location, and direct link
- Click on job titles to open LinkedIn job pages

## 🧪 Testing

Run the test suite:
```bash
python test.py
```

## 📝 Development

### Adding New Job Sources

1. Create a new spider in `newscraper/jobscrapper/spiders/`
2. Update the scraping service in `backend/app/services/scrape.py`
3. Add new endpoints in `backend/app/routers/tasks.py`

### Frontend Customization

- Modify components in `frontend/src/pages/`
- Update styles in Tailwind CSS classes
- Add new features using React hooks

## 🐛 Troubleshooting

### Common Issues

1. **CORS errors**: Ensure backend CORS middleware is configured correctly
2. **Database connection**: Check MongoDB is running and accessible
3. **Scraping failures**: LinkedIn may block requests - consider using rotating proxies
4. **Port conflicts**: Ensure ports 8000 (backend) and 5173 (frontend) are available

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- FastAPI team for the excellent framework
- Scrapy community for web scraping tools
- React team for the frontend library
- LinkedIn for job data (please respect their terms of service)