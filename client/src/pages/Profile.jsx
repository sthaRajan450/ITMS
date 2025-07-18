import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const Profile = () => {
  const { user } = useContext(AuthContext);
  console.log(user);

  if (!user) {
    return <div className="text-center py-20 text-lg">Loading Profile...</div>;
  }

  return (
    <div className="max-w-xl mx-auto  bg-white p-8 rounded-2xl shadow-lg my-20 font-inter text-center">
      <img
        src={user.avatar}
        alt="Avatar"
        className="w-60 h-60 rounded-full mx-auto mb-6 
  border-l-4 border-t-4 border-r-4 border-b-4
  border-l-purple-500 border-t-purple-500 
  border-r-blue-500 border-b-blue-500"
      />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.fullName}</h1>
      <p className="text-gray-600 text-lg mb-1">📧 {user.email}</p>
      <p className="text-gray-600 text-lg mb-1">📱 {user.phone}</p>
      <p className="text-gray-600 text-lg mb-4">👤 {user.role}</p>
      <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
        Edit Profile
      </button>
    </div>
  );
};

export default Profile;
