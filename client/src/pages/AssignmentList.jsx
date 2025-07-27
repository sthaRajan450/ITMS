import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";

const AssignmentList = ({ courseId }) => {
  const [assignments, setAssignments] = useState([]);
  const [submittedAssignmentIds, setSubmittedAssignmentIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all assignments for the course
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

  // Fetch student's submitted assignments for this course
  const getSubmittedAssignments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/assignment/submitted/${courseId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      // Map to array of assignment IDs (strings)
      setSubmittedAssignmentIds(
        (data.data || []).map((item) => item.assignment.toString())
      );
    } catch (error) {
      console.error("Failed to fetch submitted assignments:", error);
    }
  };

  useEffect(() => {
    if (courseId) {
      setLoading(true);
      Promise.all([getAssignments(), getSubmittedAssignments()]).finally(() =>
        setLoading(false)
      );
    }
  }, [courseId]);

  if (loading)
    return <p className="text-center mt-10">Loading assignments...</p>;

  return (
    <div className="min-h-screen p-6">
      {assignments.length ? (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="py-3 px-4 border-b border-gray-300">Title</th>
                <th className="py-3 px-4 border-b border-gray-300">Description</th>
                <th className="py-3 px-4 border-b border-gray-300">Deadline</th>
                <th className="py-3 px-4 border-b border-gray-300">File</th>
                <th className="py-3 px-4 border-b border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => {
                const isSubmitted = submittedAssignmentIds.includes(
                  assignment._id.toString()
                );

                return (
                  <tr
                    key={assignment._id}
                    className="text-sm border-b border-gray-300 hover:bg-gray-50"
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
                        disabled={isSubmitted}
                        onClick={() => {
                          if (!isSubmitted) {
                            navigate(`/submitAssignment`, {
                              state: {
                                assignmentId: assignment._id,
                                courseId: assignment.course,
                              },
                            });
                          }
                        }}
                        className={`px-3 py-1 rounded text-xs transition ${
                          isSubmitted
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isSubmitted ? "Submitted" : "Submit"}
                      </button>
                    </td>
                  </tr>
                );
              })}
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
