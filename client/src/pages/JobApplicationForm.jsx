import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../config/api";
import { toast } from "react-toastify";

const JobApplicationForm = () => {
  const location = useLocation();
  const jobId = location.state;

  const [letter, setLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      toast.warning("Please upload your resume.");
      return;
    }

    const formData = new FormData();
    formData.append("coverLetter", letter);
    formData.append("resume", resume);
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/job/apply/${jobId}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json(); // parse the JSON once

      if (!response.ok) {
        // backend sent an error status, show the message returned
        toast.error(data.message || "Failed to apply for job");
        return; // stop further execution
      }

      // if successful
      toast.success(data.message);
      setResume("");
      setLetter("");
      navigate("/jobs");
    } catch (error) {
      // network error or unexpected error
      toast.error("An unexpected error occurred");
      console.error("Error applying for job:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 bg-white rounded-lg shadow-md p-8">
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
          disabled={loading}
          type="submit"
          className="w-full py-3 bg-orange-600 text-white rounded-full hover:bg-orange-500 transition"
        >
          {loading ? "Submitting" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default JobApplicationForm;
