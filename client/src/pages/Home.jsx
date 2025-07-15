import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-50 font-inter">

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-700 to-purple-700 text-white py-28 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
          Transform Your IT Career
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join 5,000+ learners and master in-demand skills with top instructors.
        </p>
        <Link
          to="/courses"
          className="inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-full hover:bg-gray-100 shadow-lg transition duration-300"
        >
          📚 Browse Courses
        </Link>
      </div>

      {/* Highlight Features */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-14">🚀 Why Learn With Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "🔥 IT Training", desc: "Hands-on courses covering full-stack web, cloud, data science, and more." },
            { title: "🎓 Certification Prep", desc: "Official prep for Microsoft, Cisco, AWS, CompTIA and global exams." },
            { title: "🏢 Corporate Workshops", desc: "Upskill tech teams with custom, instructor-led professional workshops." },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-xl text-center hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
              <p className="text-gray-600 text-lg">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Success Metrics */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center px-6">
          {[
            { value: "5,000+", label: "Students Trained" },
            { value: "1,500+", label: "Job Placements" },
            { value: "20+", label: "Corporate Partners" },
          ].map((stat, idx) => (
            <div key={idx}>
              <h3 className="text-5xl font-extrabold mb-2 drop-shadow">{stat.value}</h3>
              <p className="text-lg font-medium opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">🔍 Find Your Perfect Course</h2>
        <form className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by keyword (e.g. React, Python)"
            className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-lg"
          />
          <select className="flex-1 md:w-52 px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-lg">
            <option value="">Category</option>
            <option value="programming">Programming</option>
            <option value="design">Design</option>
            <option value="data">Data Science</option>
          </select>
          <select className="flex-1 md:w-52 px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-lg">
            <option value="">Skill Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition"
          >
            🔎 Search
          </button>
        </form>
      </section>
    </div>
  );
};

export default Home;
