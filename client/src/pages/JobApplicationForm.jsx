import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const JobApplicationForm = () => {
  const { jobId } = useParams();
  const [letter, setLetter] = useState("");
  const [resume, setResume] = useState(null);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      alert("Please upload your resume.");
      return;
    }

    const formData = new FormData();
    formData.append("coverLetter", letter);
    formData.append("resume", resume);

    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/job/apply/${jobId}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setResume("");
        setLetter("");
        navigate("/jobs");
        navi;
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.log("Error applying for job:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Apply for this Job
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="coverLetter" className="block font-medium mb-1">
            Cover Letter
          </label>
          <textarea
            id="coverLetter"
            rows="5"
            className="w-full border border-gray-300 rounded-lg p-3"
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label htmlFor="resume" className="block font-medium mb-1">
            Upload your Resume (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            id="resume"
            onChange={(e) => setResume(e.target.files[0])}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default JobApplicationForm;
