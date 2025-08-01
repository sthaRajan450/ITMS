import React, { useContext, useEffect, useState } from "react";
import { BASE_URL } from "../config/api";
import { AuthContext } from "../context/AuthProvider";

const MyAttendance = () => {
  const [records, setRecords] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);
  const studentId = user?._id;

  // Fetch courses on mount
  useEffect(() => {
    const getMyCourses = async () => {
      try {
        const response = await fetch(`${BASE_URL}/course/getMyCourses`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setMyCourses(data.data);
          if (data.data.length > 0) {
            setSelectedCourse(data.data[0]._id);
          }
        } else {
          console.error("Failed to fetch courses. Status:", response.status);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    getMyCourses();
  }, []);

  // Fetch attendance records for student
  useEffect(() => {
    if (!studentId) return;

    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/attendance/${studentId}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
          setRecords(data.data);
        } else {
          setError(data.message || "Error fetching attendance");
        }
      } catch (error) {
        setError(error.message || "Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [studentId]);

  // Filter records by selectedCourse
  const filteredRecords = records.filter((record) => {
    // record.course might be object or string, so handle both
    if (!record.course) return false;
    if (typeof record.course === "string") {
      return record.course === selectedCourse;
    }
    if (typeof record.course === "object" && record.course._id) {
      return record.course._id === selectedCourse;
    }
    return false;
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Attendance Records</h2>

      {/* Course Dropdown */}
      {myCourses.length > 0 ? (
        <div className="mb-4">
          <label className="mr-2 font-semibold" htmlFor="courseSelect">
            Select Course:
          </label>
          <select
            id="courseSelect"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            {myCourses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>Loading courses...</p>
      )}

      {/* Loading / Error */}
      {loading && <p>Loading attendance records...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && filteredRecords.length === 0 && (
        <p>No attendance records for this course.</p>
      )}

      {/* Attendance Table */}
      {!loading && filteredRecords.length > 0 && (
        <table
          className="table-auto w-full border"
          aria-label="Attendance Records"
        >
          <thead>
            <tr>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record._id}>
                <td className="border px-2 text-center py-1">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="border px-2 text-center py-1">
                  {record.status}
                </td>
                <td className="border px-2 text-center py-1">
                  {record.remarks || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyAttendance;
