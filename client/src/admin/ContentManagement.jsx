import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";

const ContentManagement = () => {
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const getBlogs = async () => {
    try {
      const response = await fetch(`${BASE_URL}/blog/all`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        setBlogs(data.data);
      }
    } catch (error) {
      console.log("Failed to get all blogs:", error);
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      const response = await fetch(`${BASE_URL}/blog/${blogId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        getBlogs();
      }
    } catch (error) {
      console.log("Failed to delete blog:", error);
    }
  };

  const getJobs = async () => {
    try {
      const response = await fetch(`${BASE_URL}/job/all`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        setJobs(data.data);
      }
    } catch (error) {
      console.log("Failed to get all jobs:", error);
    }
  };
  const deleteJob = async (jobId) => {
    try {
      const response = await fetch(`${BASE_URL}/job/${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        getJobs();
      }
    } catch (error) {
      console.log("Failed to delete job:", error);
    }
  };

  const getApplications = async () => {
    try {
      const response = await fetch(`${BASE_URL}/job/applications`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setApplications(data.data);
      }
    } catch (error) {
      console.log("Failed to get all jobs:", error);
    }
  };

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
        <h1 className="text-3xl font-bold text-center mb-8">Blog Management</h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => navigate("/addBlog")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            + Add New Blog
          </button>
        </div>

        {blogs.length ? (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300"
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-56 object-cover"
                />

                <div className="p-5">
                  <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                  <p className="text-gray-600 mb-3 line-clamp-3">
                    {blog.content}
                  </p>

                  <div className="text-sm text-gray-500 mb-1">
                    <span className="font-medium">Category:</span>{" "}
                    {blog.category}
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 border-t">
                  <button
                    onClick={() => navigate(`/updateBlog/${blog._id}`)}
                    className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteBlog(blog._id)}
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
            No blogs available yet.
          </div>
        )}
      </div>

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

      <div className="min-h-screen bg-gray-100 py-10 px-5">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
          📄 Application Management
        </h1>

        {applications.length ? (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="p-5 space-y-3">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {application.job.title}
                  </h2>
                  <p className="text-gray-600">🏢 {application.job.company}</p>
                  <p className="text-gray-600">
                    💰 NPR {application.job.salary}
                  </p>
                  <p className="text-gray-600">
                    📅 Applied on:{" "}
                    {new Date(application.appliedAt).toDateString()}
                  </p>
                  <p className="text-gray-600">✉️ {application.coverLetter}</p>
                  <a
                    href={application.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                  >
                    📄 View Resume
                  </a>
                </div>

                <div className="flex justify-between items-center p-4 border-t">
                  <button
                    onClick={() => {
                      acceptOrRejectApplication(application._id, "accept");
                    }}
                    className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      acceptOrRejectApplication(application._id, "reject");
                    }}
                    className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg mt-20">
            No applications available yet.
          </div>
        )}
      </div>
    </>
  );
};

export default ContentManagement;
