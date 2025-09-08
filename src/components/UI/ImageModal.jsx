import React from "react";

const ImageModal = ({ isOpen, onClose, imageUrl, alt }) => {

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="relative max-w-full max-h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-white hover:bg-black hover:bg-opacity-50 transition-colors"
          aria-label="Close image"
        >
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-full object-contain rounded-lg"
          style={{ maxHeight: "90vh", maxWidth: "90vw" }}
        />
      </div>
    </div>
  );
};

export default ImageModal;