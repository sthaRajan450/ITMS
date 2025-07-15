import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const AssignmentList = () => {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();
  const getAssignments = async () => {
    try {
      const res = await fetch(
        `http://localhost:9000/api/v1/assignment/course/${courseId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log(data.data);
      setAssignments(data.data);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    }
  };

  useEffect(() => {
    getAssignments();
  }, [courseId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">
        📄 Assignments for this Course
      </h1>

      {assignments.length ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => (
            <div
              key={assignment._id}
              className="bg-white p-5 rounded-xl shadow hover:scale-[1.01] transition"
            >
              <h2 className="text-xl font-semibold mb-2">{assignment.title}</h2>
              <p className="text-gray-600 mb-2 line-clamp-3">
                {assignment.description}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                📅 Deadline: {new Date(assignment.deadline).toDateString()}
              </p>
              <a
                href={assignment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm block mb-3"
              >
                📥 View Assignment File
              </a>
              <button
                onClick={() => {
                  navigate(`/submitAssignment/${assignment._id}`, {
                    state: { courseId: assignment.course },
                  });
                }}
                className="block text-center py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Submit Assignment
              </button>
            </div>
          ))}
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
