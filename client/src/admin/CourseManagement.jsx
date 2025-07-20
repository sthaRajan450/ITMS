import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const getCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/course/getAllCourses`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        setCourses(data.data);
      }
    } catch (error) {
      console.error("Error while fetching courses:", error);
      setError("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch(`${BASE_URL}/course/delete/${courseId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        getCourses();
      }
    } catch (error) {
      console.error("Error while deleting course:", error);
    }
  };
  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-4xl font-bold  text-gray-600 text-center mb-8">
        Course Management
      </h1>

      {/* Add Course Button */}

      {error && <div className="text-red-700">{error}</div>}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => navigate("/addCourse")}
          className="px-5 py-4 bg-orange-600  text-white rounded-full hover:bg-orange-500 transition"
        >
          + Add New Course
        </button>
      </div>
      {loading ? (
        <div className="text-orange-700 text-center">
          {" "}
          Laoding courses .....{" "}
        </div>
      ) : (
        <div>
          {courses.length ? (
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300"
                >
                  {/* Course Thumbnail */}
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-2">
                      {course.title}
                    </h2>
                    <p className="text-gray-600 mb-3 line-clamp-3">
                      {course.description}
                    </p>

                    <div className="text-sm text-gray-500 mb-1">
                      <span className="font-medium">Level:</span> {course.level}
                    </div>
                    <div className="text-sm text-gray-500 mb-1">
                      <span className="font-medium">Duration:</span>{" "}
                      {course.duration}
                    </div>
                    <div className="text-sm text-gray-500 mb-1">
                      <span className="font-medium">Instructor:</span>{" "}
                      {course.instructor?.fullName || "N/A"}
                    </div>

                    <div className="text-lg font-bold text-blue-600 mt-3">
                      NPR {course.price}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center p-4 border-t">
                    <button
                      onClick={() => navigate(`/updateCourse/${course._id}`)}
                      className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteCourse(course._id)}
                      className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
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
      )}

      {/* Course List */}
    </div>
  );
};

export default CourseManagement;
