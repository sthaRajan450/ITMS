import React from "react";

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-20 px-6 font-inter">
      <div className="max-w-5xl mx-auto text-center mb-14">
        <h1 className="text-5xl font-semibold text-gray-600 mb-6">
          About Our IT Training Management System
        </h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          Welcome to our IT Training Management System a modern platform
          designed to help students, instructors, and organizations efficiently
          manage, deliver, and participate in technology-driven training
          programs.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 mb-20">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🎯 Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            To empower aspiring IT professionals by offering accessible,
            hands-on, and career-focused technical training programs, guided by
            experienced mentors and industry experts.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🚀 Our Vision
          </h2>
          <p className="text-gray-600 leading-relaxed">
            To be the most trusted and comprehensive IT learning platform in
            Nepal and beyond, bridging skill gaps and producing job-ready talent
            for the digital economy.
          </p>
        </div>
      </div>

      {/* Success Metrics */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center mb-20">
        <div className="bg-blue-500 text-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-4xl font-extrabold mb-2">5,000+</h3>
          <p className="text-lg">Students Trained</p>
        </div>
        <div className="bg-purple-500 text-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-4xl font-extrabold mb-2">1,500+</h3>
          <p className="text-lg">Job Placements</p>
        </div>
        <div className="bg-blue-500 text-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-4xl font-extrabold mb-2">20+</h3>
          <p className="text-lg">Corporate Partners</p>
        </div>
      </div>

      {/* Closing Note */}
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Whether you're looking to launch your career in software development,
          design, data science, or cloud computing our IT Training Management
          System is here to guide you, every step of the way.
        </p>
        <h4 className="text-xl font-semibold text-gray-700">
          Let’s Build Skills. Create Careers. Shape Futures.
        </h4>
      </div>
    </div>
  );
};

export default About;
