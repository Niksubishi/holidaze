import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import UserDropdown from "../Profile/UserDropdown";
import ThemeToggle from "../UI/ThemeToggle";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isVenueManager } = useAuth();
  const { isDarkMode, theme } = useTheme();
  const location = useLocation();

  const isActivePage = (path) => location.pathname === path;

  const NavLink = ({ to, children, className = "" }) => (
    <Link
      to={to}
      className={`font-chivo hover:opacity-75 transition-colors relative ${className}`}
      style={{ color: theme.colors.navLinks }}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {children}
      {isActivePage(to) && (
        <div className="absolute -bottom-4 left-0 right-0 h-0.5" style={{ backgroundColor: theme.colors.navLinks }}></div>
      )}
    </Link>
  );

  const loggedOutLinks = (
    <>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/venues">Venues</NavLink>
    </>
  );

  const customerLinks = (
    <>
      <NavLink to="/venues">Venues</NavLink>
      <NavLink to="/my-bookings">My Bookings</NavLink>
    </>
  );

  const managerLinks = (
    <>
      <NavLink to="/my-venues">My Venues</NavLink>
      <NavLink to="/create-venue">Create Venue</NavLink>
      <NavLink to="/my-bookings">My Bookings</NavLink>
      <NavLink to="/venues">Venues</NavLink>
    </>
  );

  return (
    <nav className="h-16 flex items-center px-4 relative z-50" style={{ backgroundColor: theme.colors.headerBg }}>
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Logo and Navigation Links */}
        <div className="flex items-center space-x-8">
          <Link to={isAuthenticated ? "/venues" : "/"} className="cursor-pointer">
            <img
              src={isDarkMode ? "/images/logo2.jpg" : "/images/logo.jpg"}
              alt="Holidaze Logo"
              className="h-8 w-auto"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated && loggedOutLinks}
            {isAuthenticated && !isVenueManager && customerLinks}
            {isAuthenticated && isVenueManager && managerLinks}
          </div>
        </div>

        {/* User Icon / Auth */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <UserDropdown />
          ) : (
            <div className="hidden md:flex items-center">
              <Link
                to="/auth"
                className="font-chivo hover:opacity-75 transition-colors"
                style={{ color: theme.colors.navLinks }}
              >
                Sign Up / Login
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden ml-4 text-white hover:text-gray-200"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 shadow-lg md:hidden" style={{ backgroundColor: theme.colors.headerBg, borderTop: `1px solid ${theme.colors.headerBg}` }}>
          <div className="py-4 px-4 space-y-3">
            {!isAuthenticated && (
              <>
                <div className="py-2">
                  <NavLink to="/">Home</NavLink>
                </div>
                <div className="py-2">
                  <NavLink to="/venues">Venues</NavLink>
                </div>
                <div className="py-2 border-t border-gray-400 pt-4">
                  <NavLink to="/auth">Sign Up / Login</NavLink>
                </div>
              </>
            )}
            {isAuthenticated && !isVenueManager && (
              <>
                <div className="py-2">
                  <NavLink to="/venues">Venues</NavLink>
                </div>
                <div className="py-2">
                  <NavLink to="/my-bookings">My Bookings</NavLink>
                </div>
                <div className="py-2 border-t border-gray-400 pt-4">
                  <NavLink to="/profile">Profile</NavLink>
                </div>
              </>
            )}
            {isAuthenticated && isVenueManager && (
              <>
                <div className="py-2">
                  <NavLink to="/my-venues">My Venues</NavLink>
                </div>
                <div className="py-2">
                  <NavLink to="/create-venue">Create Venue</NavLink>
                </div>
                <div className="py-2">
                  <NavLink to="/my-bookings">My Bookings</NavLink>
                </div>
                <div className="py-2">
                  <NavLink to="/venues">Venues</NavLink>
                </div>
                <div className="py-2 border-t border-gray-400 pt-4">
                  <NavLink to="/profile">Profile</NavLink>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
