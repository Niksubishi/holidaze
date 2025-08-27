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

export const makeRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...getAuthHeaders(options.token),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.errors?.[0]?.message || data.message || "Something went wrong"
      );
    }

    return data;
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
};
