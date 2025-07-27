import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const getUsers = async () => {
    setLoading(true);
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
      setError("Failed to fetch user");
    } finally {
      setLoading(false);
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
        toast.success(data.message);
        getUsers();
      }
    } catch (error) {
      console.log("Failed to delete user:", error);
    }
  };
  const handleAssignCertificate = (userId) => {
    navigate("/admin/assign-certificate", { state: { studentId: userId } });
  };

  useEffect(() => {
    getUsers();
  }, []);
  const filteredUsers = users.filter((user) =>
    `${user.fullName} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <h1 className="text-4xl font-bold text-center text-gray-700 mb-10">
        👥 User Management
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="🔍 Search by name, email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={() => navigate("/addUser")}
          className="px-5 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-500 transition"
        >
          Add User
        </button>
      </div>

      {loading ? (
        <p className="text-center text-orange-600">Loading users...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Full Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{user.fullName}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4 capitalize">{user.role}</td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/updateUser`, { state: user._id })
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => handleAssignCertificate(user._id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded"
                    >
                      Assign Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-600">No users found.</div>
      )}
    </div>
  );
};

export default UserManagement;
