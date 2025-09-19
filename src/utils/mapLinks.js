/**
 * Utility functions for generating map links to Google Maps and Apple Maps
 */

/**
 * Generates a Google Maps search URL from venue location data
 * @param {Object} location - Venue location object
 * @param {string} location.address - Street address
 * @param {string} location.city - City name
 * @param {string} location.country - Country name
 * @param {string} location.zip - Postal code
 * @param {number} location.lat - Latitude (optional)
 * @param {number} location.lng - Longitude (optional)
 * @returns {string} Google Maps URL
 */
export const generateGoogleMapsUrl = (location) => {
  if (!location) return null;

  if (location.lat && location.lng) {
    return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
  }

  const addressParts = [];
  if (location.address) addressParts.push(location.address);
  if (location.city) addressParts.push(location.city);
  if (location.zip) addressParts.push(location.zip);
  if (location.country) addressParts.push(location.country);

  if (addressParts.length === 0) return null;

  const addressString = addressParts.join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressString)}`;
};

/**
 * Generates an Apple Maps search URL from venue location data
 * @param {Object} location - Venue location object
 * @param {string} location.address - Street address
 * @param {string} location.city - City name
 * @param {string} location.country - Country name
 * @param {string} location.zip - Postal code
 * @param {number} location.lat - Latitude (optional)
 * @param {number} location.lng - Longitude (optional)
 * @returns {string} Apple Maps URL
 */
export const generateAppleMapsUrl = (location) => {
  if (!location) return null;

  if (location.lat && location.lng) {
    return `https://maps.apple.com/?q=${location.lat},${location.lng}`;
  }

  const addressParts = [];
  if (location.address) addressParts.push(location.address);
  if (location.city) addressParts.push(location.city);
  if (location.zip) addressParts.push(location.zip);
  if (location.country) addressParts.push(location.country);

  if (addressParts.length === 0) return null;

  const addressString = addressParts.join(', ');
  return `https://maps.apple.com/?q=${encodeURIComponent(addressString)}`;
};

/**
 * Detects if the user is on an iOS device
 * @returns {boolean} True if iOS device
 */
export const isIOSDevice = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

/**
 * Gets the appropriate map URL based on device
 * @param {Object} location - Venue location object
 * @param {string} venueName - Name of the venue
 * @returns {Object} Object with google and apple URLs, plus preferred URL for device
 */
export const getMapUrls = (location, venueName = '') => {
  const googleUrl = generateGoogleMapsUrl(location, venueName);
  const appleUrl = generateAppleMapsUrl(location, venueName);
  const preferredUrl = isIOSDevice() ? appleUrl : googleUrl;

  return {
    google: googleUrl,
    apple: appleUrl,
    preferred: preferredUrl,
    isIOS: isIOSDevice()
  };
};