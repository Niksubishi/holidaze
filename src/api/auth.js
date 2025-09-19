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
    }
  },

  remove: () => {
    try {
      localStorage.removeItem("holidaze_token");
      localStorage.removeItem("holidaze_user");
    } catch (error) {
    }
  },
};

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
    }
  },

  remove: () => {
    try {
      localStorage.removeItem("holidaze_user");
    } catch (error) {
    }
  },
};
