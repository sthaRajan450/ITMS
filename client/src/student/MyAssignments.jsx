import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";

const MyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-6">
      <h2 className="text-3xl text-center font-bold mb-6 text-gray-600">
        📄 Submitted Assignments
      </h2>

      {loading ? (
        <p>Loading assignments...</p>
      ) : assignments.length === 0 ? (
        <p className="text-gray-600 text-center">No assignments submitted yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border border-gray-300 bg-white  shadow">
            <thead>
              <tr className="bg-gray-100 text-left text-md font-semibold text-gray-700">
                <th className="py-3 px-4 border-b">Course</th>
                <th className="py-3 px-4 border-b">Submitted File</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Submitted On</th>
                <th className="py-3 px-4 border-b">Comment</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr
                  key={assignment._id}
                  className="text-sm border-b  border-gray-400 hover:bg-gray-50"
                >
                  <td className="py-2 px-4 font-medium">
                    {assignment.course?.title || "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {assignment.submittedFile ? (
                      <a
                        href={assignment.submittedFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-700"
                      >
                        {" "}
                        View File
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No file</span>
                    )}
                  </td>
                  <td className="py-2 px-4 font-medium">{assignment.status}</td>
                  <td className="py-2 px-4">
                    {new Date(assignment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    {assignment.comment ? assignment.comment : "-"}
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

export default MyAssignments;
