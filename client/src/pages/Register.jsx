import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { BASE_URL } from "../config/api";
import { toast } from "react-toastify";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuth, setUser } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !phone || !avatar) {
      toast.warning("All fields are required");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone", phone);
    formData.append("avatar", avatar);

    try {
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Registration failed");
        return;
      }

      const data = await response.json();
      toast.success(data.message);
      setFullName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setAvatar(null);
      setIsAuth(true);
      setUser(data.data);
      navigate("/");
    } catch (error) {
      console.log("Error while registering:", error);
      toast.error("Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-gray-700 font-medium mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-gray-700 font-medium mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98XXXXXXXX"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="avatar"
              className="block text-gray-700 font-medium mb-1"
            >
              Upload Avatar
            </label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full  bg-gradient-to-r from-red-400 to-orange-400 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition duration-300"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
