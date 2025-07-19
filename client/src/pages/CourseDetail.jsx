import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { CartContext } from "../context/CartProvider";
import { BASE_URL } from "../config/api";
import { FaCartShopping } from "react-icons/fa6";

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { dispatch } = useContext(CartContext);

  const getCourse = async () => {
    try {
      const response = await fetch(`${BASE_URL}/course/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data.data);
        setCourse(data.data);
      }
    } catch (error) {
      console.log("Error fetching course details:", error);
    }
  };

  useEffect(() => {
    getCourse();
  }, [courseId]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Loading course details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-72 object-cover"
        />
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="font-semibold">Category:</p>
              <p>{course.category}</p>
            </div>
            <div>
              <p className="font-semibold">Level:</p>
              <p>{course.level}</p>
            </div>
            <div>
              <p className="font-semibold">Duration:</p>
              <p>{course.duration}</p>
            </div>
            <div>
              <p className="font-semibold">Enrollment Deadline:</p>
              <p>{new Date(course.enrollmentDeadline).toDateString()}</p>
            </div>
            <div>
              <p className="font-semibold">Price:</p>
              <p>NPR {course.price}</p>
            </div>
            <div>
              <p className="font-semibold">Prerequisites:</p>
              <p>{course.prerequisites}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-semibold mb-2">Syllabus:</p>
            <ul className="list-disc list-inside text-gray-700">
              {course.syllabus && course.syllabus.length > 0 ? (
                course.syllabus.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>No syllabus available</li>
              )}
            </ul>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => {
                if (!isAuth) {
                  navigate("/login");
                  return;
                }
                dispatch({ type: "add", payload: course });
                navigate("/cart");
              }}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700 transition shadow-md"
            >
              Enroll Now
            </button>

            <button
              onClick={() => {
                if (!isAuth) {
                  navigate("/login");
                  return;
                }
                dispatch({ type: "add", payload: course });
              }}
              className="px-4 py-2 bg-transparent flex  justify-center items-center  gap-x-3 text-purple-700 border-2 rounded-md hover:bg-purple-700 hover:text-white transition"
            >
              <FaCartShopping /> Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
