import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Home = () => {
  const { theme, isDarkMode } = useTheme();
  const [isSecondImageVisible, setIsSecondImageVisible] = useState(false);
  const [isGetStartedVisible, setIsGetStartedVisible] = useState(false);
  const secondImageRef = useRef(null);
  const getStartedRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === secondImageRef.current) {
            setIsSecondImageVisible(entry.isIntersecting);
          }
          if (entry.target === getStartedRef.current) {
            setIsGetStartedVisible(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.1 }
    );

    const secondImageElement = secondImageRef.current;
    const getStartedElement = getStartedRef.current;

    if (secondImageElement) {
      observer.observe(secondImageElement);
    }
    if (getStartedElement) {
      observer.observe(getStartedElement);
    }

    return () => {
      if (secondImageElement) {
        observer.unobserve(secondImageElement);
      }
      if (getStartedElement) {
        observer.unobserve(getStartedElement);
      }
    };
  }, []);

  return (
    <div
      className="min-h-screen px-4 pt-8"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-full max-w-2xl mx-auto">
            <img
              src="/images/landingpage1.jpg"
              alt="Holidaze Experience 1"
              className="w-full aspect-square object-cover"
            />
          </div>

          <div
            ref={secondImageRef}
            className={`w-full max-w-2xl mx-auto transition-all duration-700 ease-out ${
              isSecondImageVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            <img
              src="/images/landingpage2.jpg"
              alt="Holidaze Experience 2"
              className="w-full aspect-square object-cover"
            />
          </div>
        </div>

        <div
          ref={getStartedRef}
          className={`text-center py-20 transition-all duration-700 ease-out ${
            isGetStartedVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          }`}
        >
          <Link
            to="/auth"
            className="inline-block font-poppins text-4xl hover:opacity-75 transition-colors cursor-pointer"
            style={{ color: isDarkMode ? "#ffffff" : theme.colors.text }}
          >
            Get started now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
