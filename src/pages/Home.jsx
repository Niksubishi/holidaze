import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Home = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen px-4 pt-8" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-full max-w-2xl mx-auto">
            <img
              src="/images/landingpage1.jpg"
              alt="Holidaze Experience 1"
              className="w-full aspect-square object-cover"
            />
          </div>

          <div className="w-full max-w-2xl mx-auto">
            <img
              src="/images/landingpage2.jpg"
              alt="Holidaze Experience 2"
              className="w-full aspect-square object-cover"
            />
          </div>
        </div>

        <div className="text-center py-16">
          <Link
            to="/auth"
            className="inline-block font-poppins text-4xl hover:opacity-75 transition-colors cursor-pointer"
            style={{ color: theme.isDarkMode ? '#ffffff' : theme.colors.text }}
          >
            Get started now...
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
