import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const AddCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [level, setLevel] = useState("");
  const [category, setCategory] = useState("");
  const [prerequisites, setPrerequisites] = useState("");
  const [enrollmentDeadline, setEnrollmentDeadline] = useState("");
  const [instructor, setInstructor] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thumbnail) {
      alert("Please select a course thumbnail image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    const syllabusArray = syllabus.split(",").map((item) => item.trim());
    formData.append("syllabus", JSON.stringify(syllabusArray));

    formData.append("duration", duration);
    formData.append("price", price);
    formData.append("level", level);
    formData.append("category", category);
    formData.append("prerequisites", prerequisites);
    formData.append("enrollmentDeadline", enrollmentDeadline);
    formData.append("thumbnail", thumbnail);
    formData.append("instructor", instructor);

    try {
      const response = await fetch(
        "http://localhost:9000/api/v1/course/admin/create",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        navigate("/admin/contentManagement");
      }
    } catch (error) {
      console.error("Error while adding course:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Add Course
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <textarea
            placeholder="Syllabus (comma separated topics)"
            value={syllabus}
            onChange={(e) => setSyllabus(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Duration (e.g. 12 weeks)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Instructor DB_id"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Level (Beginner/Intermediate/Advanced)"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Prerequisites"
            value={prerequisites}
            onChange={(e) => setPrerequisites(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="date"
            placeholder="Enrollment Deadline"
            value={enrollmentDeadline}
            onChange={(e) => setEnrollmentDeadline(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="w-full border rounded-lg p-2"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
