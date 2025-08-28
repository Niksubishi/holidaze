import { makeRequest, apiConfig } from "./config.js";
import { tokenManager } from "./auth.js";

export const venuesAPI = {
  getAll: async (
    page = 1,
    limit = 12,
    sort = "created",
    sortOrder = "desc"
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort: sort,
      sortOrder: sortOrder,
      _owner: "true",
    });

    return makeRequest(`${apiConfig.endpoints.holidaze.venues}?${params}`);
  },

  getById: async (id) => {
    return makeRequest(
      `${apiConfig.endpoints.holidaze.venues}/${id}?_owner=true&_bookings=true`
    );
  },

  search: async (query, page = 1, limit = 12, sort = "created", sortOrder = "desc") => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      sort: sort,
      sortOrder: sortOrder,
      _owner: "true",
    });

    return makeRequest(`${apiConfig.endpoints.holidaze.venues}/search?${params}`);
  },

  create: async (venueData) => {
    const token = tokenManager.get();
    return makeRequest(apiConfig.endpoints.holidaze.venues, {
      method: "POST",
      token,
      body: JSON.stringify(venueData),
    });
  },

  update: async (id, venueData) => {
    const token = tokenManager.get();
    return makeRequest(`${apiConfig.endpoints.holidaze.venues}/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(venueData),
    });
  },

  delete: async (id) => {
    const token = tokenManager.get();
    return makeRequest(`${apiConfig.endpoints.holidaze.venues}/${id}`, {
      method: "DELETE",
      token,
    });
  },

  getByProfile: async (profileName) => {
    const token = tokenManager.get();
    return makeRequest(
      `${apiConfig.endpoints.holidaze.profiles}/${profileName}/venues?_owner=true`,
      {
        token,
      }
    );
  },
};
