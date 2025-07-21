import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../config/api";
import { toast } from "react-toastify";

const ResourceManagement = () => {
  const location = useLocation();
  const courseId = location.state;

  const [resources, setResources] = useState([]);
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("file"); // "file" or "link"

  // Fetch resources for this course
  const fetchResources = async () => {
    try {
      const res = await fetch(`${BASE_URL}/resource/course/${courseId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
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
    if (!title) return alert("Title is required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("courseId", courseId);
    formData.append("type", type);

    if (type === "file") {
      if (!file) return alert("Please select a file");
      formData.append("file", file);
    } else {
      if (!link) return alert("Please enter a valid link");
      formData.append("link", link);
    }

    try {
      const res = await fetch(`${BASE_URL}/resource/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      toast.success(data.message);
      setFile(null);
      setLink("");
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
      toast.success(data.message);
      fetchResources();
    } catch (err) {
      console.log("Failed to delete:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">📂 Resource Management</h1>

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="mb-8 flex flex-col sm:flex-row gap-4 items-center"
      >
        <input
          type="text"
          placeholder="Resource title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
          required
        />

        <div className="flex items-center gap-4">
          <label>
            <input
              type="radio"
              value="file"
              checked={type === "file"}
              onChange={() => setType("file")}
              className="mr-1"
            />
            File
          </label>
          <label>
            <input
              type="radio"
              value="link"
              checked={type === "link"}
              onChange={() => setType("link")}
              className="mr-1"
            />
            Link
          </label>
        </div>

        {type === "file" ? (
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2"
            required
          />
        ) : (
          <input
            type="url"
            placeholder="Paste link here"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
            required
          />
        )}

        <button
          type="submit"
          className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-500 transition"
        >
          Upload
        </button>
      </form>

      {/* Resource List */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Title
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Resource Link
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {resources.map((res) => (
            <tr key={res._id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{res.title}</td>
              <td className="border border-gray-300 px-4 py-2">
                <a
                  href={res.fileUrl || res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 underline"
                >
                  View Resource
                </a>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleDelete(res._id)}
                  className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-500 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!resources.length && (
        <p className="text-gray-500 text-center mt-10">
          No resources uploaded yet.
        </p>
      )}
    </div>
  );
};

export default ResourceManagement;
