import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const StudentProgress = () => {
  const [progressData, setProgressData] = useState(null);
  const location = useLocation();
  const { courseId, studentId } = location.state;

  useEffect(() => {
    const fetchProgress = async () => {
      const res = await fetch(
        `http://localhost:9000/api/v1/progress/${courseId}/${studentId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log(data);
      setProgressData(data.data);
    };
    fetchProgress();
  }, [courseId, studentId]);

  if (!progressData) return <p className="text-orange-500">Loading progress...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Progress for {progressData.student.fullName}
      </h2>
      <p className="mb-2">Course: {progressData.course.title}</p>
      <table className="table-auto w-full border rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">Assignment</th>
            <th className="border border-gray-400 px-4 py-2">Status</th>
            <th className="border border-gray-400 px-4 py-2">Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {progressData.progress.map((p, idx) => (
            <tr key={idx}>
              <td className="border border-gray-400 px-4 py-2">{p.assignmentTitle}</td>
              <td className="border border-gray-400 px-4 py-2">{p.status}</td>
              <td className="border border-gray-400 px-4 py-2">
                {p.submittedAt
                  ? new Date(p.submittedAt).toLocaleString()
                  : "Not Submitted"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentProgress;
