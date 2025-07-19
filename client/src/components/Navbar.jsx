import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { BASE_URL } from "../config/api";
import { Menu, X } from "lucide-react"; // You can use any icon library
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuth, user } = useContext(AuthContext);
  const navigate = useNavigate();

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
  const instructorLinks = [{ path: "/instructor", label: "Dashboard" }];
  const adminLinks = [{ path: "/admin", label: "Admin Dashboard" }];

  const roleLinks =
    user?.role === "Student"
      ? studentLinks
      : user?.role === "Instructor"
        ? instructorLinks
        : user?.role === "Admin"
          ? adminLinks
          : [];

  const logoutUser = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.log("Error while logging out user", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 shadow-lg bg-white">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo and Brand */}
        <div
          className="text-3xl font-extrabold  tracking-wide cursor-pointer"
          onClick={() => navigate("/")}
        >
          📚 ITMS Nepal
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Links (Desktop) */}
        <div className="hidden md:flex space-x-6 items-center">
          {[...commonLinks, ...(isAuth ? roleLinks : [])].map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              className={({ isActive }) =>
                `text-lg font-inter text-gray-600 transition-all duration-300 ease-in-out transform hover:text-black hover:scale-105 active:scale-95 ${
                  isActive ? "border-b-[3px] text-black border-orange-600" : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex gap-x-5 items-center">
          {isAuth ? (
            <>
              <button
                onClick={logoutUser}
                className="bg-red-600  p-3 px-7 text-center  rounded-full text-white cursor-pointer hover:opacity-80 transition"
              >
                Logout
              </button>
              <NavLink to="/profile">
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white hover:border-green-300 transition"
                />
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-lg font-medium transition bg-orange-500 text-white p-3 rounded-full w-30 text-center hover:bg-red-100 hover:text-orange-700
                 `
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  ` text-lg font-medium transition  bg-red-100 text-orange-700 p-3 rounded-full w-30 text-center hover:bg-orange-500 hover:text-white `
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 px-6 pb-4 space-y-2">
          {[...commonLinks, ...(isAuth ? roleLinks : [])].map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block  text-base py-1 font-medium transition hover:text-green-300 ${
                  isActive ? "border-b-2 border-green-300 pb-1" : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="mt-4 space-y-2">
            {isAuth ? (
              <>
                <button
                  onClick={logoutUser}
                  className="w-full text-left  bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
                <NavLink to="/profile" onClick={() => setIsOpen(false)}>
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full border-2 border-white hover:border-green-300 transition"
                  />
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block  text-base py-1 hover:text-green-300"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block  text-base py-1 hover:text-green-300"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
