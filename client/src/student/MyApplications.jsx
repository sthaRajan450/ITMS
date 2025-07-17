import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";

const MyApplications = () => {
  const [myApplications, setMyApplications] = useState([]);

  const getMyApplications = async () => {
    try {
      const response = await fetch(
       `${BASE_URL}/job/myApplications`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data.data);
        setMyApplications(data.data);
      }
    } catch (error) {
      console.log("Failed to fetch applications:", error);
    }
  };

  useEffect(() => {
    getMyApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        📑 My Job Applications
      </h1>

      {myApplications.length > 0 ? (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {myApplications.map((app) => (
            <div
              key={app._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {app.job.title}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                🏢 Company: {app.job.company}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                📍 Location: {app.job.location}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                💰 Salary: NPR {app.job.salary}
              </p>

              <p className="text-sm text-gray-600 mb-1">
                📝 Cover Letter:{" "}
                <span className="italic">{app.coverLetter || "N/A"}</span>
              </p>
              <p className="text-sm text-gray-600 mb-1">
                📅 Applied On: {new Date(app.appliedAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Status:{app.status}
              </p>

              <a
                href={app.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                📥 View Resume
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 text-lg">
          No applications yet.
        </div>
      )}
    </div>
  );
};

export default MyApplications;
