import axiosInstance from '@/axiosInstance';
import Card from '@/components/Card';
import React, { useState, useEffect } from 'react';



const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.51L20.49 9M3.51 15l2.98 6.49a9 9 0 0 0 14.85-3.51"></path></svg>
);

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const JobsComponent = () => {
  const [jobRole, setJobRole] = useState("React Developer");
  const [location, setLocation] = useState("Remote");
  const [jobs, setJobs] = useState([]);
  const [scrapeTasks, setScrapeTasks] = useState([]);
  const [loadingScrape, setLoadingScrape] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    setLoadingJobs(true);
    setError("");
    try {
      const { data } = await axiosInstance.get("/jobs/all");
      const internshalaJobs = data.data.jobs.internshala || [];
      const linkedinJobs = data.data.jobs.linkedin || [];
      if (internshalaJobs.length === 0 && linkedinJobs.length === 0) {
        setError("No jobs found.");
      }
      setJobs([...internshalaJobs, ...linkedinJobs]);
    } catch {
      setError("Failed to fetch jobs.");
    } finally {
      setLoadingJobs(false);
    }
  };

  const startScrape = async () => {
    if (!jobRole.trim() || !location.trim()) {
      setError("Please enter both job role and location.");
      return;
    }
    setError("");
    setLoadingScrape(true);
    try {
      const { data } = await axiosInstance.post("/tasks/scrape", { jobRole, location });
      setScrapeTasks(data);
    } catch {
      setError("Failed to start scrape task.");
      setLoadingScrape(false);
    }
  };

  useEffect(() => {
    if (scrapeTasks.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const updatedTasks = await Promise.all(
          scrapeTasks.map(async (task) => {
            const { data } = await axiosInstance.get(
              `/tasks/scrape/status/${task.jobid}`
            );
            // console.log(data.status)
            return { ...task, status: data.status };
          })
        );
        setScrapeTasks(updatedTasks);

        const allFinished = updatedTasks.every((t) => t.status === "finished");
        const anyFailed = updatedTasks.some(
          (t) => t.status === "failed" || t.status === "not_found"
        );

        if (allFinished) {
          setScrapeTasks("");
          clearInterval(interval);
          setLoadingScrape(false);
          fetchJobs();
        }

        if (anyFailed) {
          setScrapeTasks("");
          clearInterval(interval);
          setError("Some scrape tasks failed.");
          setLoadingScrape(false);
        }
      } catch (err) {
        setScrapeTasks("");
        clearInterval(interval);
        setError("Failed to check scrape status.",err);
        setLoadingScrape(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [scrapeTasks]);

  useEffect(() => {
    fetchJobs();
  }, []);


  useEffect(() => {
    fetchJobs();
  }, []);

  const sortedJobs = [...jobs].sort((a, b) => new Date(b.published) - new Date(a.published));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white/50 backdrop-blur-lg p-6 rounded-xl shadow-md border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
              <input value={jobRole} onChange={(e) => setJobRole(e.target.value)} placeholder="e.g., Software Engineer" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., San Francisco" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
          </div>
          <button onClick={startScrape} disabled={loadingScrape} className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg transition text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
            {loadingScrape ? <><Spinner /> Scraping...</> : <><SearchIcon /> Find Jobs</>}
          </button>
          <button onClick={fetchJobs} disabled={loadingJobs} className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg transition text-white font-semibold bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {loadingJobs ? <><Spinner /> Loading...</> : <><RefreshIcon /> Load Jobs</>}
          </button>
        </div>
        {error && <p className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
        {loadingScrape && (
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2 text-center">Scraping in progress...</h3>
            {scrapeTasks.map((task) => (
              <div key={task.jobid} className="text-sm text-blue-700 flex justify-between items-center">
                <span>{task.spider} — Task ID: <span className="font-mono">{task.jobid.slice(0, 8)}...</span></span>
                <span className={`font-mono px-2 py-0.5 rounded-full text-xs ${task.status === 'pending' ? 'bg-yellow-200 text-yellow-800 animate-pulse' : 'bg-green-200 text-green-800'}`}>{task.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {sortedJobs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedJobs.map((job) => <Card key={job.id} {...job} />)}
        </div>
      )}

      {sortedJobs.length === 0 && !loadingJobs && !error && (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700">No Jobs Found</h3>
          <p className="text-gray-500 mt-2">Try scraping for new jobs or loading the demo data.</p>
        </div>
      )}
    </div>
  );
};

export default function Jobs() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans p-4 sm:p-6 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-2">Find Your Next Opportunity</h1>
        <p className="text-lg text-gray-500">Use our platform to find the latest job openings.</p>
      </div>
      <JobsComponent />
    </div>
  );
}
