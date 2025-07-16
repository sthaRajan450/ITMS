import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const logoutUser = async () => {
  try {
    const response = await fetch("http://localhost:9000/api/v1/user/logout", {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      alert(data.message);
      window.location.reload(); // to refresh navbar state after logout
    }
  } catch (error) {
    console.log("Error while logging out user", error);
  }
};

const Navbar = () => {
  const commonLinks = [
    { path: "/", label: "Home" },
    { path: "/courses", label: "Courses" },
    { path: "/about", label: "About" },
    { path: "/blogs", label: "Blogs" },
    { path: "/jobs", label: "Jobs" },
    { path: "/contact", label: "Contact" },
    { path: "/cart", label: "Cart" },
  ];

  const studentLinks = [{ path: "/student", label: "Dashboard" }];

  const instructorLinks = [{ path: "/instructor", label: "Dashboard" }, ,];

  const adminLinks = [{ path: "/admin", label: "Admin Dashboard" }];

  const navigate = useNavigate();
  const { isAuth, user } = useContext(AuthContext);

  // dynamically pick role links
  const roleLinks =
    user?.role === "Student"
      ? studentLinks
      : user?.role === "Instructor"
        ? instructorLinks
        : user?.role === "Admin"
          ? adminLinks
          : [];

  return (
    <nav className="sticky top-0 z-50 bg-blue-600 shadow-lg">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Brand + Common Links */}
        <div className="flex items-center gap-x-12">
          <div
            className="text-3xl font-extrabold text-white tracking-wide cursor-pointer"
            onClick={() => navigate("/")}
          >
            📚 ITMS Nepal
          </div>

          <div className="space-x-6 flex items-center">
            {commonLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.path}
                className={({ isActive }) =>
                  `text-white text-lg font-inter transition duration-300 ease-in-out hover:text-green-300 ${
                    isActive ? "border-b-2 border-green-300 pb-1" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Render role links if logged in */}
            {isAuth &&
              roleLinks.map((link, index) => (
                <NavLink
                  key={index}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-white text-lg font-inter transition duration-300 ease-in-out hover:text-green-300 ${
                      isActive ? "border-b-2 border-green-300 pb-1" : ""
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
          </div>
        </div>

        {/* Auth Buttons */}
        {isAuth ? (
          <div className="flex gap-x-5 items-center">
            <button
              onClick={() => {
                logoutUser();
                navigate("/login");
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
            <NavLink to="/profile">
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full border-2 border-white hover:border-green-300 transition"
              />
            </NavLink>
          </div>
        ) : (
          <div className="flex gap-x-6 items-center">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `text-white text-lg font-medium transition duration-300 ease-in-out hover:text-green-300 ${
                  isActive ? "border-b-2 border-green-300 pb-1" : ""
                }`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `text-white text-lg font-medium transition duration-300 ease-in-out hover:text-green-300 ${
                  isActive ? "border-b-2 border-green-300 pb-1" : ""
                }`
              }
            >
              Register
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
