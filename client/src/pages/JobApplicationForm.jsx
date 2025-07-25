import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";
import { toast } from "react-toastify";

const JobApplicationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const jobId = location.state?.jobId || location.state || null;

  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetterPreview, setCoverLetterPreview] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  // Generate preview URLs when files change
  useEffect(() => {
    if (!coverLetterFile) {
      setCoverLetterPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(coverLetterFile);
    setCoverLetterPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [coverLetterFile]);

  useEffect(() => {
    if (!resumeFile) {
      setResumePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(resumeFile);
    setResumePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [resumeFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coverLetterFile) {
      toast.warning("Please upload your cover letter image (JPG/PNG).");
      return;
    }
    if (!resumeFile) {
      toast.warning("Please upload your resume image (JPG/PNG).");
      return;
    }

    if (!allowedTypes.includes(coverLetterFile.type)) {
      toast.warning("Cover letter must be JPG or PNG image.");
      return;
    }
    if (!allowedTypes.includes(resumeFile.type)) {
      toast.warning("Resume must be JPG or PNG image.");
      return;
    }

    const formData = new FormData();
    formData.append("coverLetter", coverLetterFile);
    formData.append("resume", resumeFile);

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/job/apply/${jobId}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to apply for job");
        return;
      }

      toast.success(data.message);
      setCoverLetterFile(null);
      setResumeFile(null);
      navigate("/jobs");
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error applying for job:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Apply for this Job</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="coverLetter" className="block font-medium mb-1">
            Upload Cover Letter (JPG, PNG)
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            id="coverLetter"
            onChange={(e) => setCoverLetterFile(e.target.files[0])}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {coverLetterPreview && (
            <img
              src={coverLetterPreview}
              alt="Cover Letter Preview"
              className="mt-2 max-h-40 object-contain border rounded"
            />
          )}
        </div>

        <div>
          <label htmlFor="resume" className="block font-medium mb-1">
            Upload Resume (JPG, PNG)
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            id="resume"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {resumePreview && (
            <img
              src={resumePreview}
              alt="Resume Preview"
              className="mt-2 max-h-40 object-contain border rounded"
            />
          )}
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full py-3 bg-orange-600 text-white rounded-full hover:bg-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default JobApplicationForm;
