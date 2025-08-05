import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";

const AdminAttendanceManagement = () => {
  const [courses, setCourses] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("all");
  const [reportType, setReportType] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all courses once
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${BASE_URL}/course/getAllCourses`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setCourses(data.data);
          if (data.data.length > 0) setSelectedCourse(data.data[0]._id);
        } else {
          setError("Failed to fetch courses");
        }
      } catch (err) {
        setError("Network error fetching courses");
      }
    };
    fetchCourses();
  }, []);

  // Fetch students when selectedCourse is set
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/user/all/${selectedCourse}/students`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          // console.log(data.data);
          setAllStudents(data.data);
        } else {
          setError("Failed to fetch students");
        }
      } catch (err) {
        setError("Network error fetching students");
      }
    };
    fetchStudents();
  }, [selectedCourse]);

  // Filter students based on selected course
  useEffect(() => {
    if (!selectedCourse || allStudents.length === 0) {
      setFilteredStudents([]);
      setSelectedStudent("all");
      return;
    }

    const filtered = allStudents.filter(
      (student) =>
        Array.isArray(student.courses) &&
        student.courses.includes(selectedCourse)
    );

    setFilteredStudents(filtered);
    setSelectedStudent("all");
  }, [selectedCourse, allStudents]);

  const getDateRange = () => {
    const d = new Date(selectedDate);
    let from, to;

    switch (reportType) {
      case "daily":
        from = new Date(d.setHours(0, 0, 0, 0));
        to = new Date(d.setHours(23, 59, 59, 999));
        break;

      case "weekly": {
        const day = d.getDay(); // 0=Sun, 1=Mon...
        const mondayOffset = day === 0 ? -6 : 1 - day;
        from = new Date(d);
        from.setDate(d.getDate() + mondayOffset);
        from.setHours(0, 0, 0, 0);

        to = new Date(from);
        to.setDate(from.getDate() + 6);
        to.setHours(23, 59, 59, 999);
        break;
      }

      case "monthly":
        from = new Date(d.getFullYear(), d.getMonth(), 1);
        to = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        to.setHours(23, 59, 59, 999);
        break;

      case "yearly":
        from = new Date(d.getFullYear(), 0, 1);
        to = new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;

      default:
        from = new Date(d.setHours(0, 0, 0, 0));
        to = new Date(d.setHours(23, 59, 59, 999));
    }

    return {
      from: from.toISOString(),
      to: to.toISOString(),
    };
  };

  // Fetch attendance when filters change
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);

      const { from, to } = getDateRange();

      let url = `${BASE_URL}/attendance/report/all?courseId=${selectedCourse}&from=${from}&to=${to}`;

      if (selectedStudent !== "all") url += `&studentId=${selectedStudent}`;

      try {
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        // console.log(data.data);
        if (res.ok) {
          setAttendanceRecords(data.data);
        } else {
          setError(data.message || "Failed to fetch attendance");
          setAttendanceRecords([]);
        }
      } catch (err) {
        setError("Network error fetching attendance");
        setAttendanceRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedCourse, selectedStudent, reportType, selectedDate]);

  const updateAttendanceStatus = async (recordId, newStatus) => {
    try {
      const res = await fetch(`${BASE_URL}/attendance/${recordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setAttendanceRecords((prev) =>
          prev.map((rec) =>
            rec._id === recordId ? { ...rec, status: newStatus } : rec
          )
        );
      } else {
        const data = await res.json();
        alert(`Failed to update status: ${data.message}`);
      }
    } catch (err) {
      alert("Network error updating status");
    }
  };

  const exportCSV = () => {
    if (attendanceRecords.length === 0) {
      alert("No records to export");
      return;
    }
    const headers = ["Student Name", "Status", "Date", "Remarks"];
    const rows = attendanceRecords.map((rec) => [
      typeof rec.student === "object" ? rec.student.fullName : rec.student,
      rec.status,
      new Date(rec.date).toLocaleDateString(),
      rec.remarks || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin Attendance Dashboard</h2>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div>
          <label className="mr-2 font-semibold" htmlFor="courseSelect">
            Course:
          </label>
          <select
            id="courseSelect"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold" htmlFor="studentSelect">
            Student:
          </label>
          <select
            id="studentSelect"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="all">All Students</option>
            {allStudents.map((student) => (
              <option key={student?._id} value={student?._id}>
                {student?.fullName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold" htmlFor="reportTypeSelect">
            Report Type:
          </label>
          <select
            id="reportTypeSelect"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold" htmlFor="dateSelect">
            Date:
          </label>
          <input
            type="date"
            id="dateSelect"
            max={new Date().toISOString().split("T")[0]}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>

        <button
          onClick={exportCSV}
          disabled={loading}
          className={`px-4 py-1 rounded ml-auto ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white"
          }`}
        >
          {loading ? "Loading..." : "Export CSV"}
        </button>
      </div>

      {/* Loading/Error */}
      {loading && <p>Loading attendance records...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {/* Attendance Table */}
      {!loading && !error && attendanceRecords.length === 0 && (
        <p>No attendance records found.</p>
      )}

      {!loading && attendanceRecords.length > 0 && (
        <table
          className="table-auto w-full border"
          aria-label="Attendance Table"
        >
          <thead>
            <tr>
              <th className="border px-2 py-1">Student Name</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record) => (
              <tr key={record._id}>
                <td className="border px-2 py-1">
                  {typeof record.student === "object"
                    ? record.student?.fullName
                    : record.student}
                </td>
                <td className="border px-2 py-1 text-center">
                  <select
                    value={record.status}
                    onChange={(e) =>
                      updateAttendanceStatus(record._id, e.target.value)
                    }
                    className="border px-1 py-0 rounded"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </td>
                <td className="border px-2 py-1">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="border px-2 py-1">{record.remarks || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminAttendanceManagement;
