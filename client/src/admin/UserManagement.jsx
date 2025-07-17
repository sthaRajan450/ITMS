import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
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
      console.log("Failed to fetch users:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/user/delete/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);

        getUsers();
      }
    } catch (error) {
      console.log("Failed to delete user:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        👥 User Management
      </h1>
      <div className="flex  my-10 justify-center">
        <button
          onClick={() => {
            navigate("/addUser");
          }}
          className="bg-blue-500 text-white text-2xl px-6 py-3 cursor-pointer  rounded-full hover:bg-blue-700 "
        >
          Add User
        </button>
      </div>
      {users.length > 0 ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {user.fullName}
              </h2>
              <p className="text-gray-600 mb-1">📧 {user.email}</p>
              <p className="text-gray-600 mb-1">📞 {user.phone}</p>
              <p className="text-gray-600 mb-3">🎓 Role: {user.role}</p>

              <div className="flex space-x-3">
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  onClick={() => {
                    navigate(`/updateUser/${user._id}`);
                  }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 text-lg">No users found.</div>
      )}
    </div>
  );
};

export default UserManagement;
