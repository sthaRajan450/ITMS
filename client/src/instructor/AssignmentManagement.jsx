import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../config/api";

const AssignmentManagement = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null);
  const [assignments, setAssignments] = useState([]);

  const location = useLocation();
  const courseId = location.state;

  const fetchAssignments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/assignment/course/${courseId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setAssignments(data.data);
    } catch (err) {
      console.log("Failed to fetch assignments:", err);
    }
  };

  useEffect(() => {
    if (courseId) fetchAssignments();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("deadline", deadline);
    formData.append("file", file);
    formData.append("courseId", courseId);

    try {
      const res = await fetch(`${BASE_URL}/assignment/create`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      alert(data.message);
      setFile(null);
      setTitle("");
      setDescription("");
      setDeadline("");
      fetchAssignments();
    } catch (err) {
      console.log("Failed to upload:", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-8">
        📑 Assignment Management
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Existing Assignments */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Existing Assignments
          </h2>
          {assignments.length === 0 ? (
            <p className="text-gray-600">
              No assignments found for this course.
            </p>
          ) : (
            <ul className="space-y-4">
              {assignments.map((assignment) => (
                <li
                  key={assignment._id}
                  className="border border-gray-200 rounded-md p-4"
                >
                  <h4 className="text-lg font-medium">{assignment.title}</h4>
                  <p className="text-gray-700">{assignment.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Deadline:{" "}
                    {new Date(assignment.deadline).toLocaleDateString()}
                  </p>
                  {assignment.fileUrl && (
                    <a
                      href={assignment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 underline text-sm mt-2 inline-block"
                    >
                      View Uploaded File
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Upload New Assignment */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white p-6 shadow-lg rounded-lg"
        >
          <div>
            <label className="block mb-1 font-medium text-gray-700" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter assignment title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter assignment description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700" htmlFor="deadline">
              Deadline
            </label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700" htmlFor="file">
              Upload File
            </label>
            <input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf,.doc,.docx,.txt"
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 rounded-full transition-colors"
          >
            Submit Assignment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignmentManagement;
