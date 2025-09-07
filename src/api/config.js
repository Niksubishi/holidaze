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

export const makeRequest = async (url, options = {}, retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
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
      const errorMessage = data?.errors?.[0]?.message || data?.message || "Something went wrong";
      throw new Error(errorMessage);
    }

      return data;
    } catch (error) {
      // If this is the last attempt, throw the error
      if (attempt === retries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s...
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
