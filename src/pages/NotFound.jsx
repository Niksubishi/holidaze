import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const NotFound = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: theme.colors.background }}>
      <div className="text-center">
        <div className="mb-8">
          <h1 className="font-chivo text-6xl md:text-8xl mb-4" style={{ color: theme.colors.text }}>
            404
          </h1>
          <h2 className="font-chivo text-2xl md:text-3xl mb-4" style={{ color: theme.colors.text }}>
            Page Not Found
          </h2>
          <p className="font-lora text-lg mb-8 max-w-md" style={{ color: theme.colors.text }}>
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-x-4">
          <Link
            to="/venues"
            className="inline-block px-6 py-3 bg-primary text-white font-chivo rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Browse Venues
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-block px-6 py-3 border border-gray-600 text-gray-300 font-chivo rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
