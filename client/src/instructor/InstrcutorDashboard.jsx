import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const links = [
  { path: "/instructor/courseManagement", label: "Course Management" },
  { path: "/instructor/studentManagement", label: "Student Management" },
];

const InstrcutorDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-70 bg-white shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">🎓 Dashboard</h2>
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-800 hover:bg-gray-200"
              } transition`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default InstrcutorDashboard;
