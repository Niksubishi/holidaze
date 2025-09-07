import React from "react";
import { ErrorTypes } from "../../api/config.js";

const ErrorMessage = ({ message, errorType, className = "", onAction = null, actionText = "" }) => {
  if (!message) return null;

  // Get styling based on error type
  const getErrorStyles = (type) => {
    switch (type) {
      case ErrorTypes.NETWORK:
        return {
          bg: "bg-orange-900",
          border: "border-orange-600", 
          text: "text-orange-100",
          icon: "wifi-off"
        };
      case ErrorTypes.AUTHENTICATION:
        return {
          bg: "bg-yellow-900",
          border: "border-yellow-600",
          text: "text-yellow-100", 
          icon: "lock"
        };
      case ErrorTypes.AUTHORIZATION:
        return {
          bg: "bg-purple-900",
          border: "border-purple-600",
          text: "text-purple-100",
          icon: "shield"
        };
      case ErrorTypes.VALIDATION:
        return {
          bg: "bg-blue-900",
          border: "border-blue-600",
          text: "text-blue-100",
          icon: "warning"
        };
      case ErrorTypes.RATE_LIMIT:
        return {
          bg: "bg-indigo-900", 
          border: "border-indigo-600",
          text: "text-indigo-100",
          icon: "clock"
        };
      case ErrorTypes.SERVER:
        return {
          bg: "bg-gray-900",
          border: "border-gray-600",
          text: "text-gray-100", 
          icon: "server"
        };
      case ErrorTypes.NOT_FOUND:
        return {
          bg: "bg-slate-900",
          border: "border-slate-600",
          text: "text-slate-100",
          icon: "search"
        };
      default:
        return {
          bg: "bg-red-900",
          border: "border-red-600", 
          text: "text-red-100",
          icon: "error"
        };
    }
  };

  const getErrorIcon = (iconType) => {
    const iconProps = {
      className: "h-4 w-4 mr-2 flex-shrink-0",
      fill: "currentColor",
      viewBox: "0 0 20 20"
    };

    switch (iconType) {
      case "wifi-off":
        return (
          <svg {...iconProps}>
            <path fillRule="evenodd" d="M13.22 3.22a.75.75 0 011.06 1.06L6.54 12.22A6.013 6.013 0 004.41 9.28a.75.75 0 01.33-1.01.75.75 0 011.01.33 4.5 4.5 0 011.62 2.2l6.85-6.85zM8.41 2.22C10.26 1.45 12.37 1.45 14.22 2.22a.75.75 0 01-.44 1.44c-1.45-.61-3.11-.61-4.56 0a.75.75 0 01-.44-1.44z" clipRule="evenodd" />
          </svg>
        );
      case "lock":
        return (
          <svg {...iconProps}>
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zM8.5 5.5A1.5 1.5 0 0110 4a1.5 1.5 0 011.5 1.5V9h-3V5.5z" clipRule="evenodd" />
          </svg>
        );
      case "shield":
        return (
          <svg {...iconProps}>
            <path fillRule="evenodd" d="M9.661 2.237a.531.531 0 01.678 0 11.947 11.947 0 007.078 2.749.5.5 0 01.479.425c.069.52.104 1.05.104 1.589 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 01-.332 0C5.26 16.563 2 12.162 2 7c0-.539.035-1.07.104-1.589a.5.5 0 01.48-.425 11.947 11.947 0 007.077-2.749z" clipRule="evenodd" />
          </svg>
        );
      case "warning":
        return (
          <svg {...iconProps}>
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
      case "clock":
        return (
          <svg {...iconProps}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
          </svg>
        );
      case "server":
        return (
          <svg {...iconProps}>
            <path d="M4.08 5.227A3 3 0 016.979 3h6.042a3 3 0 012.899 2.227l1.541 6.164a3 3 0 01-2.899 3.773H5.438a3 3 0 01-2.899-3.773L4.08 5.227zM6 10a1 1 0 100-2 1 1 0 000 2zm8-1a1 1 0 11-2 0 1 1 0 012 0zm-3 3a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
        );
      case "search":
        return (
          <svg {...iconProps}>
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg {...iconProps}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const styles = getErrorStyles(errorType);

  return (
    <div
      className={`${styles.bg} border ${styles.border} ${styles.text} px-4 py-3 rounded-lg ${className}`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {getErrorIcon(styles.icon)}
          <span className="font-poppins text-sm">{message}</span>
        </div>
        {onAction && actionText && (
          <button
            onClick={onAction}
            className="ml-4 px-3 py-1 text-xs font-poppins rounded bg-opacity-20 bg-white hover:bg-opacity-30 transition-colors"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
