import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CourseManagement = () => {
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);

  const getMyCourses = async () => {
    try {
      const response = await fetch(
        "http://localhost:9000/api/v1/course/getMyCourses",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMyCourses(data.data);
      }
    } catch (error) {
      console.log("Failed to get your courses:", error);
    }
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/course/delete/${courseId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        getMyCourses();
      }
    } catch (error) {
      console.error("Error while deleting course:", error);
    }
  };

  useEffect(() => {
    getMyCourses();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-center mb-6">
        <button
          onClick={() => navigate("/addCourses")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          + Add New Course
        </button>
      </div>

      {myCourses.length ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {myCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-3 line-clamp-3">
                  {course.description}
                </p>
                <div className="text-sm text-gray-500 mb-1">
                  <span className="font-medium">Level:</span> {course.level}
                </div>
                <div className="text-sm text-gray-500 mb-1">
                  <span className="font-medium">Duration:</span> {course.duration}
                </div>
                <div className="text-lg font-bold text-blue-600 mt-3">
                  NPR {course.price}
                </div>
              </div>

              <div className="flex flex-col gap-2 px-4 pb-4">
                <button
                  onClick={() => navigate(`/updateCourse/${course._id}`)}
                  className="text-sm py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  ✏️ Update Course
                </button>
                <button
                  onClick={() => navigate(`/instructor/resourceManagement/${course._id}`)}
                  className="text-sm py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  📂 Manage Resources
                </button>
                <button
                  onClick={() => navigate(`/instructor/assignmentManagement/${course._id}`)}
                  className="text-sm py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  📑 Manage Assignments
                </button>
                <button
                  onClick={() => deleteCourse(course._id)}
                  className="text-sm py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  🗑️ Delete Course
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg mt-20">
          No courses available yet.
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
