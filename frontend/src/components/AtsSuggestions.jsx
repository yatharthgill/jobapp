import React, { useState, useEffect } from "react";
import {
  FileText,
  Lightbulb,
  CheckCircle,
  XCircle,
  ChevronRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import axiosInstance from "@/axiosInstance";

const CircularProgress = ({ score }) => {
  const radius = 50;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (score === null || score === undefined) return;
    let start;
    const animation = (timestamp) => {
      if (start === undefined) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / 1000, 1); // Animate over 1 second
      setDisplayScore(Math.floor(progress * score));
      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };
    requestAnimationFrame(animation);

    return () => cancelAnimationFrame(requestAnimationFrame(animation));
  }, [score]);

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="#e5e7eb" // light gray
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="url(#scoreGradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 1s ease-out",
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="scoreGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{displayScore}</span>
      </div>
      <div className="mt-24 absolute flex flex-col items-center justify-center">
        <span className="text-xs text-gray-500">Match Score</span>
      </div>
    </div>
  );
};

const KeywordPill = ({ keyword, type }) => {
  const baseClasses =
    "text-xs font-medium mr-2 mb-2 px-3 py-1 rounded-full inline-block transition-transform duration-300 hover:scale-105";
  const typeClasses = {
    matched: "bg-green-100 text-green-800 border border-green-200",
    missing: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  };
  return (
    <span className={`${baseClasses} ${typeClasses[type]}`}>{keyword}</span>
  );
};

const SuggestionItem = ({ improvement, description, example }) => (
  <li className="flex items-start space-x-3 py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
    {/* Icon Column */}
    <div className="flex-shrink-0 mt-0.5">
      <ChevronRight className="h-5 w-5 text-purple-600" />
    </div>

    {/* Content Column */}
    <div className="flex-1 min-w-0 text-left">
      <p className="text-gray-800 font-semibold ">
        {improvement || "No improvement title"}
      </p>

      {description && (
        <p className="mt-1 text-sm text-gray-600">
          Description:- {description}
        </p>
      )}

      {example && (
        <div className="mt-2 p-3 rounded-md bg-gray-100 text-sm">
          <p className="font-mono text-gray-700 whitespace-pre-wrap break-words">
            Example:- {example}
          </p>
        </div>
      )}
    </div>
  </li>
);

const LoadingSpinner = () => <Loader2 className="h-5 w-5 animate-spin" />;

// --- MAIN APP COMPONENT ---

export default function App() {
  const [jobDescription, setJobDescription] = useState("");
  const [atsResult, setAtsResult] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [isScoring, setIsScoring] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ats");

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsScoring(true);
      setError(null);
      try {
        // GET ATS score
        const response_ats = await axiosInstance.get("/ats/score");
        if (response_ats.data.success) {
          setAtsResult(response_ats.data.data);
        } else {
          setAtsResult("");
        }

        // GET suggestions
        const response_suggestions = await axiosInstance.get("/ats/suggest");
        if (response_suggestions.data.success) {
          setSuggestions(response_suggestions.data.data.suggestions);
        } else {
          setSuggestions("");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "An unknown error occurred while fetching initial data."
        );
      } finally {
        setIsScoring(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleScore = async () => {
    setIsScoring(true);
    setError(null);
    setAtsResult(null);
    try {
      const response = await axiosInstance.post("/ats/score", {
        job_description: jobDescription,
      });
      setAtsResult(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unknown error occurred while scoring."
      );
    } finally {
      setIsScoring(false);
    }
  };

  const handleSuggest = async () => {
    setIsSuggesting(true);
    setError(null);
    setSuggestions(null);
    try {
      const response = await axiosInstance.post("/ats/suggest");
      setSuggestions(response.data.data.suggestions);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unknown error occurred while generating suggestions."
      );
    } finally {
      setIsSuggesting(false);
    }
  };

  const renderAtsResult = () => (
    <div className="mt-6 animate-fade-in space-y-8">
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resume Match Score
        </h3>
        <CircularProgress score={atsResult.score} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            Matched Keywords
          </h4>
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            {atsResult.matched_keywords.map((k) => (
              <KeywordPill key={k} keyword={k} type="matched" />
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <XCircle className="h-5 w-5 text-yellow-500 mr-2" />
            Missing Keywords
          </h4>
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            {atsResult.missing_keywords.map((k) => (
              <KeywordPill key={k} keyword={k} type="missing" />
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <Lightbulb className="h-5 w-5 text-purple-500 mr-2" />
          Actionable Suggestions
        </h4>
        <ul className="p-4 bg-white rounded-lg border border-gray-200 list-none">
          {atsResult.suggestions.map((s, i) => (
            <li key={i} className="flex items-start space-x-3 py-2">
              <ChevronRight className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
              <span className="text-gray-700">{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderSuggestionsResult = () => (
    <div className="mt-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        General Resume Suggestions
      </h3>
      <ul className="p-4 bg-white rounded-lg border border-gray-200 list-none divide-y divide-gray-200">
        {suggestions.map((s, i) => (
          <SuggestionItem
            key={i}
            improvement={s.improve}
            description={s.description}
            example={s.example}
          />
        ))}
      </ul>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-700 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Resume Optimizer</h1>
          <p className="text-gray-500 mt-2">
            Analyze your resume against job descriptions and get AI-powered
            feedback.
          </p>
        </header>

        <main className="bg-white border border-gray-200 rounded-2xl shadow-lg shadow-purple-500/10 p-6 sm:p-8">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("ats")}
              className={`px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                activeTab === "ats"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              ATS Scanner
            </button>
            <button
              onClick={() => setActiveTab("suggest")}
              className={`px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                activeTab === "suggest"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              AI Suggestions
            </button>
          </div>

          {activeTab === "ats" && (
            <div className="animate-fade-in">
              <label
                htmlFor="job-description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Paste Job Description
              </label>
              <textarea
                id="job-description"
                rows="8"
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow duration-300 placeholder-gray-400"
                placeholder="Paste the full job description here to see how your resume stacks up..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              ></textarea>
              <button
                onClick={handleScore}
                disabled={isScoring || !jobDescription}
                className="mt-4 w-full flex items-center justify-center bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-purple-500"
              >
                {isScoring ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <FileText className="h-5 w-5 mr-2" /> Calculate Match Score
                  </>
                )}
              </button>
              {isScoring && (
                <p className="text-center text-sm text-purple-600 mt-3 animate-pulse">
                  Analyzing... This may take a moment.
                </p>
              )}
              {atsResult && renderAtsResult()}
            </div>
          )}

          {activeTab === "suggest" && (
            <div className="animate-fade-in text-center">
              <p className="text-gray-500 mb-4">
                Get AI-powered suggestions to improve your resume's overall
                quality and impact.
              </p>
              <button
                onClick={handleSuggest}
                disabled={isSuggesting}
                className="w-full max-w-xs mx-auto flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500"
              >
                {isSuggesting ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <Lightbulb className="h-5 w-5 mr-2" /> Generate Suggestions
                  </>
                )}
              </button>
              {isSuggesting && (
                <p className="text-center text-sm text-blue-600 mt-3 animate-pulse">
                  Thinking... Crafting suggestions for you.
                </p>
              )}
              {suggestions && renderSuggestionsResult()}
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center animate-fade-in">
              <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        body {
          background-color: #f9fafb; /* bg-gray-50 */
        }
      `}</style>
    </div>
  );
}
