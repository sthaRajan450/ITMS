import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const links = [
  { path: "/admin/userManagement", label: "User Management" },

  { path: "/admin/courseManagement", label: "Course Management" },
  { path: "/admin/blogManagement", label: "Blog Management" },
  { path: "/admin/jobManagement", label: "Job Management" },
  { path: "/admin/applicationManagement", label: "Application Management" },
  { path: "/admin/financialManagement", label: "Financial Management" },
];

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-70 bg-white shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-600 mb-6">🎓 Dashboard</h2>
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
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

export default AdminDashboard;
