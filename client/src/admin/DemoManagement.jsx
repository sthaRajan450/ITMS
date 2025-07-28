import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";

const DemoManagement = () => {
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getDemos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/demo/all`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.data);
        setDemos(data.data);
      }
    } catch (error) {
      console.log("Error while fetching demos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDemos();
  }, []);

  const filteredDemos = demos.filter((demo) => {
    const course = demo.courseId?.title?.toLowerCase() || "";
    const name = demo.userId?.fullName?.toLowerCase() || "";
    const email = demo.userId?.email?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();

    return course.includes(term) || name.includes(term) || email.includes(term);
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Demo Management</h1>
      <input
        type="text"
        placeholder=" 🔍 Search by course, name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-4 py-2 border border-gray-300 rounded-full w-full max-w-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      {loading ? (
        <p>Loading demos...</p>
      ) : filteredDemos.length === 0 ? (
        <p>No demos found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border border-gray-300">#</th>
                <th className="px-4 py-2 border border-gray-300">Course</th>
                <th className="px-4 py-2 border border-gray-300">User Name</th>
                <th className="px-4 py-2 border border-gray-300">Email</th>
                <th className="px-4 py-2 border border-gray-300">Date</th>
                <th className="px-4 py-2 border border-gray-300">Time Slot</th>
              </tr>
            </thead>
            <tbody>
              {filteredDemos.map((demo, index) => (
                <tr key={demo._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-300">{index + 1}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    {demo.courseId?.title || "N/A"}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {demo.userId?.fullName || "N/A"}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {demo.userId?.email || "N/A"}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">{demo.date}</td>
                  <td className="px-4 py-2 border border-gray-300">{demo.timeSlot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DemoManagement;
