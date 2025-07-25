import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";

const SubmittedAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getAssignments = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/assignment/instructor/submittedAssignments`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAssignments(data.data || []);
      } else {
        console.error("Failed to get assignments");
      }
    } catch (error) {
      console.error("Failed to get assignments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAssignments();
  }, []);

  const filteredAssignments = assignments.filter((item) =>
    item.student?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-700 text-center">
        Submitted Assignments for Your Courses
      </h1>

      <div className="mb-4 ">
        <input
          type="text"
          placeholder="🔍  Search by student name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border  border-gray-300 px-4 py-2 rounded-full w-[600px] shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {loading ? (
        <p className="text-center">Loading assignments...</p>
      ) : filteredAssignments.length === 0 ? (
        <p className="text-center text-gray-600">
          No assignments submitted yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-left text-md font-semibold text-gray-700">
                <th className="py-3 px-4 border-b border-gray-300">Student</th>
                <th className="py-3 px-4 border-b border-gray-300">Course</th>
                <th className="py-3 px-4 border-b border-gray-300">
                  Assignment
                </th>
                <th className="py-3 px-4 border-b border-gray-300">
                  Submitted File
                </th>
                <th className="py-3 px-4 border-b border-gray-300">Status</th>
                <th className="py-3 px-4 border-b border-gray-300">
                  Submitted On
                </th>
                <th className="py-3 px-4 border-b border-gray-300">Comment</th>
                <th className="py-3 px-4 border-b border-gray-300">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((item) => (
                <tr
                  key={item._id}
                  className="text-sm border-b border-gray-300 hover:bg-gray-50"
                >
                  <td className="py-2 px-4 font-medium">
                    {item.student?.fullName || "N/A"}
                  </td>
                  <td className="py-2 px-4">{item.course?.title || "N/A"}</td>
                  <td className="py-2 px-4">
                    {item.assignment?.title || "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {item.submittedFile ? (
                      <a
                        href={item.submittedFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-700"
                      >
                        View File
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No file</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={
                        item.status === "Pending"
                          ? "text-yellow-600 font-semibold"
                          : item.status === "Reviewed"
                            ? "text-green-600 font-semibold"
                            : "text-gray-600"
                      }
                    >
                      {item.status || "N/A"}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4">{item.comment || "-"}</td>
                  <td className="py-2 px-4">
                    {item.instructorFeedback || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubmittedAssignments;
