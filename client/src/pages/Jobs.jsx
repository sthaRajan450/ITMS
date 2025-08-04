import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { BASE_URL } from "../config/api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedJobs, setExpandedJobs] = useState({}); // Track which jobs are expanded
  const navigate = useNavigate();
  const { isAuth } = useContext(AuthContext);

  const getJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/job/all`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data.data);
      }
    } catch (error) {
      console.log("Failed to fetch jobs:", error);
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  const toggleExpand = (jobId) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const maxLength = 150; // Max chars before truncation

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-4xl font-semibold text-center text-gray-600 mb-10">
        💼 Available Job Openings
      </h1>
      {error && <div className="text-red-500 text-center">{error}</div>}

      {loading ? (
        <div className="text-center text-orange-500 text-lg">
          Loading jobs...
        </div>
      ) : (
        <div>
          {jobs.length > 0 ? (
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {jobs.map((job) => {
                const isExpanded = expandedJobs[job._id];
                const shouldTruncate = job.description.length > maxLength;
                const displayText = isExpanded
                  ? job.description
                  : job.description.slice(0, maxLength) + (shouldTruncate ? "..." : "");

                return (
                  <div
                    key={job._id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
                  >
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                      {job.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">🏢 {job.company}</p>
                    <p className="text-sm text-gray-600 mb-2">📍 {job.location}</p>
                    <p className="text-sm text-gray-600 mb-2">💰 NPR {job.salary}</p>

                    <p className="text-gray-700 text-sm mb-2">{displayText}</p>
                    {shouldTruncate && (
                      <button
                        onClick={() => toggleExpand(job._id)}
                        className="text-gray-500 text-sm hover:underline mb-2"
                      >
                        {isExpanded ? "Show Less" : "Show More"}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (!isAuth) {
                          navigate("/login");
                          return;
                        }
                        navigate(`/applyJob`, { state: job._id });
                      }}
                      className="mt-2 w-full py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition"
                    >
                      Apply Now
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-600 text-lg">
              No job openings posted yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Jobs;
