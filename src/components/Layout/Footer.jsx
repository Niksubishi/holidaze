import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const Footer = () => {
  const { theme, isDarkMode } = useTheme();

  return (
    <div className="mt-auto">
      <footer
        className="w-full py-12 px-8"
        style={{ backgroundColor: isDarkMode ? "#2d2d2d" : "#2d2d2d" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-6 md:mb-0">
            <p className="text-white text-sm font-poppins">
              © 2025 Holidaze, Inc.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/"
                className="text-white hover:text-gray-300 text-sm font-poppins transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/"
                className="text-white hover:text-gray-300 text-sm font-poppins transition-colors"
              >
                Sitemap
              </Link>
              <Link
                to="/"
                className="text-white hover:text-gray-300 text-sm font-poppins transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/"
                className="text-white hover:text-gray-300 text-sm font-poppins transition-colors"
              >
                Your Privacy Choices
              </Link>
            </div>
          </div>

          <div className="flex space-x-6 mb-6 md:mb-0">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400 transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="X (Twitter)"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-400 transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 4.267c.549 0 .993.445.993.993 0 .549-.444.993-.993.993-.548 0-.993-.444-.993-.993 0-.548.445-.993.993-.993zm7.102 0c.549 0 .993.445.993.993 0 .549-.444.993-.993.993-.548 0-.993-.444-.993-.993 0-.548.445-.993.993-.993zM12.017 5.838c1.705 0 3.149 1.388 3.149 3.093s-1.444 3.093-3.149 3.093c-1.705 0-3.149-1.388-3.149-3.093s1.444-3.093 3.149-3.093z" />
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>

          <div className="flex-shrink-0">
            <img
              src="/images/logo3.jpg"
              alt="Holidaze Logo"
              className="h-12 w-auto object-contain"
            />
          </div>
        </div>
      </footer>

      <footer
        className="py-4"
        style={{ backgroundColor: theme.colors.secondary }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="font-poppins text-white text-sm">© Nik Bishop 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
