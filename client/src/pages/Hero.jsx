import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-purple-100/50">
      {/* Left side content */}
      <div className="w-full md:w-1/2 pl-18 py-16 md:py-32 flex flex-col justify-center items-center md:items-start text-center md:text-left">
        <div className="flex items-center gap-x-3 mb-6">
          <img
            src="/banner/check.svg"
            alt="Check icon"
            className="w-6 h-6 md:w-8 md:h-8"
          />
          <h1 className="text-green-500 font-bold text-sm md:text-base">
            Get 30% off on first enroll
          </h1>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl py-5 leading-tight text-gray-700 font-semibold mb-6 drop-shadow-lg">
          Transform Your
          <br /> IT Career with us
        </h1>

        <p className="text-base sm:text-xl md:text-2xl mb-10 max-w-xl text-black/70">
          Join 5,000+ learners and master in-demand skills with top instructors.
        </p>

        <Link
          to="/courses"
          className="inline-flex items-center bg-white rounded-full text-gray-900 px-6 py-4  shadow hover:shadow-lg transition w-max"
        >
          <span className="mr-3 text-gray-500 text-base md:text-lg">
            Browse Courses
          </span>
          <img
            src="/banner/search.svg"
            alt="Search icon"
            className="w-6 h-6 md:w-8 md:h-8 bg-blue-700 rounded-full p-1 md:p-2"
          />
        </Link>
      </div>

      {/* Right side image - hidden on small screens */}
      <div className="hidden md:flex w-1/2 items-center justify-center px-6 md:px-0 py-10 md:py-0">
        <motion.img
          src="/banner/mahila.png"
          alt="Woman learning illustration"
          className="w-full max-w-[680px]"
          animate={{ y: [0, -20, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};

export default Hero;
