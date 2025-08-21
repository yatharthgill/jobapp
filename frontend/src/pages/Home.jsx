import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Card";
import axiosInstance from "../axiosInstance";
const API = "http://localhost:8000";

export default function App() {
  const [jobRole, setJobRole] = useState("engineering");
  const [location, setLocation] = useState("");
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
      // console.log(data.data.jobs.internshala);

      const internshalaJobs = data.data.jobs.internshala || [];
      const linkedinJobs = data.data.jobs.linkedin || [];

      if (internshalaJobs.length === 0 && linkedinJobs.length === 0) {
        setError("No jobs found.");
      }

      setJobs([...internshalaJobs, ...linkedinJobs]);
    } catch (err) {
      // console.error(err);
      setError("Failed to fetch jobs.");
    } finally {
      setLoadingJobs(false);
    }
  };

  // Start Scrape
  const startScrape = async () => {
    if (!jobRole.trim() || !location.trim()) {
      setError("Please enter both job role and location.");
      return;
    }
    setError("");
    setLoadingScrape(true);

    try {
      const { data } = await axiosInstance.post("/tasks/scrape", {
        jobRole,
        location,
      });
      setScrapeTasks((prev) => [...prev, ...data.map((job) => ({ ...job }))]);
    } catch (err) {
      setError("Failed to start scrape task.");
      setLoadingScrape(false);
    }
  };

  // Poll multiple scrape tasks
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
        setError("Failed to check scrape status.");
        setLoadingScrape(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [scrapeTasks]);

  useEffect(() => {
    fetchJobs();
  }, []);
  const sortedJobs = [...jobs].sort((a, b) => (a.id > b.id ? -1 : 1));
  // console.log(sortedJobs)

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">JobApp</h1>
      <button
        type="button"
        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
      >
        <a href="/login">Login</a>
      </button>
      <button
        type="button"
        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
      >
        <a href="/signup">SignUp</a>
      </button>

      {/* Input & Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          placeholder="Role keywords"
          className="p-2 border border-gray-300 rounded-md flex-1"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="p-2 border border-gray-300 rounded-md flex-1"
        />
        <button
          onClick={startScrape}
          disabled={loadingScrape}
          className={`px-4 py-2 rounded-md transition ${
            loadingScrape
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loadingScrape ? "Scraping..." : "Scrape"}
        </button>
        <button
          onClick={fetchJobs}
          disabled={loadingJobs}
          className={`px-4 py-2 rounded-md transition ${
            loadingJobs
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-600 hover:bg-gray-700 text-white"
          }`}
        >
          {loadingJobs ? "Loading..." : "Load Demo Jobs"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      {/* Scrape Tasks Status */}
      {scrapeTasks.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold text-gray-700 mb-2">Scrape Tasks:</h2>
          {scrapeTasks.map((task) => (
            <p key={task.jobid} className="text-gray-700">
              {task.spider} — Task ID:{" "}
              <span className="font-mono">{task.jobid}</span> — Status:{" "}
              <span className="font-mono">{task.status}</span>
            </p>
          ))}
        </div>
      )}

      {/* Jobs List */}
      {sortedJobs.length === 0 && !loadingJobs && !error && (
        <p className="text-gray-600">
          No jobs available. Try loading demo jobs.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {sortedJobs.map((j, index) => (
          <Card
            key={j._id || j.id || index} // ✅ fallback if _id or id is missing
            source={j.source}
            url={j.url}
            title={j.title}
            company={j.company}
            location={j.location}
            salary={j.salary}
            published={j.published}
          />
        ))}
      </div>
    </div>
  );
}
