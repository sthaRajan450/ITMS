import React from "react";
import { useLocation } from "react-router-dom";
import AssignmentList from "./AssignmentList";

const Course = () => {
  const location = useLocation();
  const course = location.state;

  const noteResources = [
    { label: "HTML", link: "https://www.w3schools.com/html/" },
    { label: "CSS", link: "https://www.w3schools.com/css/" },
    { label: "JavaScript", link: "https://www.w3schools.com/js/" },
    { label: "React", link: "https://www.w3schools.com/react/" },
    { label: "Node.js", link: "https://www.w3schools.com/nodejs/" },
    { label: "MongoDB", link: "https://www.w3schools.com/mongodb/" },
  ];

  const videoResources = [
    { label: "HTML", link: "https://www.youtube.com/embed/4dprtEzunIk" },
    { label: "CSS", link: "https://www.youtube.com/embed/K1naz9wBwKU" },
    { label: "JavaScript", link: "https://www.youtube.com/embed/sscX432bMZo" },
    { label: "React", link: "https://www.youtube.com/embed/vz1RlUyrc3w" },
    {
      label: "Node.js & MongoDB",
      link: "https://www.youtube.com/embed/7fjOw8ApZ1I",
    },
  ];

  if (!course)
    return <p className="text-center text-red-500">Course not found.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Notes & Assignments Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📝 Study Notes
          </h2>
          <ul className="space-y-2 list-disc px-5 list-inside">
            {noteResources.map((res, idx) => (
              <li key={idx}>
                <a
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" hover:text-orange-600 transition-colors"
                >
                  {res.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🧾 Assignments
            </h2>
            <AssignmentList courseId={course._id} />
          </div>
        </div>

        {/* Course Videos Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📺 Course Videos
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
            {videoResources.map((video, idx) => (
              <div key={idx} className="w-full">
                <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg border">
                  <iframe
                    src={video.link}
                    title={video.label}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="mt-2 font-medium text-center">{video.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
