import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { BASE_URL } from "../config/api";
import Hero from "./Hero";
import Testimonials from "./Testimonials";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = async () => {
    try {
      const response = await fetch(`${BASE_URL}/course/getAllCourses`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data.data);
        setAllCourses(data.data);
      }
    } catch (error) {
      console.log("Failed to fetch courses:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔁 Auto-reset if all fields are empty
    if (!category && !level && !keyword) {
      setCourses(allCourses);
      return;
    }

    const filteredCourses = allCourses.filter((course) => {
      return (
        (!category ||
          course.category.toLowerCase() === category.toLowerCase()) &&
        (!level || course.level.toLowerCase() === level.toLowerCase()) &&
        (!keyword ||
          course.title.toLowerCase().includes(keyword.toLowerCase()) ||
          course.description?.toLowerCase().includes(keyword.toLowerCase()))
      );
    });

    setCourses(filteredCourses);
  };

  // ✅ Optional: auto-reset when filters are all cleared
  useEffect(() => {
    if (!category && !level && !keyword) {
      setCourses(allCourses);
    }
  }, [category, level, keyword, allCourses]);

  return (
    <div className="bg-gray-50 font-inter">
      {/* Hero Section */}
      <Hero />

      {/* Why Learn Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-5xl font-semibold text-gray-700 text-center mb-14">
          Why Learn With Us?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "🔥 IT Training",
              desc: "Hands-on courses covering full-stack web, cloud, data science, and more.",
            },
            {
              title: "🎓 Certification Prep",
              desc: "Official prep for Microsoft, Cisco, AWS, CompTIA and global exams.",
            },
            {
              title: "🏢 Corporate Workshops",
              desc: "Upskill tech teams with custom, instructor-led professional workshops.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-xl text-center hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-purple-100/50 text-black py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center px-6">
          {[
            { value: "5,000+", label: "Students Trained" },
            { value: "1,500+", label: "Job Placements" },
            { value: "20+", label: "Corporate Partners" },
          ].map((stat, idx) => (
            <div key={idx}>
              <h3 className="text-5xl font-semibold mb-2 drop-shadow">
                {stat.value}
              </h3>
              <p className="text-lg opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Course Search Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-semibold text-gray-800 text-center mb-10">
          🔍 Find Your Perfect Course
        </h2>
        <form
          className="flex flex-col md:flex-row gap-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by keyword (e.g. React, Python)"
            className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-lg"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 md:w-52 px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-lg"
          >
            <option value="">Category</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Data Science">Data Science</option>
          </select>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="flex-1 md:w-52 px-5 py-3 border border-gray-300  rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-lg"
          >
            <option value="">Skill Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <button
            type="submit"
            className="bg-gradient-to-r from-red-400  to-orange-400 text-[18px]  cursor-pointer text-white px-8 py-3 rounded-xl hover:opacity-90 transition"
          >
            🔎 Search
          </button>
        </form>

        {/* Course Display */}
        <div className="mt-12">
          {courses.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div
                  key={course._id}
                  onClick={() =>
                    navigate(`/courseDetail`, {
                      state: { courseId: course._id },
                    })
                  }
                  className="bg-white rounded-xl shadow-md cursor-pointer hover:shadow-xl  hover:scale-105 duration-300  transition-transform "
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-700">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mt-2">💰 NPR {course.price}</p>
                    <p className="text-gray-600">⏱ {course.duration}</p>
                    <p className="text-sm mt-1 text-gray-500">{course.level}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 text-center text-gray-600 text-lg">
              No courses found matching your criteria.
            </div>
          )}
        </div>
      </section>

      <Testimonials />
    </div>
  );
};

export default Home;
