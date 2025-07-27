import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../config/api";
import { toast } from "react-toastify";

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (image) formData.append("image", image);

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/blog/create`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.data);
        toast.success(data.message);
        setTitle("");
        setContent("");
        setCategory("");
        setImage(null);
        navigate("/admin/blogManagement");
      } else {
        const err = await response.json();
        alert(err.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Failed to add blog:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto m-14 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-600">
        Add Blog
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-600 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-gray-600 mb-1">
            Category
          </label>
          <input
            type="text"
            id="category"
            className="w-full border p-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-gray-600 mb-1">
            Content
          </label>
          <textarea
            id="content"
            rows="5"
            className="w-full border p-2 rounded"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label htmlFor="image" className="block text-gray-600 mb-1">
            Upload New Image (optional)
          </label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded-full hover:bg-orange-500 transition"
        >
          {loading ? "Adding..." : "Add Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
