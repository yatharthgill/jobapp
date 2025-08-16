import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000'

export default function App() {
  const [jobRole, setJobRole] = useState('engineering')
  const [location, setLocation] = useState('')
  const [jobs, setJobs] = useState([])
  const [scrapeTask, setScrapeTask] = useState(null)
  const [scrapeStatus, setScrapeStatus] = useState('')
  const [loadingScrape, setLoadingScrape] = useState(false)
  const [loadingJobs, setLoadingJobs] = useState(false)
  const [error, setError] = useState('')

  const fetchJobs = async () => {
    setLoadingJobs(true)
    setError('')
    try {
      const { data } = await axios.get(`${API}/jobs/`)
      if (data.length === 0) {
        setError('No jobs found.')
      }
      setJobs(data)
    } catch (err) {
      setError('Failed to load jobs.')
    } finally {
      setLoadingJobs(false)
    }
  }

  const startScrape = async () => {
    if (!jobRole.trim() || !location.trim()) {
      setError('Please enter both job role and location.')
      return
    }
    setError('')
    setLoadingScrape(true)
    setScrapeStatus('pending')
    try {
      const { data } = await axios.post(`${API}/tasks/scrape`, { jobRole, location })
      setScrapeTask(data.jobid)
      console.log(`Scrape task started: ${data.jobid}`)
    } catch (err) {
      setError('Failed to start scrape task.')
      setLoadingScrape(false)
    }
  }

  // Polling scrape status
  useEffect(() => {
    if (!scrapeTask) return

    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`${API}/tasks/scrape/status/${scrapeTask}`)
        setScrapeStatus(data.status)

        if (data.status === 'finished') {
          clearInterval(interval)
          setLoadingScrape(false)
          fetchJobs()
        } else if (data.status === 'failed' || data.status === 'not_found') {
          clearInterval(interval)
          setError(`Scrape task ${data.status}.`)
          setLoadingScrape(false)
        }
      } catch (err) {
        clearInterval(interval)
        setError('Failed to check scrape status.')
        setLoadingScrape(false)
      }
    }, 2000) // poll every 2 seconds

    return () => clearInterval(interval)
  }, [scrapeTask])

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">JobApp</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          value={jobRole}
          onChange={e => setJobRole(e.target.value)}
          placeholder="Role keywords"
          className="p-2 border border-gray-300 rounded-md flex-1"
        />
        <input
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Location"
          className="p-2 border border-gray-300 rounded-md flex-1"
        />
        <button
          onClick={startScrape}
          disabled={loadingScrape}
          className={`px-4 py-2 rounded-md transition ${
            loadingScrape
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loadingScrape ? `Scraping (${scrapeStatus})...` : 'Scrape'}
        </button>
        <button
          onClick={fetchJobs}
          disabled={loadingJobs}
          className={`px-4 py-2 rounded-md transition ${
            loadingJobs
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          {loadingJobs ? 'Loading...' : 'Load Demo Jobs'}
        </button>
      </div>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      {scrapeTask && (
        <p className="mb-4 text-gray-700">
          Scrape task ID: <span className="font-mono">{scrapeTask}</span> — Status: <span className="font-mono">{scrapeStatus}</span>
        </p>
      )}

      {jobs.length === 0 && !loadingJobs && !error && (
        <p className="text-gray-600">No jobs available. Try loading demo jobs.</p>
      )}

      <ul className="space-y-3">
        {jobs.map(j => (
          <li key={j.id} className="p-4 bg-white rounded-md shadow hover:shadow-lg transition">
            <a
              href={j.url}
              target="_blank"
              className="text-blue-600 font-semibold hover:underline"
            >
              {j.title}
            </a>
            <p className="text-gray-600 mt-1">
              {j.company} — {j.location}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
