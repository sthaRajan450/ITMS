import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../config/api";
import { toast } from "react-toastify";

const CertificateManagement = () => {
  const location = useLocation();
  const { studentId } = location.state || {};

  const [courses, setCourses] = useState([]);
  const [certificateFile, setCertificateFile] = useState(null);
  const [formData, setFormData] = useState({
    studentId: studentId || "",
    courseId: "",
    title: "",
    description: "",
  });

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/course/getAllCourses`, {
        credentials: "include",
      });
      const data = await res.json();
      setCourses(data.data);
    } catch (err) {
      toast.error("Failed to load courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setCertificateFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!certificateFile) {
      toast.error("Please upload a certificate file.");
      return;
    }

    const form = new FormData();
    form.append("studentId", formData.studentId);
    form.append("courseId", formData.courseId);
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("certificate", certificateFile); // file input must match multer field name

    try {
      const res = await fetch(`${BASE_URL}/certificate/assign`, {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Certificate assigned successfully!");
      } else {
        toast.error(data.message || "Failed to assign certificate.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow mt-10 rounded-lg">
      <h2 className="text-3xl font-bold text-gray-700 mb-6">
        Assign Certificate
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Student ID (read-only) */}
        <div>
          <label className="block text-gray-600 mb-1">Student ID</label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            readOnly
            className="w-full p-2 border rounded bg-gray-100 text-gray-500"
          />
        </div>

        {/* Course selection */}
        <div>
          <label className="block text-gray-600 mb-1">Select Course</label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select a Course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-gray-600 mb-1">Certificate Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Course Completion Certificate"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-600 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Short description of the certificate"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Certificate File */}
        <div>
          <label className="block text-gray-600 mb-1">
            Upload Certificate File (PDF/Image)
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-500 transition"
        >
          Assign Certificate
        </button>
      </form>
    </div>
  );
};

export default CertificateManagement;
