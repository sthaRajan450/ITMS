import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../config/api";
import { toast } from "react-toastify";

const AssignmentManagement = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const courseId = location.state;

  // Fetch assignments for the course
  const fetchAssignments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/assignment/course/${courseId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setAssignments(data.data || []);
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
      // toast.error("Failed to fetch assignments");
    }
  };

  // Delete assignment by ID
  const deleteAssignment = async (assignmentId) => {
    try {
      const response = await fetch(`${BASE_URL}/assignment/${assignmentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        fetchAssignments(); // Refresh list after deletion
      } else {
        toast.error("Failed to delete assignment");
      }
    } catch (error) {
      console.error("Failed to delete assignment", error);
      toast.error("Failed to delete assignment");
    }
  };

  useEffect(() => {
    if (courseId) fetchAssignments();
  }, [courseId]);

  // Submit new assignment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !deadline) {
      toast.warn("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("deadline", deadline);
    if (file) formData.append("file", file);
    formData.append("courseId", courseId);
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/assignment/create`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setTitle("");
        setDescription("");
        setDeadline("");
        setFile(null);
        fetchAssignments();
      } else {
        toast.error(data.message || "Failed to upload assignment");
      }
    } catch (err) {
      console.error("Failed to upload:", err);
      toast.error("Failed to upload assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-8">
        📑 Assignment Management
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Existing Assignments */}
        <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Existing Assignments
          </h2>
          {assignments.length === 0 ? (
            <p className="text-gray-600">
              No assignments found for this course.
            </p>
          ) : (
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                    Deadline
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                    File
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr
                    key={assignment._id}
                    className="text-sm border-b border-gray-300 hover:bg-gray-50"
                  >
                    <td className="py-2 px-4 font-medium">
                      {assignment.title}
                    </td>
                    <td className="py-2 px-4">{assignment.description}</td>
                    <td className="py-2 px-4">
                      {new Date(assignment.deadline).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">
                      {assignment.fileUrl ? (
                        <a
                          href={assignment.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 underline hover:text-orange-700"
                        >
                          View File
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">No file</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => deleteAssignment(assignment._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Upload New Assignment */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white p-6 rounded-lg shadow"
          encType="multipart/form-data"
        >
          <div>
            <label
              htmlFor="title"
              className="block mb-1 font-medium text-gray-700"
            >
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
            <label
              htmlFor="description"
              className="block mb-1 font-medium text-gray-700"
            >
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
            <label
              htmlFor="deadline"
              className="block mb-1 font-medium text-gray-700"
            >
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
            <label
              htmlFor="file"
              className="block mb-1 font-medium text-gray-700"
            >
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
            {loading ? "Submitting.." : "Submit Assignment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignmentManagement;
