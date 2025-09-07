/**
 * Theme utility functions for consistent styling across the application
 * These functions centralize commonly repeated color patterns
 */

// Form inputs and text areas background
export const getInputBackground = (isDarkMode) => 
  isDarkMode ? '#4b5563' : '#ffffff';

// Card and container backgrounds (main content areas)
export const getCardBackground = (isDarkMode) => 
  isDarkMode ? '#3a3a3a' : '#f9fafb';

// Secondary/subtle background areas
export const getSecondaryBackground = (isDarkMode) => 
  isDarkMode ? '#4b5563' : '#f3f4f6';

// Main content cards (cleaner white/dark)
export const getMainCardBackground = (isDarkMode) => 
  isDarkMode ? '#3a3a3a' : '#ffffff';

// Input border colors (commonly paired with input backgrounds)
export const getInputBorderColor = (isDarkMode) => 
  isDarkMode ? '#6b7280' : '#d1d5db';

// Text colors for inputs
export const getInputTextColor = (isDarkMode) => 
  isDarkMode ? '#ffffff' : '#132F3D';