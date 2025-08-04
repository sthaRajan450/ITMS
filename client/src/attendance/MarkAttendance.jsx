import React, { useState, useEffect } from "react";
import { BASE_URL } from "../config/api";
import { toast } from "react-toastify";

const MarkAttendance = ({ students, courses }) => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [attendanceData, setAttendanceData] = useState({});
  const [markedStatus, setMarkedStatus] = useState({});
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!selectedCourse) return;

    const fetchAttendance = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/attendance/course/${selectedCourse}?date=${today}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (res.ok) {
          const result = await res.json();
          const fetchedData = result.data;

          const statusMap = {};
          const dataMap = {};

          fetchedData.forEach((record) => {
            const sid = record.student;
            statusMap[sid] = record.status;
            dataMap[sid] = {
              date: record.date?.split("T")[0] || today,
              remarks: record.remarks || "",
            };
          });

          setMarkedStatus(statusMap);
          setAttendanceData(dataMap);
        } else {
          setMarkedStatus({});
          setAttendanceData({});
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setMarkedStatus({});
        setAttendanceData({});
      }
    };

    fetchAttendance();
  }, [selectedCourse, today]);

  const handleInputChange = (studentId, field, value) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));

    setMarkedStatus((prev) => ({
      ...prev,
      [studentId]: null,
    }));
  };

  const handleMarkAttendance = async (studentId, status) => {
    if (!selectedCourse) {
      toast.warning("Please select a course first.");
      return;
    }

    const payload = {
      studentId,
      courseId: selectedCourse,
      status,
      date: attendanceData[studentId]?.date || today,
      remarks: attendanceData[studentId]?.remarks || "",
    };

    try {
      const res = await fetch(`${BASE_URL}/attendance/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Attendance marked");
        setMarkedStatus((prev) => ({ ...prev, [studentId]: status }));
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (err) {
      toast.error("Network error while marking attendance");
      console.error(err);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.enrolledCourses?.includes(selectedCourse)
  );

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="courseSelect" className="font-semibold mr-2">
          Select Course:
        </label>
        <select
          id="courseSelect"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="border p-1"
        >
          <option value="">-- Select a course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {selectedCourse ? (
        filteredStudents.length > 0 ? (
          <table className="min-w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Remarks</th>
                <th className="border px-2 py-1">Mark Attendance</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const record = attendanceData[student._id] || {};
                const status = markedStatus[student._id];

                return (
                  <tr key={student._id}>
                    <td className="border px-2 py-1">{student.fullName}</td>
                    <td className="border px-2 py-1">
                      <input
                        type="date"
                        value={record.date || today}
                        max={today}
                        onChange={(e) =>
                          handleInputChange(student._id, "date", e.target.value)
                        }
                        className="border p-1 w-full"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="text"
                        placeholder="Remarks"
                        value={record.remarks || ""}
                        onChange={(e) =>
                          handleInputChange(
                            student._id,
                            "remarks",
                            e.target.value
                          )
                        }
                        className="border p-1 w-full"
                      />
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {status ? (
                        <span
                          className={`font-semibold ${
                            status === "Present"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {status}
                        </span>
                      ) : (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() =>
                              handleMarkAttendance(student._id, "Present")
                            }
                            className="bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Present
                          </button>
                          <button
                            onClick={() =>
                              handleMarkAttendance(student._id, "Absent")
                            }
                            className="bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Absent
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 mt-4">
            No students are enrolled in the selected course.
          </p>
        )
      ) : (
        <p className="text-gray-500">Please select a course to mark attendance.</p>
      )}
    </div>
  );
};

export default MarkAttendance;
