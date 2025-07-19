import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { BASE_URL } from "../config/api";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuth } = useContext(AuthContext);
  const getBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/blog/all`);
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.data);
      }
    } catch (error) {
      console.log("Failed to fetch blogs:", error);
      setError("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-4xl font-bold text-center text-gray-700 mb-10">
        📝 Blogs
      </h1>
      {error && <div className="text-red-500 text-center">{error}</div>}
      {loading ? (
        <div className="text-center text-orange-500 text-lg">
          Loading blogs...
        </div>
      ) : (
        <div>
          {blogs.length > 0 ? (
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                      {blog.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">
                      📂 {blog.category}
                    </p>
                    <p className="text-gray-700 text-sm mb-4">
                      {blog.content.slice(0, 120)}...
                    </p>
                    <button
                      className="mt-2 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      onClick={() => {
                        if (!isAuth) {
                          navigate("/login");
                          return;
                        }
                        navigate(`/blog/${blog._id}`);
                      }}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 text-lg">
              No blogs posted yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blogs;
