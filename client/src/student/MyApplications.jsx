import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";

const MyApplications = () => {
  const [myApplications, setMyApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getMyApplications = async () => {
    try {
      const response = await fetch(`${BASE_URL}/job/myApplications`, {
        method: "GET",
        credentials: "include",
      });
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
  const filteredApplications = myApplications.filter((application) =>
    `${application.job.title} ${application.job.company} ${application.job.salary}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-4xl font-bold text-center text-gray-600 mb-10">
        📑 My Job Applications
      </h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="🔍 Search by title, companay or salary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      {filteredApplications.length > 0 ? (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white table-auto border border-gray-300 text-sm text-left">
            <thead className="bg-gray-200 text-gray-700 uppercase">
              <tr>
                <th className="p-3 border border-gray-300">Job Title</th>
                <th className="p-3 border border-gray-300">Company</th>
                <th className="p-3 border border-gray-300">Location</th>
                <th className="p-3 border border-gray-300">Salary</th>
                <th className="p-3 border border-gray-300">Cover Letter</th>
                <th className="p-3 border border-gray-300">Applied Date</th>
                <th className="p-3 border border-gray-300">Status</th>
                <th className="p-3 border border-gray-300">Resume</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-300">
                    {app.job.title}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {app.job.company}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {app.job.location}
                  </td>
                  <td className="p-3 border border-gray-300">
                    NPR {app.job.salary}
                  </td>
                  <td className="p-3 border border-gray-300 italic truncate max-w-xs">
                    {app.coverLetter || "N/A"}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 border border-gray-300">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs ${
                        app.status === "Accepted"
                          ? "bg-green-600"
                          : app.status === "Rejected"
                            ? "bg-red-600"
                            : "bg-yellow-500"
                      }`}
                    >
                      {app.status || "Pending"}
                    </span>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <a
                      href={app.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      📥 View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
