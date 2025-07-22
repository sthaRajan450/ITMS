import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
        toast.success(data.message);
        getCourses();
      }
    } catch (error) {
      console.error("Error while deleting course:", error);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    `${course.title} ${course.instructor?.fullName} ${course.level}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-700 text-center mb-6">
        Course Management
      </h1>

      {error && <div className="text-red-600 text-center mb-4">{error}</div>}

      {/* Search and Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="🔍 Search by title, instructor, or level"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={() => navigate("/addCourse")}
          className="px-5 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-500 transition"
        >
          Add New Course
        </button>
      </div>

      {loading ? (
        <p className="text-center text-orange-600 ">Loading courses...</p>
      ) : filteredCourses.length ? (
        <div className="overflow-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-200 text-gray-700 font-semibold">
              <tr>
                <th className="px-6 py-3">Thumbnail</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Level</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Instructor</th>
                <th className="px-6 py-3">Price (NPR)</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCourses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{course.title}</td>
                  <td className="px-6 py-4 line-clamp-2">
                    {course.description}
                  </td>
                  <td className="px-6 py-4">{course.level}</td>
                  <td className="px-6 py-4">{course.duration}</td>
                  <td className="px-6 py-4">
                    {course.instructor?.fullName || "N/A"}
                  </td>
                  <td className="px-6 py-4 font-bold text-orange-600">
                    {course.price}
                  </td>
                  <td className="px-6 py-4 flex gap-2 justify-center">
                    <button
                      onClick={() =>
                        navigate(`/updateCourse`, { state: course._id })
                      }
                      className="px-4 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteCourse(course._id)}
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
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
        <p className="text-center text-gray-500 text-lg mt-10">
          No courses found.
        </p>
      )}
    </div>
  );
};

export default CourseManagement;
