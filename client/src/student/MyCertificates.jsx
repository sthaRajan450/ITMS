import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";
import { toast } from "react-toastify";

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCertificates = async () => {
    try {
      const res = await fetch(`${BASE_URL}/certificate/my`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        console.log(data.data);
        setCertificates(data.data);
      } else {
        toast.error(data.message || "Failed to fetch certificates");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCertificates();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow mt-10 rounded-lg">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">
        🎓 My Certificates
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading certificates...</p>
      ) : certificates.length === 0 ? (
        <p className="text-center text-gray-500">No certificates found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Course</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Download</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert, index) => (
                <tr key={cert._id} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border">{cert.course?.title || "N/A"}</td>
                  <td className="p-2 border">{cert.title}</td>
                  <td className="p-2 border">{cert.description}</td>
                  <td className="p-2 border text-center">
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyCertificates;
