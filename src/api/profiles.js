import { makeRequest, apiConfig } from "./config.js";
import { tokenManager } from "./auth.js";

export const profilesAPI = {
  getById: async (name) => {
    // Public profiles don't require authentication, but we'll include token if available
    const token = tokenManager.get();
    return makeRequest(
      `${apiConfig.endpoints.holidaze.profiles}/${name}?_venues=true`,
      {
        token, // Include token if user is logged in, but don't require it
      }
    );
  },

  update: async (name, profileData) => {
    const token = tokenManager.get();
    return makeRequest(`${apiConfig.endpoints.holidaze.profiles}/${name}`, {
      method: "PUT",
      token,
      body: JSON.stringify(profileData),
    });
  },

  search: async (query) => {
    const token = tokenManager.get();
    return makeRequest(
      `${apiConfig.endpoints.holidaze.profiles}/search?q=${encodeURIComponent(
        query
      )}`,
      {
        token,
      }
    );
  },
};
