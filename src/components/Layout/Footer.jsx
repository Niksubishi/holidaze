import React from "react";
import { useTheme } from "../../context/ThemeContext";

const Footer = () => {
  const { theme } = useTheme();
  
  return (
    <footer className="py-4 mt-auto" style={{ backgroundColor: theme.colors.secondary }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <p className="font-poppins text-white text-sm">
            Copyright Nik Bishop 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
