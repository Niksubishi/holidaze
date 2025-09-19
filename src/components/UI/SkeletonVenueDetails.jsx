import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const SkeletonVenueDetails = () => {
  const { isDarkMode } = useTheme();

  const skeletonColor = isDarkMode ? '#4a5568' : '#e2e8f0';
  const cardBg = isDarkMode ? '#3a3a3a' : '#ffffff';

  return (
    <div className="min-h-screen" style={{ backgroundColor: isDarkMode ? '#2A2A2A' : '#f9fafb' }}>
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div
          className="h-6 rounded w-20 animate-pulse"
          style={{ backgroundColor: skeletonColor }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="animate-pulse">
            
            <div className="mb-6">
              <div
                className="aspect-video w-full rounded-lg mb-4"
                style={{ backgroundColor: skeletonColor }}
              />

              
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg"
                    style={{ backgroundColor: skeletonColor }}
                  />
                ))}
              </div>
            </div>

            
            <div className="mb-6 p-6 rounded-lg" style={{ backgroundColor: cardBg }}>
              
              <div className="mb-4">
                <div
                  className="h-8 rounded w-3/4 mb-2"
                  style={{ backgroundColor: skeletonColor }}
                />
                <div
                  className="h-4 rounded w-1/2"
                  style={{ backgroundColor: skeletonColor }}
                />
              </div>

              
              <div className="flex items-center justify-between mb-4">
                <div
                  className="h-4 rounded w-32"
                  style={{ backgroundColor: skeletonColor }}
                />
                <div
                  className="h-5 rounded w-24"
                  style={{ backgroundColor: skeletonColor }}
                />
              </div>

              <div
                className="h-4 rounded w-28 mb-6"
                style={{ backgroundColor: skeletonColor }}
              />

              
              <div className="mb-6">
                <div
                  className="h-5 rounded w-40 mb-3"
                  style={{ backgroundColor: skeletonColor }}
                />
                <div className="space-y-2">
                  <div
                    className="h-4 rounded w-full"
                    style={{ backgroundColor: skeletonColor }}
                  />
                  <div
                    className="h-4 rounded w-4/5"
                    style={{ backgroundColor: skeletonColor }}
                  />
                  <div
                    className="h-4 rounded w-3/4"
                    style={{ backgroundColor: skeletonColor }}
                  />
                </div>
              </div>

              
              <div className="mb-6">
                <div
                  className="h-5 rounded w-24 mb-3"
                  style={{ backgroundColor: skeletonColor }}
                />
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className="h-5 w-5 rounded"
                        style={{ backgroundColor: skeletonColor }}
                      />
                      <div
                        className="h-4 rounded w-20"
                        style={{ backgroundColor: skeletonColor }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              
              <div className="mb-6">
                <div
                  className="h-5 rounded w-20 mb-3"
                  style={{ backgroundColor: skeletonColor }}
                />
                <div
                  className="aspect-video w-full rounded-lg"
                  style={{ backgroundColor: skeletonColor }}
                />
              </div>
            </div>

            
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: cardBg }}>
              <div
                className="h-5 rounded w-24 mb-3"
                style={{ backgroundColor: skeletonColor }}
              />
              <div className="flex items-center space-x-3">
                <div
                  className="h-12 w-12 rounded-full"
                  style={{ backgroundColor: skeletonColor }}
                />
                <div>
                  <div
                    className="h-4 rounded w-24 mb-1"
                    style={{ backgroundColor: skeletonColor }}
                  />
                  <div
                    className="h-3 rounded w-32"
                    style={{ backgroundColor: skeletonColor }}
                  />
                </div>
              </div>
            </div>
          </div>

          
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="p-6 rounded-lg animate-pulse" style={{ backgroundColor: cardBg }}>
              
              <div
                className="h-6 rounded w-40 mb-4"
                style={{ backgroundColor: skeletonColor }}
              />

              
              <div className="mb-6">
                <div
                  className="h-8 rounded w-32"
                  style={{ backgroundColor: skeletonColor }}
                />
              </div>

              
              <div className="space-y-4 mb-6">
                <div>
                  <div
                    className="h-4 rounded w-16 mb-2"
                    style={{ backgroundColor: skeletonColor }}
                  />
                  <div
                    className="h-10 rounded w-full"
                    style={{ backgroundColor: skeletonColor }}
                  />
                </div>
                <div>
                  <div
                    className="h-4 rounded w-20 mb-2"
                    style={{ backgroundColor: skeletonColor }}
                  />
                  <div
                    className="h-10 rounded w-full"
                    style={{ backgroundColor: skeletonColor }}
                  />
                </div>
                <div>
                  <div
                    className="h-4 rounded w-14 mb-2"
                    style={{ backgroundColor: skeletonColor }}
                  />
                  <div
                    className="h-10 rounded w-full"
                    style={{ backgroundColor: skeletonColor }}
                  />
                </div>
              </div>

              
              <div
                className="h-12 rounded w-full"
                style={{ backgroundColor: skeletonColor }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonVenueDetails;