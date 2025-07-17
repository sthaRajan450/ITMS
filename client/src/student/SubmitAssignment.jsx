import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../config/api";

const SubmitAssignment = () => {
  const { assignmentId } = useParams();

  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");
  const location = useLocation();
  const { courseId } = location.state;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload your assignment file.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("comment", comment);
    formData.append("assignmentId", assignmentId);
    formData.append("courseId", courseId);

    try {
      const res = await fetch(`${BASE_URL}/assignment/submit`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        console.log(data.data);
        alert(data.message);
        navigate("/student/myAssignments");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow mt-10">
      <h1 className="text-2xl font-bold mb-6">📥 Submit Your Assignment</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Upload File (PDF/ZIP)
          </label>
          <input
            type="file"
            accept=".pdf,.zip,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Comment (optional)
          </label>
          <textarea
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Any notes or comments..."
            className="w-full border border-gray-300 rounded p-2"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Assignment
        </button>
      </form>
    </div>
  );
};

export default SubmitAssignment;
