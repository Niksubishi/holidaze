import React from "react";

const ErrorMessage = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <div
      className={`bg-red-900 border border-red-600 text-red-100 px-4 py-3 rounded-lg ${className}`}
      role="alert"
    >
      <div className="flex items-center">
        <svg
          className="h-4 w-4 mr-2 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-poppins text-sm">{message}</span>
      </div>
    </div>
  );
};

export default ErrorMessage;
