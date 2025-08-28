import { makeRequest, apiConfig } from "./config.js";
import { tokenManager } from "./auth.js";

export const bookingsAPI = {
  getAll: async () => {
    const token = tokenManager.get();
    return makeRequest(
      `${apiConfig.endpoints.holidaze.bookings}?_venue=true&_customer=true`,
      {
        token,
      }
    );
  },

  getById: async (id) => {
    const token = tokenManager.get();
    return makeRequest(
      `${apiConfig.endpoints.holidaze.bookings}/${id}?_venue=true&_customer=true`,
      {
        token,
      }
    );
  },

  create: async (bookingData) => {
    const token = tokenManager.get();
    return makeRequest(apiConfig.endpoints.holidaze.bookings, {
      method: "POST",
      token,
      body: JSON.stringify(bookingData),
    });
  },

  update: async (id, bookingData) => {
    const token = tokenManager.get();
    return makeRequest(`${apiConfig.endpoints.holidaze.bookings}/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(bookingData),
    });
  },

  delete: async (id) => {
    const token = tokenManager.get();
    return makeRequest(`${apiConfig.endpoints.holidaze.bookings}/${id}`, {
      method: "DELETE",
      token,
    });
  },

  getByProfile: async (profileName) => {
    const token = tokenManager.get();
    return makeRequest(
      `${apiConfig.endpoints.holidaze.profiles}/${profileName}/bookings?_venue=true`,
      {
        token,
      }
    );
  },
};
