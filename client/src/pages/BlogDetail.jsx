import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../config/api";

const BlogDetail = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);

  const getBlog = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/blog/${blogId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setBlog(data.data);
      }
    } catch (error) {
      console.log("Failed to fetch blog:", error);
    }
  };

  useEffect(() => {
    getBlog();
  }, [blogId]);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Loading blog details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-80 object-cover"
        />
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {blog.title}
          </h1>
          <p className="text-sm text-gray-500 mb-2">📂 {blog.category}</p>
          <p className="text-sm text-gray-500 mb-4">
            ✍️ by {blog.author?.fullName} | 📅{" "}
            {new Date(blog.createdAt).toDateString()}
          </p>
          <p className="text-gray-700 text-base whitespace-pre-line leading-relaxed mb-8">
            {blog.content}
          </p>
          {!blog.isPublished && (
            <p className="text-xs text-orange-500 font-semibold">
              🔒 This blog is not yet published
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
