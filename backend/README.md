# Backend - JobApp

The backend of the JobApp is built using FastAPI, providing a RESTful API for job management and scraping tasks.

## 🚀 Features

- **FastAPI**: A modern web framework for building APIs with Python.
- **MongoDB**: NoSQL database for storing job listings and user data.
- **Pydantic**: Data validation and settings management.
- **Background Tasks**: Handles scraping tasks and job management.

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py         # FastAPI application entry
│   ├── settings.py     # Configuration settings
│   ├── db/             # Database models and connection
│   ├── routers/        # API endpoints
│   ├── schemas/        # Pydantic models
│   └── services/       # Business logic
└── requirements.txt    # Python dependencies
```

## 📡 API Endpoints

### Jobs
- `GET /jobs/` - Retrieve all jobs
- `POST /jobs/` - Create a new job
- `GET /jobs/{id}` - Retrieve a job by ID
- `PUT /jobs/{id}` - Update a job by ID
- `DELETE /jobs/{id}` - Delete a job by ID

### Tasks
- `POST /tasks/scrape` - Start a new scraping task
- `GET /tasks/scrape/status/{task_id}` - Get the status of a scraping task

## 🛠️ Setup Instructions

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

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=jobapp
SECRET_KEY=your-secret-key
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS errors**: Ensure backend CORS middleware is configured correctly.
2. **Database connection**: Check MongoDB is running and accessible.
3. **Scraping failures**: LinkedIn may block requests - consider using rotating proxies.
4. **Port conflicts**: Ensure ports 8000 (backend) and 5173 (frontend) are available.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.
