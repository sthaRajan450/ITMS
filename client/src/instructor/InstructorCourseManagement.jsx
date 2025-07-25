import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";

const InstructorCourseManagement = () => {
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getMyCourses = async () => {
    try {
      const response = await fetch(`${BASE_URL}/course/getMyCourses`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setMyCourses(data.data);
      }
    } catch (error) {
      console.log("Failed to get your courses:", error);
    }
  };

  useEffect(() => {
    getMyCourses();
  }, []);
  const filteredCourses = myCourses.filter((course) =>
    `${course.title}  ${course.level}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl text-center font-bold text-gray-600 pb-5">
        Course Management
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="🔍 Search by title, or level"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      {filteredCourses.length ? (
        <div className="overflow-x-auto rounded-lg shadow-lg  ">
          <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="py-3 px-4 border-b border-gray-300">
                  Thumbnail
                </th>
                <th className="py-3 px-4 border-b border-gray-300">Title</th>
                <th className="py-3 px-4 border-b border-gray-300">
                  Description
                </th>
                <th className="py-3 px-4 border-b border-gray-300">Level</th>
                <th className="py-3 px-4 border-b border-gray-300">Duration</th>
                <th className="py-3 px-4 border-b border-gray-300">
                  Price (NPR)
                </th>
                <th className="py-3 px-4 border-b border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr
                  key={course._id}
                  className="text-sm border-b border-gray-300 hover:bg-gray-50"
                >
                  <td className="py-2 px-4">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-20 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-4 font-medium hover:text-blue-500">
                    {course.title}
                  </td>
                  <td className="py-2 px-4 text-gray-600 line-clamp-2">
                    {course.description}
                  </td>
                  <td className="py-2 px-4 ">{course.level}</td>
                  <td className="py-2 px-4">{course.duration}</td>
                  <td className="py-2 px-4 font-bold text-orange-600">
                    {course.price}
                  </td>
                  <td className="py-2 px-4 flex flex-col gap-1">
                    <button
                      onClick={() =>
                        navigate(`/instructor/resourceManagement`, {
                          state: course._id,
                        })
                      }
                      className="text-xs bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                    >
                      📂 Resources
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/instructor/assignmentManagement`, {
                          state: course._id,
                        })
                      }
                      className="text-xs bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                    >
                      📑 Assignments
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg mt-20">
          No courses available yet.
        </div>
      )}
    </div>
  );
};

export default InstructorCourseManagement;
