import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartProvider";
import { BASE_URL } from "../config/api";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const { dispatch } = useContext(CartContext);
  const navigate = useNavigate();
  const getCourses = async () => {
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
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <h1 className="text-3xl font-bold text-center mb-10">
        Available Courses
      </h1>

      {courses?.length !== 0 ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
            >
              <img
                onClick={() => {
                  navigate(`/courseDetail/${course._id}`);
                }}
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-60 object-cover cursor-pointer"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-2">{course.description}</p>
                <div className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">Level:</span> {course.level}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">Duration:</span>{" "}
                  {course.duration}
                </div>
                <div className="flex items-center gap-x-6 mt-4">
                  <div className="text-2xl font-bold text-blue-700">
                    NPR {course.price}
                  </div>

                  <button
                    onClick={() => {
                      dispatch({ type: "add", payload: course });
                    }}
                    className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Add to Cart 🛒
                  </button>
                </div>
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
  );
};

export default Courses;
