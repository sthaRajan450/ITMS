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
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Avatar</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Phone</th>
                <th className="border border-gray-300 px-4 py-2">Courses</th>
                <th className="border border-gray-300 px-4 py-2">View Progress</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const relevantCourses = instructorCourses.filter((ic) =>
                  student.enrolledCourses.includes(ic._id)
                );

                if (relevantCourses.length === 0) return null;

                return (
                  <tr key={student._id} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">
                      <img
                        src={student.avatar}
                        alt={student.fullName}
                        className="w-12 h-12 rounded-full mx-auto object-cover border-2 border-gray-400"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{student.fullName}</td>
                    <td className="border border-gray-300 px-4 py-2">{student.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{student.phone}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {relevantCourses.map((course) => course.title).join(", ")}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
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
                        className="border border-orange-500 px-2 py-1 rounded text-sm w-full"
                      >
                        <option value="" disabled>
                          Select Course
                        </option>
                        {relevantCourses.map((course) => (
                          <option key={course._id} value={course._id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
