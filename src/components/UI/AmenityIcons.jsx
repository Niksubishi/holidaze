import React from "react";

const AmenityIcons = {
  WiFi: ({ size = 20, color = "#9ca3af" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 9C5.5 4.5 12.5 4.5 17 9M4 12C6.5 9.5 11.5 9.5 14 12M7 15C8 14 10 14 11 15M9.5 17.5C9.5 17.5 9.5 17.5 9.5 17.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
      />
      <circle cx="12" cy="18" r="1" fill={color} />
    </svg>
  ),

  Parking: ({ size = 20, color = "#9ca3af" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke={color}
        strokeWidth="2"
        fill={color}
        fillOpacity="0.1"
      />
      <path
        d="M8 7V17M8 7H12C13.1046 7 14 7.89543 14 9V11C14 12.1046 13.1046 13 12 13H8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  Breakfast: ({ size = 20, color = "#9ca3af" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 12H21M12 3L13.09 8.26L18 9L13.09 9.74L12 15L10.91 9.74L6 9L10.91 8.26L12 3Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 12V17C19 18.1046 18.1046 19 17 19H7C5.89543 19 5 18.1046 5 17V12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.1"
      />
    </svg>
  ),

  Pets: ({ size = 20, color = "#9ca3af" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main paw pad */}
      <ellipse 
        cx="12" 
        cy="15" 
        rx="4" 
        ry="3.5" 
        fill={color}
      />
      {/* Top left toe */}
      <ellipse 
        cx="8.5" 
        cy="9" 
        rx="1.8" 
        ry="2.5" 
        fill={color}
      />
      {/* Top center toe */}
      <ellipse 
        cx="12" 
        cy="7.5" 
        rx="1.8" 
        ry="2.8" 
        fill={color}
      />
      {/* Top right toe */}
      <ellipse 
        cx="15.5" 
        cy="9" 
        rx="1.8" 
        ry="2.5" 
        fill={color}
      />
      {/* Side toe */}
      <ellipse 
        cx="6.5" 
        cy="12" 
        rx="1.2" 
        ry="2" 
        fill={color}
      />
    </svg>
  )
};

export default AmenityIcons;