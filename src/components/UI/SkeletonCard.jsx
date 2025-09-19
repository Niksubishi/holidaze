import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const SkeletonCard = () => {
  const { isDarkMode } = useTheme();

  const skeletonColor = isDarkMode ? '#4a5568' : '#e2e8f0';
  const cardBg = isDarkMode ? '#3a3a3a' : '#ffffff';

  return (
    <div 
      className="rounded-lg overflow-hidden animate-pulse"
      style={{ backgroundColor: cardBg }}
    >
      
      <div 
        className="aspect-square w-full"
        style={{ backgroundColor: skeletonColor }}
      />
      
      
      <div className="p-4 space-y-3">
        
        <div 
          className="h-5 rounded w-3/4"
          style={{ backgroundColor: skeletonColor }}
        />
        
        
        <div 
          className="h-4 rounded w-1/2"
          style={{ backgroundColor: skeletonColor }}
        />
        
        
        <div className="flex justify-between items-center">
          <div 
            className="h-6 rounded w-20"
            style={{ backgroundColor: skeletonColor }}
          />
          <div 
            className="h-4 rounded w-12"
            style={{ backgroundColor: skeletonColor }}
          />
        </div>
        
        
        <div 
          className="h-3 rounded w-16"
          style={{ backgroundColor: skeletonColor }}
        />
        
        
        <div 
          className="h-3 rounded w-24"
          style={{ backgroundColor: skeletonColor }}
        />
        
        
        <div className="flex space-x-2">
          <div 
            className="h-3 rounded w-12"
            style={{ backgroundColor: skeletonColor }}
          />
          <div 
            className="h-3 rounded w-16"
            style={{ backgroundColor: skeletonColor }}
          />
          <div 
            className="h-3 rounded w-10"
            style={{ backgroundColor: skeletonColor }}
          />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;