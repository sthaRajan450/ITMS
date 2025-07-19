import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartProvider";
import { BASE_URL } from "../config/api";
import { AuthContext } from "../context/AuthProvider";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useContext(CartContext);

  const navigate = useNavigate();

  const { isAuth } = useContext(AuthContext);

  const getCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/course/getAllCourses`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
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

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <h1 className="text-4xl font-semibold text-center text-gray-600 mb-10">
        Available Courses
      </h1>
      {error && <div className="text-red-500 text-center">{error}</div>}

      {Loading ? (
        <div className="text-center text-orange-500 text-lg">
          Loading courses...
        </div>
      ) : (
        <div>
          {courses?.length !== 0 ? (
            <div className="grid gap-8 grid-cols-1  sm:grid-cols-2 md:grid-cols-4">
              {courses.map((course) => (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-102 transition-transform duration-300">
                  <div key={course._id} className=" h-80 ">
                    <img
                      onClick={() => {
                        navigate(`/courseDetail/${course._id}`);
                      }}
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-40 object-cover cursor-pointer"
                    />
                    <div className="p-5">
                      <h2 className="text-xl font-semibold mb-2">
                        {course.title}
                      </h2>
                      <p className="text-gray-600 mb-2">{course.description}</p>
                      <div className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">Level:</span>{" "}
                        {course.level}
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">Duration:</span>{" "}
                        {course.duration}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center  px-5 py-3">
                    <div className="text-xl font-bold text-orange-500">
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
                      className="px-4 py-2 bg-purple-500 text-white rounded-md hover:opacity-90 transition"
                    >
                      Add To Cart
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
