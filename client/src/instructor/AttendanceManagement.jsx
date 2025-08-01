import React, { useEffect, useState } from "react";
import MarkAttendance from "../attendance/MarkAttendance";
import { BASE_URL } from "../config/api";

const AttendanceManagement = () => {
  const [students, setStudents] = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]); // added state

  const getStudents = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/all`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data.data);
      } else {
        console.error("Failed to fetch students.");
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
        // Map only id and title
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
    getStudents();
    getInstructorCourses();
  }, []);

  return (
    <div className="p-4 w-full mx-auto">
      <h1 className="text-3xl text-gray-700 font-bold mb-4 text-center">
        Attendance Management
      </h1>
    
      <MarkAttendance students={students} courses={instructorCourses} />
    </div>
  );
};

export default AttendanceManagement;
