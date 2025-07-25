import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const navigate = useNavigate();

  const getUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/all`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data.data);
      }
    } catch (error) {
      console.log("Failed to fetch users:", error);
    }
  };

  const getInstructorCourses = async () => {
    try {
      const response = await fetch(`${BASE_URL}/course/getMyCourses`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        const ids = data.data.map((course) => ({
          _id: course._id,
          title: course.title,
        }));
        setInstructorCourses(ids);
      }
    } catch (error) {
      console.log("Failed to fetch instructor courses:", error);
    }
  };

  useEffect(() => {
    getUsers();
    getInstructorCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-4xl font-bold text-center text-gray-600 mb-8">
        👩‍🎓 Student Management
      </h1>

      {students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {students.map((student) => {
            // Find all instructor courses the student is enrolled in
            const relevantCourses = instructorCourses.filter((ic) =>
              student.enrolledCourses.includes(ic._id)
            );

            if (relevantCourses.length === 0) return null;

            return (
              <div
                key={student._id}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition"
              >
                <img
                  src={student.avatar}
                  alt={student.fullName}
                  className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-orange-400"
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {student.fullName}
                </h2>
                <p className="text-gray-600 mb-1">📧 {student.email}</p>
                <p className="text-gray-600 mb-1">📱 {student.phone}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Enrolled in: {relevantCourses.length} relevant course(s)
                </p>

                <select
                  onChange={(e) =>
                    navigate("/instructor/studentProgress", {
                      state: {
                        courseId: e.target.value,
                        studentId: student._id,
                      },
                    })
                  }
                  defaultValue=""
                  className="mt-4 border border-orange-500 px-3 py-2 rounded w-full text-sm"
                >
                  <option value="" disabled className="text-gray-500" >
                    Select course to view progress
                  </option>
                  {relevantCourses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg mt-20">
          No students enrolled yet.
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
