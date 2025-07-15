import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddJob = () => {
  const { jobId } = useParams();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:9000/api/v1/job/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          company,
          location,
          salary,
          description,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        navigate("/admin/contentManagement");
      } else {
        const err = await response.json();
        alert(err.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Failed to add job:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
        Add Job
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-600 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-gray-600 mb-1">
            Company
          </label>
          <input
            type="text"
            id="company"
            className="w-full border p-2 rounded"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-gray-600 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            className="w-full border p-2 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-600 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows="5"
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label htmlFor="salary" className="block text-gray-600 mb-1">
            Salary
          </label>
          <input
            type="text"
            id="salary"
            className="w-full border p-2 rounded"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Job
        </button>
      </form>
    </div>
  );
};

export default AddJob;
