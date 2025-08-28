import React from "react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center justify-center w-10 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      style={{ backgroundColor: isDarkMode ? '#489DA6' : '#132F3D' }}
      aria-label="Toggle dark mode"
    >
      <div
        className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
          isDarkMode ? 'transform translate-x-2' : 'transform -translate-x-2'
        }`}
      />
    </button>
  );
};

export default ThemeToggle;