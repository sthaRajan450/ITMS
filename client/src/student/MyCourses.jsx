import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState([]);

  const getMyCourses = async () => {
    try {
      const response = await fetch(`${BASE_URL}/course/getMyCourses`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setMyCourses(data.data);
      } else {
        console.log("Failed to fetch courses. Status:", response.status);
      }
    } catch (error) {
      console.log("Failed to fetch courses:", error);
    }
  };

  useEffect(() => {
    getMyCourses();
  }, []);

  const formatPrice = (price) => {
    return price.toLocaleString("en-IN", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
    });
  };

  const navigate = useNavigate();
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">
        My Courses
      </h2>

      {myCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {myCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Category:{" "}
                  <span className="font-medium text-gray-800">
                    {course.category}
                  </span>
                </p>
                <p className="text-gray-700 mb-3">{course.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <span>
                    <strong>Duration:</strong> {course.duration}
                  </span>
                  <span>
                    <strong>Level:</strong> {course.level}
                  </span>
                  <span>
                    <strong>Price:</strong> {formatPrice(course.price)}
                  </span>
                </div>
              </div>

              <div className="flex justify-center ">
                <button
                  className="mb-5 bg-blue-600 text-white p-3  rounded-lg hover:bg-blue-800"
                  onClick={() => {
                    navigate(`/assignments/${course._id}`);
                  }}
                >
                  Assignments
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-20 text-lg">
          You have not enrolled in any courses yet.
        </p>
      )}
    </div>
  );
};

export default MyCourses;
