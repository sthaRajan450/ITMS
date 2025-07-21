import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";

const SubmittedAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.log(data);
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

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-700 text-center">
        Submitted Assignments for Your Courses
      </h1>

      {loading ? (
        <p>Loading assignments...</p>
      ) : assignments.length === 0 ? (
        <p className="text-center text-gray-600">
          No assignments submitted yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="py-3 px-4 border-b">Student</th>
                <th className="py-3 px-4 border-b">Course</th>
                <th className="py-3 px-4 border-b">Assignment</th>
                <th className="py-3 px-4 border-b">Submitted File</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Submitted On</th>
                <th className="py-3 px-4 border-b">Comment</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((item) => (
                <tr
                  key={item._id}
                  className="text-sm border-b hover:bg-gray-50"
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
                        📎 View File
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No file</span>
                    )}
                  </td>
                  <td className="py-2 px-4 font-medium">{item.status}</td>
                  <td className="py-2 px-4">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    {item.comment ? item.comment : "-"}
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
