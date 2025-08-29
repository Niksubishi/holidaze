import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { venuesAPI } from "../../api/venues.js";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../UI/LoadingSpinner";
import ErrorMessage from "../UI/ErrorMessage";
import SuccessMessage from "../UI/SuccessMessage";

const CreateVenue = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    media: [{ url: "", alt: "" }],
    price: "",
    maxGuests: "",
    rating: 0,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
      lat: 0,
      lng: 0,
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("meta.")) {
      const metaField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          [metaField]: checked,
        },
      }));
    } else if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: ["lat", "lng"].includes(locationField)
            ? value === ""
              ? 0
              : parseFloat(value)
            : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: ["price", "maxGuests", "rating"].includes(name)
          ? value === ""
            ? ""
            : parseFloat(value)
          : value,
      }));
    }

    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleMediaChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addMediaField = () => {
    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, { url: "", alt: "" }],
    }));
  };

  const removeMediaField = (index) => {
    if (formData.media.length > 1) {
      setFormData((prev) => ({
        ...prev,
        media: prev.media.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Venue name is required");
      return false;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }

    if (!formData.price || formData.price <= 0) {
      setError("Price must be greater than 0");
      return false;
    }

    if (!formData.maxGuests || formData.maxGuests < 1) {
      setError("Maximum guests must be at least 1");
      return false;
    }

    // Check if at least one media URL is provided and valid
    const validMedia = formData.media.filter((item) => item.url.trim());
    if (validMedia.length === 0) {
      setError("At least one image URL is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const venueData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        maxGuests: parseInt(formData.maxGuests),
        meta: formData.meta,
      };

      // Add media (filter out empty URLs)
      const validMedia = formData.media
        .filter((item) => item.url.trim())
        .map((item) => ({
          url: item.url.trim(),
          alt: item.alt.trim() || "",
        }));

      if (validMedia.length > 0) {
        venueData.media = validMedia;
      }

      // Add location (only include fields with values)
      const location = {};
      Object.entries(formData.location).forEach(([key, value]) => {
        if (key === "lat" || key === "lng") {
          location[key] = value;
        } else if (value && value.toString().trim()) {
          location[key] = value.toString().trim();
        }
      });

      if (Object.keys(location).length > 0) {
        venueData.location = location;
      }

      // Add rating if specified
      if (formData.rating > 0) {
        venueData.rating = formData.rating;
      }

      const response = await venuesAPI.create(venueData);
      setSuccess("Venue created successfully!");

      setTimeout(() => {
        navigate("/my-venues");
      }, 2000);
    } catch (err) {
      console.error("Failed to create venue:", err);
      setError(err.message || "Failed to create venue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 hover:opacity-75 transition-colors font-poppins mb-4"
            style={{ color: theme.colors.text }}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back</span>
          </button>

          <h1 className="font-poppins text-3xl md:text-4xl mb-2" style={{ color: theme.colors.text }}>
            Create New Venue
          </h1>
          <p className="font-poppins" style={{ color: theme.colors.text, opacity: 0.7 }}>
            Add a new venue to your listings
          </p>
        </div>

        <div className="rounded-lg p-6" style={{ backgroundColor: theme.colors.background === '#2A2A2A' ? '#374151' : '#f9fafb' }}>
          <ErrorMessage message={error} className="mb-6" />
          <SuccessMessage message={success} className="mb-6" />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block font-poppins text-sm mb-2"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                >
                  Venue Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter venue name"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary font-poppins"
                  style={{
                    backgroundColor: theme.colors.background === '#2A2A2A' ? '#4b5563' : '#ffffff',
                    borderColor: theme.colors.background === '#2A2A2A' ? '#6b7280' : '#d1d5db',
                    color: theme.colors.text
                  }}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block font-poppins text-sm mb-2"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                >
                  Price per Night ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary font-poppins"
                  style={{
                    backgroundColor: theme.colors.background === '#2A2A2A' ? '#4b5563' : '#ffffff',
                    borderColor: theme.colors.background === '#2A2A2A' ? '#6b7280' : '#d1d5db',
                    color: theme.colors.text
                  }}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="maxGuests"
                  className="block font-poppins text-sm mb-2"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                >
                  Maximum Guests *
                </label>
                <input
                  type="number"
                  id="maxGuests"
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleInputChange}
                  placeholder="1"
                  min="1"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary font-poppins"
                  style={{
                    backgroundColor: theme.colors.background === '#2A2A2A' ? '#4b5563' : '#ffffff',
                    borderColor: theme.colors.background === '#2A2A2A' ? '#6b7280' : '#d1d5db',
                    color: theme.colors.text
                  }}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="rating"
                  className="block font-poppins text-sm mb-2"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                >
                  Initial Rating (0-5)
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary font-poppins"
                  style={{
                    backgroundColor: theme.colors.background === '#2A2A2A' ? '#4b5563' : '#ffffff',
                    borderColor: theme.colors.background === '#2A2A2A' ? '#6b7280' : '#d1d5db',
                    color: theme.colors.text
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block font-poppins text-sm text-gray-300 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your venue..."
                rows="4"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary font-poppins resize-none"
                required
              />
            </div>

            {/* Media */}
            <div>
              <label className="block font-poppins text-sm mb-2" style={{ color: theme.colors.text, opacity: 0.8 }}>
                Images *
              </label>
              {formData.media.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4"
                >
                  <div>
                    <input
                      type="url"
                      value={item.url}
                      onChange={(e) =>
                        handleMediaChange(index, "url", e.target.value)
                      }
                      placeholder="Image URL"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary font-poppins"
                  style={{
                    backgroundColor: theme.colors.background === '#2A2A2A' ? '#4b5563' : '#ffffff',
                    borderColor: theme.colors.background === '#2A2A2A' ? '#6b7280' : '#d1d5db',
                    color: theme.colors.text
                  }}
                      required={index === 0}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={item.alt}
                      onChange={(e) =>
                        handleMediaChange(index, "alt", e.target.value)
                      }
                      placeholder="Alt text (optional)"
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary font-poppins"
                    />
                    {formData.media.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMediaField(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addMediaField}
                className="px-4 py-2 border font-poppins rounded-lg hover:opacity-75 transition-colors"
                style={{
                  borderColor: theme.colors.background === '#2A2A2A' ? '#6b7280' : '#d1d5db',
                  color: theme.colors.text,
                  backgroundColor: 'transparent'
                }}
              >
                Add Another Image
              </button>
            </div>

            {/* Amenities */}
            <div>
              <label className="block font-poppins text-sm text-gray-300 mb-3">
                Amenities
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(formData.meta).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`meta.${key}`}
                      name={`meta.${key}`}
                      checked={value}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-600 rounded bg-gray-700"
                    />
                    <label
                      htmlFor={`meta.${key}`}
                      className="ml-2 font-poppins text-sm capitalize"
                      style={{ color: theme.colors.text, opacity: 0.8 }}
                    >
                      {key === "wifi" ? "WiFi" : key}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="font-poppins text-lg mb-4" style={{ color: theme.colors.text }}>Location</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="location.address"
                    className="block font-poppins text-sm mb-2"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="location.address"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary font-poppins"
                  style={{
                    backgroundColor: theme.colors.background === '#2A2A2A' ? '#4b5563' : '#ffffff',
                    borderColor: theme.colors.background === '#2A2A2A' ? '#6b7280' : '#d1d5db',
                    color: theme.colors.text
                  }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="location.city"
                    className="block font-poppins text-sm mb-2"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="location.city"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    placeholder="City name"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary font-poppins"
                  style={{
                    backgroundColor: theme.colors.background === '#2A2A2A' ? '#4b5563' : '#ffffff',
                    borderColor: theme.colors.background === '#2A2A2A' ? '#6b7280' : '#d1d5db',
                    color: theme.colors.text
                  }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="location.zip"
                    className="block font-poppins text-sm mb-2"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                  >
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="location.zip"
                    name="location.zip"
                    value={formData.location.zip}
                    onChange={handleInputChange}
                    placeholder="ZIP code"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary font-poppins"
                  style={{
                    backgroundColor: theme.colors.background === '#2A2A2A' ? '#4b5563' : '#ffffff',
                    borderColor: theme.colors.background === '#2A2A2A' ? '#6b7280' : '#d1d5db',
                    color: theme.colors.text
                  }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="location.country"
                    className="block font-poppins text-sm mb-2"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    id="location.country"
                    name="location.country"
                    value={formData.location.country}
                    onChange={handleInputChange}
                    placeholder="Country name"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary font-poppins"
                  style={{
                    backgroundColor: theme.colors.background === '#2A2A2A' ? '#4b5563' : '#ffffff',
                    borderColor: theme.colors.background === '#2A2A2A' ? '#6b7280' : '#d1d5db',
                    color: theme.colors.text
                  }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="location.continent"
                    className="block font-poppins text-sm mb-2"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                  >
                    Continent
                  </label>
                  <input
                    type="text"
                    id="location.continent"
                    name="location.continent"
                    value={formData.location.continent}
                    onChange={handleInputChange}
                    placeholder="Continent name"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary font-poppins"
                  style={{
                    backgroundColor: theme.colors.background === '#2A2A2A' ? '#4b5563' : '#ffffff',
                    borderColor: theme.colors.background === '#2A2A2A' ? '#6b7280' : '#d1d5db',
                    color: theme.colors.text
                  }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="location.lat"
                    className="block font-poppins text-sm mb-2"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                  >
                    Latitude
                  </label>
                  <input
                    type="number"
                    id="location.lat"
                    name="location.lat"
                    value={formData.location.lat}
                    onChange={handleInputChange}
                    placeholder="0.0"
                    step="any"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary font-poppins"
                  style={{
                    backgroundColor: theme.colors.background === '#2A2A2A' ? '#4b5563' : '#ffffff',
                    borderColor: theme.colors.background === '#2A2A2A' ? '#6b7280' : '#d1d5db',
                    color: theme.colors.text
                  }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="location.lng"
                    className="block font-poppins text-sm mb-2"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                  >
                    Longitude
                  </label>
                  <input
                    type="number"
                    id="location.lng"
                    name="location.lng"
                    value={formData.location.lng}
                    onChange={handleInputChange}
                    placeholder="0.0"
                    step="any"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary font-poppins"
                  style={{
                    backgroundColor: theme.colors.background === '#2A2A2A' ? '#4b5563' : '#ffffff',
                    borderColor: theme.colors.background === '#2A2A2A' ? '#6b7280' : '#d1d5db',
                    color: theme.colors.text
                  }}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border font-poppins rounded-lg hover:opacity-75 transition-colors"
                style={{
                  borderColor: theme.colors.background === '#2A2A2A' ? '#6b7280' : '#d1d5db',
                  color: theme.colors.text,
                  backgroundColor: 'transparent'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary text-white font-poppins rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="small" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create Venue"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateVenue;
