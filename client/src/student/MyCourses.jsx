import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-600">
        Enrolled Courses
      </h2>

      {myCourses.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full table-auto border border-gray-100 bg-white">
            <thead>
              <tr className="bg-gray-300 text-left text-sm font-semibold text-black">
                <th className="py-3 px-4 border-b border-gray-100">Thumbnail</th>
                <th className="py-3 px-4 border-b border-gray-100">Title</th>
                <th className="py-3 px-4 border-b border-gray-100">Category</th>
                <th className="py-3 px-4 border-b border-gray-100">Description</th>
                <th className="py-3 px-4 border-b border-gray-100">Duration</th>
                <th className="py-3 px-4 border-b border-gray-100">Level</th>
                <th className="py-3 px-4 border-b border-gray-100">Price</th>
              </tr>
            </thead>
            <tbody>
              {myCourses.map((course) => (
                <tr
                  key={course._id}
                  className="hover:bg-indigo-50 cursor-pointer text-sm transition"
                  onClick={() => navigate("/student/course", { state: course })}
                >
                  <td className="py-2 px-4 border-b border-gray-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-20 h-14 object-cover rounded-md border border-gray-200"
                    />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-100 font-medium text-blue-600 hover:underline">
                    {course.title}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-100 capitalize">
                    {course.category}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-100 text-gray-700 line-clamp-2">
                    {course.description}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-100">{course.duration}</td>
                  <td className="py-2 px-4 border-b border-gray-100 capitalize">{course.level}</td>
                  <td className="py-2 px-4 border-b border-gray-100 text-orange-600 font-semibold">
                    {formatPrice(course.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
