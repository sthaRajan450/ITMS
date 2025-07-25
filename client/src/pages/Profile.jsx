import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";

const Profile = () => {
  const { user: authUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpdatedUser = async () => {
      try {
        const response = await fetch(`${BASE_URL}/user/${authUser._id}`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
        } else {
          console.error("Failed to fetch updated user");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    if (authUser) {
      fetchUpdatedUser();
    }
  }, [authUser]);

  if (!user) {
    return <div className="text-center py-20 text-lg">Loading Profile...</div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg my-20 font-inter text-center">
      <img
        src={user.avatar}
        alt="Avatar"
        className="w-60 h-60 rounded-full mx-auto mb-6 
          border-l-4 border-t-4 border-r-4 border-b-4
          border-l-red-500 border-t-red-500 
          border-r-orange-500 border-b-orange-500"
      />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.fullName}</h1>
      <p className="text-gray-600 text-lg mb-1">📧 {user.email}</p>
      <p className="text-gray-600 text-lg mb-1">📱 {user.phone}</p>
      <p className="text-gray-600 text-lg mb-4">👤 {user.role}</p>
      <button
        onClick={() => navigate("/editProfile", { state: user._id })}
        className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default Profile;
