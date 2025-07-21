import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AssignmentList from "./AssignmentList";
import { BASE_URL } from "../config/api";

const Course = () => {
  const location = useLocation();
  const course = location.state;

  const [resources, setResources] = useState([]);

  useEffect(() => {
    const getResources = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/resource/course/${course._id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setResources(data.data || []);
        }
      } catch (error) {
        console.log("Failed to fetch resources", error);
      }
    };

    if (course?._id) {
      getResources();
    }
  }, [course]);

  if (!course)
    return <p className="text-center text-red-500">Course not found.</p>;

  const isYouTubeLink = (url) =>
    url?.includes("youtube.com") || url?.includes("youtu.be");

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;

    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);

    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Notes & Assignments Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📂 Resources</h2>
          <ul className="space-y-2 list-disc px-5 list-inside">
            {resources
              .filter((res) => res.type !== "file" && !isYouTubeLink(res.link))
              .map((res) => (
                <li key={res._id}>
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-600 transition-colors"
                  >
                    {res.title}
                  </a>
                </li>
              ))}
          </ul>

          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🧾 Assignments</h2>
            <AssignmentList courseId={course._id} />
          </div>
        </div>

        {/* Course Videos Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📺 Course Videos</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
            {resources
              .filter((res) => isYouTubeLink(res.link))
              .map((res) => {
                const embedLink = getYouTubeEmbedUrl(res.link);
                if (!embedLink) {
                  return (
                    <p key={res._id}>
                      <a href={res.link} target="_blank" rel="noopener noreferrer">
                        {res.title}
                      </a>
                    </p>
                  );
                }
                return (
                  <div key={res._id} className="w-full">
                    <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg border">
                      <iframe
                        src={embedLink}
                        title={res.title}
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <p className="mt-2 font-medium text-center">{res.title}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Downloadable Files Section */}
      {resources.some((res) => res.type === "file") && (
        <div className="mt-10 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📁 Downloadable Files</h2>
          <ul className="space-y-2 list-disc px-5 list-inside">
            {resources
              .filter((res) => res.type === "file")
              .map((res) => (
                <li key={res._id}>
                  <a
                    href={res.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors"
                  >
                    {res.title}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Course;
