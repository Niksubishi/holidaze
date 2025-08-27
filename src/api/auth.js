import { makeRequest, apiConfig } from "./config.js";

export const authAPI = {
  register: async (userData) => {
    return makeRequest(apiConfig.endpoints.auth.register, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return makeRequest(apiConfig.endpoints.auth.login, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
};

// Token management
export const tokenManager = {
  get: () => {
    try {
      return localStorage.getItem("holidaze_token");
    } catch {
      return null;
    }
  },

  set: (token) => {
    try {
      localStorage.setItem("holidaze_token", token);
    } catch (error) {
      console.error("Failed to store token:", error);
    }
  },

  remove: () => {
    try {
      localStorage.removeItem("holidaze_token");
      localStorage.removeItem("holidaze_user");
    } catch (error) {
      console.error("Failed to remove token:", error);
    }
  },
};

// User data management
export const userManager = {
  get: () => {
    try {
      const userData = localStorage.getItem("holidaze_user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },

  set: (userData) => {
    try {
      localStorage.setItem("holidaze_user", JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to store user data:", error);
    }
  },

  remove: () => {
    try {
      localStorage.removeItem("holidaze_user");
    } catch (error) {
      console.error("Failed to remove user data:", error);
    }
  },
};
