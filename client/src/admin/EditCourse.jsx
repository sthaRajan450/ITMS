import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const EditCourse = () => {
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
  const { courseId } = useParams();
  const navigate = useNavigate();

  const getCourse = async () => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/course/${courseId}`
      );
      if (response.ok) {
        const data = await response.json();

        const c = data.data;

        // Populate form states
        setTitle(c.title);
        setDescription(c.description);
        setSyllabus(c.syllabus.join(", "));
        setDuration(c.duration);
        setPrice(c.price);
        setLevel(c.level);
        setCategory(c.category);
        setInstructor(c.instructor._id);
        setPrerequisites(c.prerequisites);
        setEnrollmentDeadline(c.enrollmentDeadline?.split("T")[0]);
      }
    } catch (error) {
      console.log("Failed to fetch course:", error);
    }
  };

  useEffect(() => {
    getCourse();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    formData.append("instructor", instructor);

    // only attach thumbnail if user selected a new one
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/course/update/${courseId}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(data.message);

        if (user.role == "Admin") {
          navigate("/admin/contentManagement");
        }
        if (user.role == "Instructor") navigate("/instructor/courseManagement");
        {
        }
      }
    } catch (error) {
      console.error("Error while updating course:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Update Course
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
            placeholder="Level"
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
            Update Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
