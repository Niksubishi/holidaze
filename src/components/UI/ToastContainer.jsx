import React from 'react';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

const Toast = ({ toast, onClose }) => {
  const { theme, isDarkMode } = useTheme();

  const getToastStyles = (type) => {
    const baseStyles = {
      backgroundColor: isDarkMode ? '#374151' : '#ffffff',
      border: '1px solid',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    };

    const typeStyles = {
      success: {
        borderColor: '#10b981',
        color: '#10b981'
      },
      error: {
        borderColor: '#ef4444',
        color: '#ef4444'
      },
      warning: {
        borderColor: '#f59e0b',
        color: '#f59e0b'
      },
      info: {
        borderColor: theme.colors.primary,
        color: theme.colors.primary
      }
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIcon = (type) => {
    const iconProps = {
      className: "h-5 w-5",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      strokeWidth: 2
    };

    switch (type) {
      case 'success':
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="relative flex items-center p-4 mb-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
      style={getToastStyles(toast.type)}
    >
      <div className="flex items-center flex-1">
        <div className="flex-shrink-0 mr-3">
          {getIcon(toast.type)}
        </div>
        <p 
          className="font-poppins text-sm flex-1"
          style={{ color: theme.colors.text }}
        >
          {toast.message}
        </p>
      </div>
      
      <button
        onClick={() => onClose(toast.id)}
        className="ml-4 p-1 rounded-full hover:bg-gray-100 hover:bg-opacity-20 transition-colors"
        style={{ color: theme.colors.text, opacity: 0.7 }}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;