import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const getJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/job/all`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();

        setJobs(data.data);
        setFilteredJobs(data.data);
      } else {
        setError("Failed to fetch jobs");
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const response = await fetch(`${BASE_URL}/job/${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        getJobs();
      } else {
        alert("Failed to delete job");
      }
    } catch (error) {
      console.error("Failed to delete job:", error);
      alert("Failed to delete job");
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  // Filter jobs when searchTerm changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredJobs(jobs);
      return;
    }

    const lowerTerm = searchTerm.toLowerCase();
    const filtered = jobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(lowerTerm) ||
        job.company?.toLowerCase().includes(lowerTerm)
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-700 text-center mb-6">
        Job Management
      </h1>

      {error && <div className="text-red-600 text-center mb-4">{error}</div>}

      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="🔍 Search by title, company, or job type"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={() => navigate("/addJob")}
          className="px-5 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-500 transition"
        >
          Add New Job
        </button>
      </div>

      {loading ? (
        <p className="text-center text-orange-600 ">Loading jobs...</p>
      ) : filteredJobs.length ? (
        <div className="overflow-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-200 text-gray-700 font-semibold">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Location</th>

                <th className="px-6 py-3">Salary</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredJobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{job.title}</td>
                  <td className="px-6 py-4">{job.company}</td>
                  <td className="px-6 py-4">{job.location}</td>

                  <td className="px-6 py-4 font-bold text-orange-600">
                    {job.salary}
                  </td>
                  <td className="px-6 py-4 flex gap-2 justify-center">
                    <button
                      onClick={() => navigate(`/updateJob/${job._id}`)}
                      className="px-4 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteJob(job._id)}
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-10">
          No jobs found.
        </p>
      )}
    </div>
  );
};

export default JobManagement;
