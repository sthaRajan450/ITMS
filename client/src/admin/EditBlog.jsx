import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditBlog = () => {
  const { blogId } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  // Fetch existing blog data (optional but useful)
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(
          `http://localhost:9000/api/v1/blog/${blogId}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setTitle(data.data.title);
          setContent(data.data.content);
          setCategory(data.data.category);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };
    fetchBlog();
  }, [blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/blog/${blogId}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setTitle("");
        setContent("");
        setCategory("");
        setImage(null);
        navigate('/admin/contentManagement')

      } else {
        const err = await response.json();
        alert(err.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Failed to update blog:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
        Update Blog
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
