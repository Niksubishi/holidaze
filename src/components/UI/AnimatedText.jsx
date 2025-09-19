import React, { useState, useEffect } from "react";

const AnimatedText = ({ texts, className, style, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIndex(currentIndex);
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, texts.length, interval]);

  return (
    <div
      className={`relative overflow-hidden h-8 ${className || ""}`}
      style={style}
    >
      
      {prevIndex !== null && (
        <div
          key={`prev-${prevIndex}`}
          className="absolute w-full text-center transition-all duration-700 ease-in-out transform opacity-0 -translate-y-full"
        >
          {texts[prevIndex]}
        </div>
      )}

      
      <div
        key={`curr-${currentIndex}`}
        className="absolute w-full text-center transition-all duration-700 ease-in-out transform opacity-100 translate-y-0"
        style={{ animation: "slideIn 0.7s ease-in-out" }}
      >
        {texts[currentIndex]}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0%);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedText;
