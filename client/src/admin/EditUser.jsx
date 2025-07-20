import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../config/api";

const EditUser = () => {
  const { userId } = useParams();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/${userId}`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setFullName(data.data.fullName);
        setEmail(data.data.email);
        setPhone(data.data.phone);
        setRole(data.data.role);
      }
    } catch (error) {
      console.log("Failed to fetch user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("role", role);
    formData.append("phone", phone);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await fetch(`${BASE_URL}/user/update/${userId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        navigate("/admin/userManagement");
      }
    } catch (error) {
      console.log("Failed to update user:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 m-10 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-8">
        ✏️ Update User
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>
        </div>

        {/* Phone and Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            >
              <option value="">-- Select Role --</option>
              <option value="Admin">Admin</option>
              <option value="Instructor">Instructor</option>
              <option value="Student">Student</option>
            </select>
          </div>
        </div>

        {/* Avatar Upload */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-500 transition text-lg"
        >
          Update User
        </button>
      </form>
    </div>
  );
};

export default EditUser;
