import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
const StudentProgress = () => {
  const [progressData, setProgressData] = useState(null);
  const location = useLocation();
  const { courseId, studentId } = location.state;

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch(
          `http://localhost:9000/api/v1/progress/${courseId}/${studentId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        console.log(data.data);
        setProgressData(data.data);
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      }
    };

    fetchProgress();
  }, [courseId, studentId]);

  if (!progressData)
    return <p className="text-orange-500">Loading progress...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        Progress for {progressData.student.fullName}
      </h2>
      <p className="mb-4 text-lg text-gray-600">
        Course: <strong>{progressData.course.title}</strong>
      </p>

      <table className="table-auto w-full border rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Assignment</th>
            <th className="border px-4 py-2 text-left">Status</th>
            <th className="border px-4 py-2 text-left">Submitted At</th>
            <th className="border px-4 py-2 text-left">Feedback</th>
          </tr>
        </thead>
        <tbody>
          {progressData.progress.map((p, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{p.assignmentTitle}</td>
              <td className="border px-4 py-2">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-white text-xs ${
                    p.status === "Reviewed" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                >
                  {p.status}
                </span>
              </td>
              <td className="border px-4 py-2">
                {p.submittedAt
                  ? new Date(p.submittedAt).toLocaleString()
                  : "Not Submitted"}
              </td>
              <td className="border px-4 py-2">
                {p.status === "Submitted" ? (
                  <MarkReviewed submissionId={p.submissionId} />
                ) : (
                  <span className="text-sm text-gray-600">
                    {p.feedback || "Reviewed"}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MarkReviewed = ({ submissionId }) => {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMark = async () => {
    if (!feedback) return toast.warning("Please enter feedback");
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:9000/api/v1/assignment/review/${submissionId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ feedback }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Failed to mark reviewed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <textarea
        rows="2"
        placeholder="Enter feedback..."
        className="border p-1 text-sm w-full"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <button
        onClick={handleMark}
        disabled={loading}
        className="bg-green-600 text-white px-2 py-1 text-sm rounded hover:bg-green-700"
      >
        {loading ? "Submitting..." : "Mark Reviewed"}
      </button>
    </div>
  );
};

export default StudentProgress;
