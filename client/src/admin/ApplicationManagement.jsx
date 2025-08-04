import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";
import { toast } from "react-toastify";

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewTitle, setPreviewTitle] = useState("");

  const getApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/job/applications`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data.data);
      } else {
        const err = await response.json();
        setError(err.message);
      }
    } catch (error) {
      setError("Failed to fetch applications");
    } finally {
      setLoading(false);
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

      const data = await response.json();
      if (response.ok) {
       
        toast.success(data.message);
        getApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(`Failed to ${action} application`);
    }
  };

  useEffect(() => {
    getApplications();
  }, []);

  const filteredApplications = applications.filter((app) =>
    `${app.job.title} ${app.job.company}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Toggle preview: open if different URL or close if same URL clicked
  const handlePreview = (url, title) => {
    if (previewUrl === url) {
      setPreviewUrl(null);
      setPreviewTitle("");
    } else {
      setPreviewUrl(url);
      setPreviewTitle(title);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-600">
        📄 Application Management
      </h1>

      {error && <div className="text-red-600 text-center mb-4">{error}</div>}

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="🔍 Search by title or company"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {loading ? (
        <div className="text-orange-600 text-center">
          Loading applications...
        </div>
      ) : filteredApplications.length > 0 ? (
        <>
          <div className="overflow-x-auto shadow-lg">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
              <thead className="bg-gray-200 text-gray-700 text-left text-sm">
                <tr>
                  <th className="py-3 px-4">Job Title</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Salary</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Cover Letter</th>
                  <th className="py-3 px-4">Resume</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr
                    key={app._id}
                    className="border-t hover:bg-gray-100 transition"
                  >
                    <td className="py-3 px-4 text-sm">{app.job.title}</td>
                    <td className="py-3 px-4 text-sm">{app.job.company}</td>
                    <td className="py-3 px-4 text-sm">NPR {app.job.salary}</td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(app.appliedAt).toDateString()}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      <button
                        onClick={() =>
                          handlePreview(app.coverLetter, "Cover Letter Preview")
                        }
                        className="text-blue-600 hover:underline"
                      >
                        {previewUrl === app.coverLetter
                          ? "📄 Hide CoverLetter"
                          : "📄 View CoverLetter"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <button
                        onClick={() =>
                          handlePreview(app.resume, "Resume Preview")
                        }
                        className="text-blue-600 hover:underline"
                      >
                        {previewUrl === app.resume
                          ? "📄 Hide Resume"
                          : "📄 View Resume"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-sm">
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
                    <td className="py-3 px-4 space-x-2">
                      {app.status === "Pending" ? (
                        <div className="flex gap-x-5">
                          <button
                            onClick={() =>
                              acceptOrRejectApplication(app._id, "accept")
                            }
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              acceptOrRejectApplication(app._id, "reject")
                            }
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">
                          No Action Available
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Preview iframe section */}
          {previewUrl && (
            <div className="mt-8 p-4 bg-white rounded shadow max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold mb-4 text-center">
                {previewTitle}
              </h2>
              <iframe
                src={previewUrl}
                title={previewTitle}
                width="100%"
                height="600px"
                frameBorder="0"
                className="border rounded"
              />
              <div className="text-center mt-2">
                <button
                  onClick={() => setPreviewUrl(null)}
                  className="px-4 py-2 mt-4 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Close Preview
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500 text-lg mt-20">
          No applications found.
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;
