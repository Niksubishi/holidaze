import React from "react";

const SuccessMessage = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <div
      className={`bg-green-900 border border-green-600 text-green-100 px-4 py-3 rounded-lg ${className}`}
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
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-poppins text-sm">{message}</span>
      </div>
    </div>
  );
};

export default SuccessMessage;
