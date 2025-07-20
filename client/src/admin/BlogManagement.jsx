import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const getBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/blog/all`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.data);
      }
    } catch (error) {
      console.log("Failed to get all blogs:", error);
      setError("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      const response = await fetch(`${BASE_URL}/blog/${blogId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        getBlogs();
      }
    } catch (error) {
      console.log("Failed to delete blog:", error);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    `${blog.title} ${blog.category}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <h1 className="text-3xl font-bold text-gray-700 text-center mb-8">
        Blog Management
      </h1>

      {error && <div className="text-red-600 text-center">{error}</div>}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="🔍 Search by title or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={() => navigate("/addBlog")}
          className="px-5 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-500 transition"
        >
          Add New Blog
        </button>
      </div>

      {loading ? (
        <div className="text-orange-500 text-center">Loading blogs ....</div>
      ) : filteredBlogs.length ? (
        <div className="overflow-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-200 text-gray-700 font-semibold">
              <tr>
                <th className="px-6 py-3">Thumbnail</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-200">
              {filteredBlogs.map((blog) => (
                <tr key={blog._id}>
                  <td className="px-6 py-4">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-20 h-14 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{blog.title}</td>
                  <td className="px-6 py-4 line-clamp-2 max-w-xs">
                    {blog.content}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => navigate(`/updateBlog/${blog._id}`)}
                      className="p-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteBlog(blog._id)}
                      className="p-3 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg mt-20">
          No blogs available yet.
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
