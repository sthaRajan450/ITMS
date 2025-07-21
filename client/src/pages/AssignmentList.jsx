import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";

const AssignmentList = ({ courseId }) => {
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  const getAssignments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/assignment/course/${courseId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setAssignments(data.data || []);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    }
  };

  useEffect(() => {
    if (courseId) {
      getAssignments();
    }
  }, [courseId]);

  return (
    <div className="min-h-screen p-6">
      {assignments.length ? (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="py-3 px-4 border-b">Title</th>
                <th className="py-3 px-4 border-b">Description</th>
                <th className="py-3 px-4 border-b">Deadline</th>
                <th className="py-3 px-4 border-b">File</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr
                  key={assignment._id}
                  className="text-sm border-b hover:bg-gray-50"
                >
                  <td className="py-2 px-4 font-medium">{assignment.title}</td>
                  <td className="py-2 px-4 line-clamp-3">
                    {assignment.description}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(assignment.deadline).toDateString()}
                  </td>
                  <td className="py-2 px-4">
                    {assignment.fileUrl ? (
                      <a
                        href={assignment.fileUrl}
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
                    <button
                      onClick={() => {
                        navigate(`/submitAssignment`, {
                          state: {
                            assignmentId: assignment._id,
                            courseId: assignment.course,
                          },
                        });
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-xs"
                    >
                      Submit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500 text-center text-lg mt-20">
          No assignments posted yet.
        </div>
      )}
    </div>
  );
};

export default AssignmentList;
