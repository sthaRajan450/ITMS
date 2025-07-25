import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartProvider";
import { BASE_URL } from "../config/api";
import { AuthContext } from "../context/AuthProvider";
import { FaCartShopping } from "react-icons/fa6";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("createdAt-desc");

  const { dispatch } = useContext(CartContext);
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const getCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/course/getAllCourses`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.data);
      }
    } catch (error) {
      console.log("Error while fetching courses:", error);
      setError("Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const sortCourses = (courses) => {
    return courses.slice().sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "createdAt-desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <h1 className="text-4xl font-semibold text-center text-gray-600 mb-10">
        Available Courses
      </h1>

      {/* Sorting Dropdown */}
      <div className="mb-6 flex justify-end">
        <select
          className="border border-gray-300 px-4 py-2 rounded-lg text-sm shadow-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-orange-400 hover:shadow-md bg-white text-gray-700"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {error && <div className="text-red-500 text-center">{error}</div>}

      {loading ? (
        <div className="text-center text-orange-500 text-lg">
          Loading courses...
        </div>
      ) : (
        <div>
          {courses?.length !== 0 ? (
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              {sortCourses(courses).map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-102 transition-transform duration-300"
                >
                  <div className="h-80">
                    <img
                      onClick={() => {
                        navigate(`/courseDetail`, {
                          state: { courseId: course._id },
                        });
                      }}
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-40 object-cover cursor-pointer"
                    />
                    <div className="p-5">
                      <h2 className="text-xl font-semibold mb-2 hover:text-blue-500">
                        {course.title}
                      </h2>
                      <p className="text-sm text-gray-600 mb-2">
                        Category:
                        <span className="font-medium text-gray-800 hover:text-blue-500">
                          {course.category}
                        </span>
                      </p>
                      <p className="text-gray-600 mb-2 hover:text-blue-500 capitalize font-semibold">
                        {course.description}
                      </p>
                      <div className="flex gap-x-4">
                        <div className="text-sm text-gray-500 mb-2">
                          <span>Level:&nbsp;</span>
                          <span className="hover:text-blue-500 font-medium">
                            {course.level}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          <span>Duration:&nbsp;</span>
                          <span className="hover:text-blue-500 font-medium">
                            {course.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center px-5 py-3">
                    <div className="text-xl font-semibold text-orange-500">
                      NPR {course.price}
                    </div>

                    <button
                      onClick={() => {
                        if (!isAuth) {
                          navigate("/login");
                          return;
                        }
                        dispatch({ type: "add", payload: course });
                      }}
                      className="px-4 py-2 bg-transparent flex justify-center items-center gap-x-3 text-purple-700 border-2 rounded-md hover:bg-purple-700 hover:text-white transition"
                    >
                      <FaCartShopping /> Add To Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-lg">
              No courses added yet
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Courses;
