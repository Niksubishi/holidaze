import { useState, useCallback } from 'react';
import { APIError, ErrorTypes } from '../api/config.js';
import { useAuth } from '../context/AuthContext';

export const useApiError = () => {
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState(null);
  const { logout } = useAuth();

  const handleApiError = useCallback((apiError) => {
    // Handle authentication errors by logging out
    if (apiError.type === ErrorTypes.AUTHENTICATION) {
      logout();
      setError('Your session has expired. Please sign in again.');
      setErrorType(ErrorTypes.AUTHENTICATION);
      return;
    }

    // Set user-friendly error message
    setError(apiError.message || 'Something went wrong. Please try again.');
    setErrorType(apiError.type);

    // Log detailed error info for debugging (only in development)
    if (import.meta.env.DEV) {
      console.group('🚨 API Error Details');
      console.error('Message:', apiError.message);
      console.error('Type:', apiError.type);
      console.error('Status:', apiError.status);
      console.error('Context:', apiError.context);
      if (apiError.originalError) {
        console.error('Original Error:', apiError.originalError);
      }
      console.groupEnd();
    }
  }, [logout]);

  const clearError = useCallback(() => {
    setError('');
    setErrorType(null);
  }, []);

  const isRetryableError = useCallback(() => {
    return [ErrorTypes.NETWORK, ErrorTypes.SERVER, ErrorTypes.RATE_LIMIT].includes(errorType);
  }, [errorType]);

  const getErrorActionText = useCallback(() => {
    switch (errorType) {
      case ErrorTypes.NETWORK:
        return 'Check Connection';
      case ErrorTypes.AUTHENTICATION:
        return 'Sign In';
      case ErrorTypes.AUTHORIZATION:
        return 'Go Back';
      case ErrorTypes.VALIDATION:
        return 'Fix Errors';
      case ErrorTypes.RATE_LIMIT:
        return 'Try Later';
      case ErrorTypes.SERVER:
        return 'Retry';
      case ErrorTypes.NOT_FOUND:
        return 'Go Home';
      default:
        return 'Retry';
    }
  }, [errorType]);

  return {
    error,
    errorType,
    handleApiError,
    clearError,
    isRetryableError,
    getErrorActionText,
  };
};