import React, { memo, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = memo(() => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  
  const buttonStyle = useMemo(() => ({
    backgroundColor: isDarkMode ? '#489DA6' : '#132F3D'
  }), [isDarkMode]);

  
  const toggleClasses = useMemo(() => 
    `w-4 h-4 rounded-full bg-white flex items-center justify-center transition-transform duration-300 ${
      isDarkMode ? 'transform translate-x-2' : 'transform -translate-x-2'
    }`, [isDarkMode]
  );

  
  const moonIcon = useMemo(() => (
    <svg 
      width="10" 
      height="10" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="#132F3D" 
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ), []);

  const sunIcon = useMemo(() => (
    <svg 
      width="10" 
      height="10" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="#132F3D" 
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ), []);

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center justify-center w-10 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      style={buttonStyle}
      aria-label="Toggle dark mode"
    >
      <div className={toggleClasses}>
        {isDarkMode ? moonIcon : sunIcon}
      </div>
    </button>
  );
});


ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;