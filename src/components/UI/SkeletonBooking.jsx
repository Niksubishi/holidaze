import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const SkeletonBooking = ({ compact = false }) => {
  const { isDarkMode } = useTheme();

  const skeletonColor = isDarkMode ? '#4a5568' : '#e2e8f0';
  const cardBg = isDarkMode ? '#3a3a3a' : '#ffffff';

  if (compact) {
    // Compact skeleton for past bookings
    return (
      <div 
        className="rounded-lg p-4 animate-pulse"
        style={{ backgroundColor: cardBg }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Venue name skeleton */}
          <div>
            <div 
              className="h-4 rounded w-32 mb-1"
              style={{ backgroundColor: skeletonColor }}
            />
            <div 
              className="h-3 rounded w-24"
              style={{ backgroundColor: skeletonColor }}
            />
          </div>
          
          {/* Dates skeleton */}
          <div>
            <div 
              className="h-4 rounded w-20 mb-1"
              style={{ backgroundColor: skeletonColor }}
            />
            <div 
              className="h-3 rounded w-16"
              style={{ backgroundColor: skeletonColor }}
            />
          </div>
          
          {/* Duration & guests skeleton */}
          <div>
            <div 
              className="h-4 rounded w-16 mb-1"
              style={{ backgroundColor: skeletonColor }}
            />
            <div 
              className="h-3 rounded w-12"
              style={{ backgroundColor: skeletonColor }}
            />
          </div>
          
          {/* Price skeleton */}
          <div className="text-right">
            <div 
              className="h-4 rounded w-16 mb-1 ml-auto"
              style={{ backgroundColor: skeletonColor }}
            />
            <div 
              className="h-3 rounded w-12 ml-auto"
              style={{ backgroundColor: skeletonColor }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Full skeleton for current bookings
  return (
    <div 
      className="rounded-lg p-6 animate-pulse"
      style={{ backgroundColor: cardBg }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image skeleton */}
        <div className="lg:col-span-1">
          <div 
            className="aspect-video w-full rounded-lg"
            style={{ backgroundColor: skeletonColor }}
          />
        </div>

        {/* Content skeleton */}
        <div className="lg:col-span-2">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              {/* Title and price header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div 
                    className="h-6 rounded w-48 mb-2"
                    style={{ backgroundColor: skeletonColor }}
                  />
                  <div 
                    className="h-4 rounded w-32"
                    style={{ backgroundColor: skeletonColor }}
                  />
                </div>
                <div className="text-right">
                  <div 
                    className="h-5 rounded w-16 mb-1"
                    style={{ backgroundColor: skeletonColor }}
                  />
                  <div 
                    className="h-4 rounded w-20"
                    style={{ backgroundColor: skeletonColor }}
                  />
                </div>
              </div>

              {/* Details grid skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index}>
                    <div 
                      className="h-3 rounded w-16 mb-2"
                      style={{ backgroundColor: skeletonColor }}
                    />
                    <div 
                      className="h-4 rounded w-24"
                      style={{ backgroundColor: skeletonColor }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons skeleton */}
            <div className="flex justify-end space-x-3">
              <div 
                className="h-10 rounded w-24"
                style={{ backgroundColor: skeletonColor }}
              />
              <div 
                className="h-10 rounded w-28"
                style={{ backgroundColor: skeletonColor }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonBooking;