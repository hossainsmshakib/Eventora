import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/rootReducer";
import { logout } from "../redux/slices/userSlice";
import {
  FaHome,
  FaCalendarAlt,
  FaBookmark,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center text-xl font-bold text-blue-600"
          >
            <FaCalendarAlt className="mr-2" />
            Local Event Finder
          </Link>
          <div className="flex items-center space-x-4">
            <NavLink to="/" isActive={isActive("/")} icon={<FaHome />}>
              Home
            </NavLink>
            <NavLink
              to="/events"
              isActive={isActive("/events")}
              icon={<FaCalendarAlt />}
            >
              Events
            </NavLink>
            {currentUser ? (
              <>
                <NavLink
                  to="/bookmarks"
                  isActive={isActive("/bookmarks")}
                  icon={<FaBookmark />}
                >
                  Bookmarks
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 border border-blue-500 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 transition duration-150 ease-in-out"
                >
                  <FaSignOutAlt className="mr-1.5" />
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                isActive={isActive("/login")}
                icon={<FaSignInAlt />}
              >
                Logout
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  icon: React.ReactElement;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, isActive, icon, children }) => (
  <Link
    to={to}
    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? "text-blue-600 bg-blue-50"
        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
    } transition duration-150 ease-in-out`}
  >
    {React.cloneElement(icon, { className: "mr-1.5" })}
    {children}
  </Link>
);

export default Navbar;
