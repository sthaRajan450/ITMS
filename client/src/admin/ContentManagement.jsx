import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";

const ContentManagement = () => {
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();


 

  
  const acceptOrRejectApplication = async (applicationId, action) => {
    try {
      const response = await fetch(
        `${BASE_URL}/job/application/${action}/${applicationId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        getApplications();
      } else {
        const err = await response.json();
        alert(err.message);
      }
    } catch (error) {
      console.log(`Failed to ${action} application:`, error);
    }
  };
  useEffect(() => {
    getBlogs();
    getJobs();
    getApplications();
  }, []);

  return (
    <>
     

      <div className="min-h-screen bg-gray-100 py-10 px-5">
        <h1 className="text-3xl font-bold text-center mb-8">Job Management</h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => navigate("/addJob")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            + Add New Job
          </button>
        </div>

        {jobs.length ? (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="p-5">
                  <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                  <p className="text-gray-600 mb-3 line-clamp-3">
                    {job.company}
                  </p>
                  <p className="text-gray-600 mb-3 line-clamp-3">
                    {job.location}
                  </p>

                  <div className="text-sm text-gray-500 mb-1">
                    <span className="font-medium">Description:</span>
                    {job.description}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    <span className="font-medium">Salary:</span>
                    {job.salary}
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 border-t">
                  <button
                    onClick={() => navigate(`/updateJob/${job._id}`)}
                    className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteJob(job._id)}
                    className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg mt-20">
            No jobs available yet.
          </div>
        )}
      </div>

      
    </>
  );
};

export default ContentManagement;
