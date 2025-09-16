const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      register: "/auth/register",
      login: "/auth/login",
    },
    holidaze: {
      venues: "/holidaze/venues",
      bookings: "/holidaze/bookings",
      profiles: "/holidaze/profiles",
    },
  },
};

export const getAuthHeaders = (token = null) => {
  const headers = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Enhanced error types for better error handling
export const ErrorTypes = {
  NETWORK: "NETWORK",
  AUTHENTICATION: "AUTHENTICATION",
  AUTHORIZATION: "AUTHORIZATION",
  VALIDATION: "VALIDATION",
  RATE_LIMIT: "RATE_LIMIT",
  SERVER: "SERVER",
  NOT_FOUND: "NOT_FOUND",
  UNKNOWN: "UNKNOWN",
};

// Custom error class with additional context
export class APIError extends Error {
  constructor(message, type, status, originalError = null, context = {}) {
    super(message);
    this.name = "APIError";
    this.type = type;
    this.status = status;
    this.originalError = originalError;
    this.context = context;
  }
}

// Classify error based on response status and content
const classifyError = (response, data) => {
  // Network errors (no response)
  if (!response) {
    return {
      type: ErrorTypes.NETWORK,
      message:
        "Network connection failed. Please check your internet connection.",
    };
  }

  const { status } = response;

  switch (status) {
    case 400:
      // Check if it's validation errors
      if (data?.errors && Array.isArray(data.errors)) {
        return {
          type: ErrorTypes.VALIDATION,
          message: data.errors.map((err) => err.message).join(", "),
        };
      }
      return {
        type: ErrorTypes.VALIDATION,
        message: data?.message || "Invalid request. Please check your input.",
      };

    case 401:
      return {
        type: ErrorTypes.AUTHENTICATION,
        message: "Please sign in to continue.",
      };

    case 403:
      return {
        type: ErrorTypes.AUTHORIZATION,
        message: "You don't have permission to perform this action.",
      };

    case 404:
      return {
        type: ErrorTypes.NOT_FOUND,
        message: "The requested resource was not found.",
      };

    case 429:
      const retryAfter = response.headers.get("Retry-After");
      return {
        type: ErrorTypes.RATE_LIMIT,
        message: `Too many requests. Please try again${
          retryAfter ? ` in ${retryAfter} seconds` : " later"
        }.`,
      };

    case 500:
    case 502:
    case 503:
    case 504:
      return {
        type: ErrorTypes.SERVER,
        message:
          "Server is temporarily unavailable. Please try again in a few moments.",
      };

    default:
      return {
        type: ErrorTypes.UNKNOWN,
        message:
          data?.errors?.[0]?.message ||
          data?.message ||
          "Something went wrong. Please try again.",
      };
  }
};

// Determine if error should be retried
const shouldRetry = (error, attempt, maxRetries) => {
  if (attempt >= maxRetries) return false;

  // Don't retry client errors (4xx) except rate limiting
  if (
    error.status >= 400 &&
    error.status < 500 &&
    error.type !== ErrorTypes.RATE_LIMIT
  ) {
    return false;
  }

  // Retry network errors and server errors
  return [
    ErrorTypes.NETWORK,
    ErrorTypes.SERVER,
    ErrorTypes.RATE_LIMIT,
  ].includes(error.type);
};

// Enhanced retry delay calculation
const getRetryDelay = (attempt, errorType) => {
  const baseDelay = 1000; // 1 second base

  // Rate limiting - respect Retry-After if available, otherwise exponential backoff
  if (errorType === ErrorTypes.RATE_LIMIT) {
    return Math.min(baseDelay * Math.pow(2, attempt), 30000); // Max 30 seconds
  }

  // Network/server errors - exponential backoff with jitter
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 1000; // Add randomness to prevent thundering herd
  return Math.min(exponentialDelay + jitter, 10000); // Max 10 seconds
};

export const makeRequest = async (url, options = {}, customRetries = null) => {
  const maxRetries = customRetries !== null ? customRetries : 2;
  const context = { url, method: options.method || "GET" };

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          ...getAuthHeaders(options.token),
          ...options.headers,
        },
      });

      let data;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // For DELETE requests that return empty content (204 No Content)
        data = response.status === 204 ? {} : await response.text();
      }

      if (!response.ok) {
        const errorInfo = classifyError(response, data);
        const apiError = new APIError(
          errorInfo.message,
          errorInfo.type,
          response.status,
          null,
          context
        );

        if (!shouldRetry(apiError, attempt, maxRetries)) {
          throw apiError;
        }

        // If we should retry, continue to the retry logic
        throw apiError;
      }

      return data;
    } catch (error) {
      // Handle network errors (fetch failures)
      if (!error.type) {
        const networkError = new APIError(
          "Network connection failed. Please check your internet connection.",
          ErrorTypes.NETWORK,
          null,
          error,
          context
        );

        if (!shouldRetry(networkError, attempt, maxRetries)) {
          throw networkError;
        }
        error = networkError;
      }

      // If this is the last attempt, throw the error
      if (attempt === maxRetries || !shouldRetry(error, attempt, maxRetries)) {
        throw error;
      }

      // Wait before retrying
      const delay = getRetryDelay(attempt, error.type);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};
