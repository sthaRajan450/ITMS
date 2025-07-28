import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MyProgress = () => {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [myCourses, setMyCourses] = useState([]);

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
          setSelectedCourseId(data.data[0]._id);
        }
      }
    } catch (error) {
      console.log("Failed to fetch courses:", error);
    }
  };

  const fetchProgress = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/progress/my/${id}`, {
        credentials: "include",
      });
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      console.error("Error fetching progress", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchProgress(selectedCourseId);
    }
  }, [selectedCourseId]);

  const handleCourseChange = (e) => {
    setSelectedCourseId(e.target.value);
  };

  // Prepare data for chart - count assignments by status
  const chartData = data
    ? ["Reviewed", "Submitted", "Not Submitted"].map((status) => {
        let count = 0;
        if (status === "Not Submitted") {
          count = data.progress.filter((item) => !item.submittedAt).length;
        } else {
          count = data.progress.filter((item) => item.status === status).length;
        }
        return { status, count };
      })
    : [];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-700">
          My Assignment Progress
        </h2>
        <select
          onChange={handleCourseChange}
          value={selectedCourseId}
          className="mt-4 md:mt-0 border border-gray-300 p-2 rounded"
        >
          <option value="">-- Select Course --</option>
          {myCourses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center">Loading progress...</p>
      ) : !data ? (
        <p className="text-center text-gray-500">No progress yet</p>
      ) : (
        <>
          <p className="mb-4 text-lg text-gray-600">
            Course: <strong>{data.course.title}</strong>
          </p>

          {/* Chart */}
          <div style={{ width: "100%", height: 300, marginBottom: 30 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="green" name="Assignments" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <table className="table-auto w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Assignment</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Submitted At</th>
                <th className="p-2 border">Feedback</th>
                <th className="p-2 border">Score</th>
              </tr>
            </thead>
            <tbody>
              {data.progress.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 border">{item.assignmentTitle}</td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs text-white ${
                        item.status === "Reviewed"
                          ? "bg-green-600"
                          : item.status === "Submitted"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-2 border">
                    {item.submittedAt
                      ? new Date(item.submittedAt).toLocaleString()
                      : "Not Submitted"}
                  </td>
                  <td className="p-2 border">{item.feedback || "-"}</td>
                  <td className="p-2 border">
                    {item.score != null ? `${item.score}/100` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default MyProgress;
