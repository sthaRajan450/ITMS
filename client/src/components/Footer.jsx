import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className=" py-10 font-inter bg-blue-100   ">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        {/* Logo & Info */}
        <div>
          <h2 className="text-2xl font-extrabold mb-3 text-gray-700">📚 ITMS Nepal</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Modern IT Training Management System to connect students,
            instructors and corporates with world-class learning opportunities.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-gray-700">Quick Links</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <NavLink to="/" className="hover:text-white">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="hover:text-white">
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/courses" className="hover:text-white">
                Courses
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="hover:text-white">
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl text-gray-700 font-bold mb-3">Contact Us</h3>
          <p className="text-gray-600 text-sm">📧 info@itmsnepal.com</p>
          <p className="text-gray-600 text-sm">📱 +977 9800000000</p>
          <p className="text-gray-600 text-sm">📍 Putalisadak, Kathmandu</p>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-gray-700">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="text-white hover:text-blue-300 text-2xl">
              🌐
            </a>
            <a href="#" className="text-white hover:text-blue-300 text-2xl">
              📘
            </a>
            <a href="#" className="text-white hover:text-blue-300 text-2xl">
              📷
            </a>
          </div>
        </div>
      </div>

      <div className="border-t  mt-10 pt-6 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} ITMS Nepal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
