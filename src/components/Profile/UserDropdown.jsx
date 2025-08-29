import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors"
        aria-label="User menu"
      >
        {user?.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt={user.avatar.alt || "User avatar"}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <img src="/images/user-icon.svg" alt="User" className="h-6 w-6" />
        )}
        <span className="font-poppins hidden sm:block">{user?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <Link
            to="/profile"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 font-poppins text-sm transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Profile Settings
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 font-poppins text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
