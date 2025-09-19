/**
 * Theme utility functions for consistent styling across the application
 * These functions centralize commonly repeated color patterns
 */


export const getInputBackground = (isDarkMode) => 
  isDarkMode ? '#4b5563' : '#ffffff';


export const getCardBackground = (isDarkMode) => 
  isDarkMode ? '#3a3a3a' : '#f9fafb';


export const getSecondaryBackground = (isDarkMode) => 
  isDarkMode ? '#4b5563' : '#f3f4f6';


export const getMainCardBackground = (isDarkMode) => 
  isDarkMode ? '#3a3a3a' : '#ffffff';


export const getInputBorderColor = (isDarkMode) => 
  isDarkMode ? '#6b7280' : '#d1d5db';


export const getInputTextColor = (isDarkMode) => 
  isDarkMode ? '#ffffff' : '#132F3D';