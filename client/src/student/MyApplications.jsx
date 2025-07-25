import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";

const MyApplications = () => {
  const [myApplications, setMyApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null); // "coverLetter" or "resume"
  const [previewTitle, setPreviewTitle] = useState("");

  const getMyApplications = async () => {
    try {
      const response = await fetch(`${BASE_URL}/job/myApplications`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
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

  const formatSalary = (salary) =>
    Number(salary).toLocaleString("en-IN", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
    });

  const handlePreview = (url, type, title) => {
    // Toggle preview off if clicking the same one
    if (previewUrl === url) {
      setPreviewUrl(null);
      setPreviewType(null);
      setPreviewTitle("");
    } else {
      setPreviewUrl(url);
      setPreviewType(type);
      setPreviewTitle(title);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-4xl font-bold text-center text-gray-600 mb-10">
        📑 My Job Applications
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="🔍 Search by title, company or salary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {filteredApplications.length > 0 ? (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white table-auto border border-gray-100 text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-3 border border-gray-100">Job Title</th>
                <th className="p-3 border border-gray-100">Company</th>
                <th className="p-3 border border-gray-100">Location</th>
                <th className="p-3 border border-gray-100">Salary</th>
                <th className="p-3 border border-gray-100">Cover Letter</th>
                <th className="p-3 border border-gray-100">Applied Date</th>
                <th className="p-3 border border-gray-100">Status</th>
                <th className="p-3 border border-gray-100">Resume</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app._id} className="hover:bg-orange-50 transition">
                  <td className="p-3 border border-gray-100 font-medium text-indigo-600">
                    {app.job.title}
                  </td>
                  <td className="p-3 border border-gray-100">
                    {app.job.company}
                  </td>
                  <td className="p-3 border border-gray-100">
                    {app.job.location}
                  </td>
                  <td className="p-3 border border-gray-100 text-orange-600 font-semibold">
                    {formatSalary(app.job.salary)}
                  </td>
                  <td
                    className="p-3 border border-gray-100 italic truncate max-w-xs"
                    title={app.coverLetter || ""}
                  >
                    {app.coverLetter ? (
                      <button
                        onClick={() =>
                          handlePreview(
                            app.coverLetter,
                            "coverLetter",
                            app.job.title
                          )
                        }
                        className="text-blue-600 hover:underline"
                      >
                        📄 View
                      </button>
                    ) : (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </td>
                  <td className="p-3 border border-gray-100">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 border border-gray-100">
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
                  <td className="p-3 border border-gray-100">
                    {app.resume ? (
                      <button
                        onClick={() =>
                          handlePreview(app.resume, "resume", app.job.title)
                        }
                        className="text-blue-600 hover:underline"
                      >
                        📄 View
                      </button>
                    ) : (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Preview Section */}
          {previewUrl && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-lg border border-gray-300">
              <h2 className="text-xl font-semibold mb-3 text-gray-700">
                Preview: {previewType === "resume" ? "Resume" : "Cover Letter"}{" "}
                - {previewTitle}
              </h2>
              <iframe
                src={previewUrl}
                width="100%"
                height="500px"
                title={`Preview of ${previewType}`}
                className="rounded shadow-md border"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  setPreviewType(null);
                  setPreviewTitle("");
                }}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Close Preview
              </button>
            </div>
          )}
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
