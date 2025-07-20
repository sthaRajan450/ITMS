import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { BASE_URL } from "../config/api";
import { toast } from "react-toastify";
const EditCourse = () => {
  const [users, setUsers] = useState([]);
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
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const { courseId } = useParams();
  const navigate = useNavigate();

  const getUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/all`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
      }
    } catch (error) {
      console.log("Failed to fetch users", error);
    }
  };

  const getCourse = async () => {
    try {
      const response = await fetch(`${BASE_URL}/course/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        const c = data.data;
        console.log(c);

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

  useEffect(() => {
    getUsers();
  }, []);

  const instructors = users.filter((u) => u.role === "Instructor");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append(
      "syllabus",
      JSON.stringify(syllabus.split(",").map((s) => s.trim()))
    );
    formData.append("duration", duration);
    formData.append("price", price);
    formData.append("level", level);
    formData.append("category", category);
    formData.append("prerequisites", prerequisites);
    formData.append("enrollmentDeadline", enrollmentDeadline);
    formData.append("instructor", instructor);
    setLoading(true);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const response = await fetch(`${BASE_URL}/course/update/${courseId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);

        navigate("/admin/courseManagement");
      }
    } catch (error) {
      console.error("Error while updating course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-[900px]">
        <h2 className="text-3xl font-bold text-center text-gray-600 mb-6">
          Update Course
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-4 gap-6">
            <input
              type="text"
              placeholder="Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
          </div>

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

          <div className="grid grid-cols-3 gap-6">
            <select
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Instructor</option>
              {instructors.map((inst) => (
                <option key={inst._id} value={inst._id}>
                  {inst.fullName}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />

            <input
              type="date"
              value={enrollmentDeadline}
              onChange={(e) => setEnrollmentDeadline(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="w-full border rounded-lg p-2"
          />
          <input
            type="text"
            placeholder="Prerequisites"
            value={prerequisites}
            onChange={(e) => setPrerequisites(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-500"
          >
            {loading ? "Updating course..." : "Update Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
