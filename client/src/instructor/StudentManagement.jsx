import React, { useEffect, useState } from "react";
import SendMessage from "./SendMessage";
import { BASE_URL } from "../config/api";
const StudentManagement = () => {
  const [students, setStudents] = useState([]);

  const getUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/all`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.data);
        setStudents(data.data);
      }
    } catch (error) {
      console.log("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        👩‍🎓 Student Management
      </h1>

      {students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {students.map((student) => (
            <div
              key={student._id}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <img
                src={student.avatar}
                alt={student.fullName}
                className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-blue-400"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {student.fullName}
              </h2>
              <p className="text-gray-600 mb-1">📧 {student.email}</p>
              <p className="text-gray-600 mb-1">📱 {student.phone}</p>
              <p className="text-sm text-gray-500 mt-2">
                Enrolled in: {student.enrolledCourses.length} course(s)
              </p>
              <SendMessage
                receiverId={student._id}
                courseId="686e354caaabe6fb428bcf9a"
              />
            </div>
          ))}
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
