import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";

const MyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openPreviewId, setOpenPreviewId] = useState(null);

  const getMyAssignments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/assignment/submitted/all`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setAssignments(data.data || []);
      } else {
        console.error("Failed to fetch assignments");
      }
    } catch (error) {
      console.error("Failed to get assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyAssignments();
  }, []);

  const filteredAssignments = assignments.filter((item) =>
    item.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePreview = (id) => {
    setOpenPreviewId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl text-center font-bold mb-6 text-gray-700">
        📄 Submitted Assignments
      </h2>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="🔍 Search by course title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-full w-full max-w-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading assignments...</p>
      ) : filteredAssignments.length === 0 ? (
        <p className="text-gray-600 text-center">
          No assignments submitted yet.
        </p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full border border-gray-300 bg-white">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="py-3 px-4 border-b">Course</th>
                <th className="py-3 px-4 border-b">Submitted File</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Submitted On</th>
                <th className="py-3 px-4 border-b">Comment</th>
                <th className="py-3 px-4 border-b">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((assignment) => (
                <React.Fragment key={assignment._id}>
                  <tr className="text-sm border-b border-gray-300 hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">
                      {assignment.course?.title || "N/A"}
                    </td>
                    <td className="py-2 px-4">
                      {assignment.submittedFile ? (
                        <button
                          onClick={() => togglePreview(assignment._id)}
                          className="text-blue-600 underline hover:text-blue-700"
                        >
                          {openPreviewId === assignment._id ? "Hide" : "View File"}
                        </button>
                      ) : (
                        <span className="text-gray-400 italic">No file</span>
                      )}
                    </td>
                    <td className="py-2 px-4 font-medium">{assignment.status}</td>
                    <td className="py-2 px-4">
                      {new Date(assignment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">
                      {assignment.comment || "-"}
                    </td>
                    <td className="py-2 px-4">
                      {assignment.instructorFeedback || "-"}
                    </td>
                  </tr>

                  {openPreviewId === assignment._id && assignment.submittedFile && (
                    <tr>
                      <td colSpan="6" className="p-4 bg-gray-50">
                        <iframe
                          src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                            assignment.submittedFile
                          )}&embedded=true`}
                          title="Assignment File"
                          width="100%"
                          height="500"
                          className="rounded-md border shadow"
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAssignments;
