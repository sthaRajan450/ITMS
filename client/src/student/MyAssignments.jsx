import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";

const MyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMyAssignments = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/assignment/submitted/all`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data.data);
        setAssignments(data.data);
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
      <h2 className="text-3xl font-bold mb-6 text-blue-700">
        📄 My Submitted Assignments
      </h2>
      {loading ? (
        <p>Loading assignments...</p>
      ) : assignments.length === 0 ? (
        <p className="text-gray-600">No assignments submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {assignments.map((assignment) => (
            <li
              key={assignment._id}
              className="border p-4 rounded-lg shadow bg-white"
            >
              <p className="text-lg font-semibold text-gray-800">
                {assignment.assignment?.title || "Untitled Assignment"}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Course: {assignment.course?.title || "N/A"}
              </p>
              <a
                href={assignment.submittedFile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                📎 View Submitted File
              </a>
              <p className="text-sm text-gray-600 mt-1">
                Status: <span className="font-medium">{assignment.status}</span>
              </p>
              <p className="text-sm text-gray-500">
                Submitted on:{" "}
                {new Date(assignment.createdAt).toLocaleDateString()}
              </p>
              {assignment.comment && (
                <p className="text-sm text-gray-600 mt-1">
                  💬 {assignment.comment}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyAssignments;
