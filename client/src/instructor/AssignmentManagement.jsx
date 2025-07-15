import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AssignmentManagement = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null);
  const [assignments, setAssignments] = useState([]);

  const { courseId } = useParams();

  const fetchAssignments = async () => {
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
    } catch (err) {
      console.log("Failed to fetch assignments:", err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ title, description, deadline, file });

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("deadline", deadline);
    formData.append("file", file);
    formData.append("courseId", courseId);

    try {
      const res = await fetch(
        `http://localhost:9000/api/v1/assignment/create`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Create Assignment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            className="block mb-1 font-medium text-gray-700"
            htmlFor="title"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label
            className="block mb-1 font-medium text-gray-700"
            htmlFor="description"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label
            className="block mb-1 font-medium text-gray-700"
            htmlFor="deadline"
          >
            Deadline
          </label>
          <input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label
            className="block mb-1 font-medium text-gray-700"
            htmlFor="file"
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors"
        >
          Submit Assignment
        </button>
      </form>

      {/* 📋 List of existing assignments */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Existing Assignments
        </h3>
        {assignments.length === 0 ? (
          <p className="text-gray-600">No assignments found for this course.</p>
        ) : (
          <ul className="space-y-4">
            {assignments.map((assignment) => (
              <li
                key={assignment._id}
                className="border border-gray-300 rounded-md p-4"
              >
                <h4 className="text-lg font-medium">{assignment.title}</h4>
                <p className="text-gray-700">{assignment.description}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Deadline: {new Date(assignment.deadline).toLocaleDateString()}
                </p>
                {assignment.fileUrl && (
                  <a
                    href={assignment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm mt-2 inline-block"
                  >
                    View Uploaded File
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AssignmentManagement;
