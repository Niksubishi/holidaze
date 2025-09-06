import React from "react";
import { useTheme } from "../../context/ThemeContext";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel" }) => {
  const { theme, isDarkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 transition-opacity"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative rounded-lg p-6 w-full max-w-md transition-all"
        style={{ 
          backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div className="text-center">
          <h3 
            className="font-poppins text-lg mb-3"
            style={{ color: theme.colors.text }}
          >
            {title}
          </h3>
          <p 
            className="font-poppins text-sm mb-6"
            style={{ color: theme.colors.text, opacity: 0.8 }}
          >
            {message}
          </p>
          
          <div className="flex space-x-3 justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 font-poppins text-sm rounded-lg transition-colors cursor-pointer"
              style={{
                backgroundColor: isDarkMode ? '#132F3D' : '#f3f4f6',
                color: isDarkMode ? '#9ca3af' : theme.colors.text
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 font-poppins text-sm text-white rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer"
              style={{ backgroundColor: '#dc2626' }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;