# JobApp - Comprehensive Job Application Platform

A sophisticated full-stack web application that provides automated job scraping, intelligent resume analysis, ATS optimization, and a modern job search interface. Built with FastAPI backend, React frontend, Scrapy-based web scraping, and integrated AI capabilities.

## 🚀 Features

### Core Functionality
- **Automated Job Scraping**: Continuously scrapes job listings from LinkedIn and other sources using Scrapy
- **Real-time Job Updates**: Live job feed and status tracking
- **Advanced Search & Filtering**: Filter jobs by keywords, location, experience level, and other criteria
- **Resume Management**: Upload, parse, and analyze resumes with PDF extraction capabilities
- **ATS Optimization**: Get ATS (Applicant Tracking System) score suggestions for your resume
- **Profile Analysis**: Intelligent profile matching with job requirements
- **Job Recommendations**: AI-powered job recommendations based on your profile

### Technical Features
- **Modern UI/UX**: Responsive React interface with Tailwind CSS and modern animations
- **RESTful API**: Comprehensive FastAPI backend with authentication and authorization
- **Database Integration**: MongoDB for job storage and user data management
- **File Upload**: Cloudinary integration for resume storage and management
- **AI Integration**: Groq AI integration for intelligent job matching and suggestions
- **Background Processing**: Asynchronous task processing for scraping and analysis
- **Authentication**: JWT-based authentication with Firebase integration

## 🎯 How It Works

### Architecture Overview

JobApp is built as a modern microservices architecture with three main components working together:

1. **Backend API Service (FastAPI)**: Handles business logic, database operations, authentication, and serves as the central hub for all data processing.
2. **Frontend Application (React)**: Provides a modern, responsive user interface for job seekers to interact with the platform.
3. **Scraping Service (Scrapy)**: Automatically collects job listings from various sources in the background.

### Workflow Process

#### 1. Job Scraping & Collection
- The Scrapy service continuously monitors job boards (LinkedIn, Internshala, etc.)
- Jobs are scraped with detailed information including title, company, location, requirements, and application links
- Scraped data is sent to the backend API for processing and storage

#### 2. Resume Processing & Analysis
- Users can upload their resumes in PDF format
- The system extracts text using advanced PDF parsing libraries (pdfminer, pdfplumber)
- Resume content is analyzed for skills, experience, education, and keywords
- ATS (Applicant Tracking System) scoring evaluates resume quality and optimization

#### 3. Intelligent Job Matching
- AI-powered algorithms (using Groq integration) match user profiles with job requirements
- Profile analysis considers skills, experience level, education, and preferences
- Job recommendations are personalized based on compatibility scores
- Real-time matching ensures users see the most relevant opportunities

#### 4. User Experience Flow
1. **Authentication**: Users sign up/login using Firebase authentication
2. **Profile Setup**: Complete professional profile with skills and preferences
3. **Resume Upload**: Upload and analyze resume for ATS optimization
4. **Job Search**: Browse scraped jobs with advanced filtering options
5. **Smart Matching**: Receive personalized job recommendations
6. **Application Tracking**: Monitor job applications and status

### Key Technical Processes

#### Backend Processing
- **FastAPI endpoints** handle all CRUD operations with MongoDB
- **JWT authentication** secures API endpoints and user sessions
- **Background tasks** process scraping jobs and resume analysis asynchronously
- **Cloudinary integration** manages file uploads and storage for resumes
- **Real-time notifications** keep users updated on job matches and application status

#### Frontend Features
- **Responsive design** using Tailwind CSS with modern UI components
- **State management** with React Context for authentication and user data
- **Form handling** with React Hook Form and validation
- **Real-time updates** using WebSocket connections for live job feeds
- **Advanced animations** with Framer Motion for enhanced user experience

#### Scraping Engine
- **Distributed scraping** with Scrapy framework and Scrapyd daemon
- **Rotating proxies** and user agents to avoid detection and blocking
- **Data validation** with Pydantic models before database storage
- **Error handling** and retry mechanisms for robust scraping operations
- **Scheduled tasks** for regular updates and maintenance

### Data Flow

1. **Input**: Job listings from external sources + User resumes and profiles
2. **Processing**: Text extraction, NLP analysis, ATS scoring, AI matching
3. **Storage**: MongoDB for structured data, Cloudinary for files
4. **Output**: Personalized job recommendations, optimized resumes, application tracking

### Integration Points

- **Firebase**: User authentication and real-time database features
- **Groq AI**: Intelligent job matching and recommendation engine
- **Cloudinary**: Secure file storage and management for resumes
- **MongoDB**: Scalable NoSQL database for job and user data
- **Scrapyd**: Distributed scraping service management

This architecture ensures scalability, maintainability, and provides a seamless experience for job seekers while efficiently processing large volumes of job data.

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for Python
- **MongoDB** - NoSQL database for job storage and user data
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation and settings management
- **Uvicorn** - ASGI server
- **JWT** - JSON Web Token authentication
- **Firebase Admin** - Firebase integration for authentication
- **Cloudinary** - Cloud-based file storage for resumes
- **Groq** - AI API for intelligent job matching
- **PDF Processing** - pdfminer, pdfplumber for resume parsing

### Frontend
- **React 19** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework with latest features
- **Axios** - HTTP client for API communication
- **React Router** - Client-side routing
- **Framer Motion** - Advanced animations and transitions
- **React Hook Form** - Form management with validation
- **Firebase Client** - Frontend authentication
- **Radix UI** - Accessible UI components
- **Lucide React** - Modern icon library

### Scraping & Background Processing
- **Scrapy** - Web scraping framework
- **Scrapyd** - Scrapy service daemon
- **BeautifulSoup** - HTML/XML parsing
- **Background Worker** - Separate service for long-running tasks

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

## 🙏 Acknowledgments

- FastAPI team for the excellent framework
- Scrapy community for web scraping tools
- React team for the frontend library
- LinkedIn for job data (please respect their terms of service)
