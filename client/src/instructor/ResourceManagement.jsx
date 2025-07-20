import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { BASE_URL } from "../config/api";
const ResourceManagement = () => {
  const location = useLocation();
  const courseId = location.state;

  const [resources, setResources] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  // Fetch resources for this course
  const fetchResources = async () => {
    try {
      const res = await fetch(`${BASE_URL}/resource/course/${courseId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      console.log(data.data);
      setResources(data.data);
    } catch (err) {
      console.log("Failed to fetch resources:", err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [courseId]);

  // Upload new resource
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("courseId", courseId);

    try {
      const res = await fetch(`${BASE_URL}/resource/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      alert(data.message);
      setFile(null);
      setTitle("");
      fetchResources();
    } catch (err) {
      console.log("Failed to upload:", err);
    }
  };

  // Delete a resource
  const handleDelete = async (resourceId) => {
    try {
      const res = await fetch(`${BASE_URL}/resource/delete/${resourceId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      alert(data.message);
      fetchResources();
    } catch (err) {
      console.log("Failed to delete:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">📂 Resource Management</h1>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="mb-8 flex gap-4 items-center">
        <input
          type="text"
          placeholder="Resource title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Upload
        </button>
      </form>

      {/* Resource List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res) => (
          <div key={res._id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">{res.title}</h2>
            <a
              href={res.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Resource
            </a>

            <button
              onClick={() => handleDelete(res._id)}
              className="mt-3 block bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {!resources.length && (
        <p className="text-gray-500 text-center mt-10">
          No resources uploaded yet.
        </p>
      )}
    </div>
  );
};

export default ResourceManagement;
