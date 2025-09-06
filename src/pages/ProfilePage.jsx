import React, { useState } from "react";
import { profilesAPI } from "../api/profiles.js";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import SuccessMessage from "../components/UI/SuccessMessage";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    bio: user?.bio || "",
    avatar: {
      url: user?.avatar?.url || "",
      alt: user?.avatar?.alt || "",
    },
    banner: {
      url: user?.banner?.url || "",
      alt: user?.banner?.alt || "",
    },
    venueManager: user?.venueManager || false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("avatar.") || name.startsWith("banner.")) {
      const [field, subField] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = () => {
    if (formData.bio && formData.bio.length > 160) {
      setError("Bio must be less than 160 characters");
      return false;
    }

    if (formData.avatar.alt && formData.avatar.alt.length > 120) {
      setError("Avatar alt text must be less than 120 characters");
      return false;
    }

    if (formData.banner.alt && formData.banner.alt.length > 120) {
      setError("Banner alt text must be less than 120 characters");
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
      const updateData = {};

      // Add bio if it has a value or if it's being cleared
      if (formData.bio !== user.bio) {
        updateData.bio = formData.bio.trim();
      }

      // Add avatar if URL is provided or if it's being cleared
      if (
        formData.avatar.url !== user?.avatar?.url ||
        formData.avatar.alt !== user?.avatar?.alt
      ) {
        if (formData.avatar.url.trim()) {
          updateData.avatar = {
            url: formData.avatar.url.trim(),
            alt: formData.avatar.alt.trim() || "",
          };
        } else {
          updateData.avatar = null;
        }
      }

      // Add banner if URL is provided or if it's being cleared
      if (
        formData.banner.url !== user?.banner?.url ||
        formData.banner.alt !== user?.banner?.alt
      ) {
        if (formData.banner.url.trim()) {
          updateData.banner = {
            url: formData.banner.url.trim(),
            alt: formData.banner.alt.trim() || "",
          };
        } else {
          updateData.banner = null;
        }
      }

      // Add venue manager status if it's different
      if (formData.venueManager !== user.venueManager) {
        updateData.venueManager = formData.venueManager;
      }

      // Only make API call if there are changes
      if (Object.keys(updateData).length === 0) {
        setError("No changes to save");
        return;
      }

      const response = await profilesAPI.update(user.name, updateData);
      updateUser(response.data);
      setSuccess("Profile updated successfully!");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Profile update failed:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-poppins text-3xl md:text-4xl mb-2" style={{ color: theme.colors.text }}>
            Profile Settings
          </h1>
          <p className="font-poppins" style={{ color: theme.colors.text, opacity: 0.7 }}>
            Update your account information and preferences
          </p>
        </div>

        <div className="rounded-lg p-6" style={{ backgroundColor: isDarkMode ? '#3a3a3a' : '#f9fafb' }}>
          <ErrorMessage message={error} className="mb-6" />
          <SuccessMessage message={success} className="mb-6" />

          {/* Current Profile Info */}
          <div className="mb-6 pb-6 border-b" style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }}>
            <div className="flex items-center space-x-4">
              {user?.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt={user.avatar.alt || user.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                  <span className="font-poppins text-white text-xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-poppins text-lg" style={{ color: theme.colors.text }}>{user?.name}</h3>
                <p className="font-poppins text-sm" style={{ color: theme.colors.text, opacity: 0.7 }}>{user?.email}</p>
                <p className="font-poppins text-xs" style={{ color: theme.colors.text, opacity: 0.6 }}>
                  {user?.venueManager ? "Venue Manager" : "Customer"}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="block font-poppins text-sm mb-2"
                style={{ color: theme.colors.text, opacity: 0.8 }}
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                maxLength="160"
                className="w-full px-3 py-2 rounded-lg focus:outline-none font-poppins resize-none h-24"
                style={{
                  backgroundColor: isDarkMode ? '#4b5563' : '#ffffff',
                  borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
                  color: isDarkMode ? '#ffffff' : '#132F3D'
                }}
              />
              <p className="font-poppins text-xs mt-1" style={{ color: theme.colors.text, opacity: 0.6 }}>
                {formData.bio.length}/160 characters
              </p>
            </div>

            {/* Avatar */}
            <div>
              <label
                htmlFor="avatar-url"
                className="block font-poppins text-sm mb-2"
                style={{ color: theme.colors.text, opacity: 0.8 }}
              >
                Avatar Image URL
              </label>
              <input
                type="url"
                id="avatar-url"
                name="avatar.url"
                value={formData.avatar.url}
                onChange={handleInputChange}
                placeholder="https://example.com/your-avatar.jpg"
                className="w-full px-3 py-2 rounded-lg focus:outline-none font-poppins"
                style={{
                  backgroundColor: isDarkMode ? '#4b5563' : '#ffffff',
                  borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
                  color: isDarkMode ? '#ffffff' : '#132F3D'
                }}
              />
            </div>

            {formData.avatar.url && (
              <div>
                <label
                  htmlFor="avatar-alt"
                  className="block font-poppins text-sm mb-2"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                >
                  Avatar Alt Text
                </label>
                <input
                  type="text"
                  id="avatar-alt"
                  name="avatar.alt"
                  value={formData.avatar.alt}
                  onChange={handleInputChange}
                  placeholder="Description of your avatar"
                  maxLength="120"
                  className="w-full px-3 py-2 rounded-lg focus:outline-none font-poppins"
                  style={{
                    backgroundColor: isDarkMode ? '#4b5563' : '#ffffff',
                    borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
                    color: theme.colors.text
                  }}
                />
                <p className="font-poppins text-xs mt-1" style={{ color: theme.colors.text, opacity: 0.6 }}>
                  {formData.avatar.alt.length}/120 characters
                </p>
              </div>
            )}

            {/* Banner */}
            <div>
              <label
                htmlFor="banner-url"
                className="block font-poppins text-sm mb-2"
                style={{ color: theme.colors.text, opacity: 0.8 }}
              >
                Banner Image URL
              </label>
              <input
                type="url"
                id="banner-url"
                name="banner.url"
                value={formData.banner.url}
                onChange={handleInputChange}
                placeholder="https://example.com/your-banner.jpg"
                className="w-full px-3 py-2 rounded-lg focus:outline-none font-poppins"
                style={{
                  backgroundColor: isDarkMode ? '#4b5563' : '#ffffff',
                  borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
                  color: isDarkMode ? '#ffffff' : '#132F3D'
                }}
              />
            </div>

            {formData.banner.url && (
              <div>
                <label
                  htmlFor="banner-alt"
                  className="block font-poppins text-sm mb-2"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                >
                  Banner Alt Text
                </label>
                <input
                  type="text"
                  id="banner-alt"
                  name="banner.alt"
                  value={formData.banner.alt}
                  onChange={handleInputChange}
                  placeholder="Description of your banner"
                  maxLength="120"
                  className="w-full px-3 py-2 rounded-lg focus:outline-none font-poppins"
                  style={{
                    backgroundColor: isDarkMode ? '#4b5563' : '#ffffff',
                    borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
                    color: theme.colors.text
                  }}
                />
                <p className="font-poppins text-xs mt-1" style={{ color: theme.colors.text, opacity: 0.6 }}>
                  {formData.banner.alt.length}/120 characters
                </p>
              </div>
            )}

            {/* Venue Manager Toggle */}
            <div className="rounded-lg p-4" style={{ backgroundColor: isDarkMode ? '#4b5563' : '#f3f4f6' }}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="venue-manager"
                  name="venueManager"
                  checked={formData.venueManager}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary focus:ring-primary rounded"
                  style={{
                    backgroundColor: isDarkMode ? '#4b5563' : '#ffffff',
                    borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
                    color: isDarkMode ? '#ffffff' : '#132F3D'
                  }}
                />
                <label
                  htmlFor="venue-manager"
                  className="ml-2 font-poppins text-sm"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                >
                  {user?.venueManager ? "I am a venue manager" : "Become a venue manager"}
                </label>
              </div>
              <p className="font-poppins text-xs mt-2" style={{ color: theme.colors.text, opacity: 0.6 }}>
                {user?.venueManager 
                  ? "Uncheck this to stop being a venue manager. This will remove your access to venue management features."
                  : "This will allow you to create and manage venue listings. You can always change this later."
                }
              </p>
              {user?.venueManager && !formData.venueManager && (
                <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <p className="font-poppins text-xs" style={{ color: '#fca5a5' }}>
                    <strong>Warning:</strong> Removing venue manager status will prevent you from accessing 
                    venue management features, but your existing venues will remain active.
                  </p>
                </div>
              )}
            </div>

            {/* Preview Section */}
            {(formData.avatar.url || formData.banner.url) && (
              <div className="rounded-lg p-4" style={{ backgroundColor: isDarkMode ? '#4b5563' : '#f3f4f6' }}>
                <h4 className="font-poppins text-sm mb-3" style={{ color: theme.colors.text, opacity: 0.8 }}>
                  Preview
                </h4>
                <div className="space-y-3">
                  {formData.banner.url && (
                    <div>
                      <p className="font-poppins text-xs mb-1" style={{ color: theme.colors.text, opacity: 0.6 }}>
                        Banner:
                      </p>
                      <img
                        src={formData.banner.url}
                        alt={formData.banner.alt}
                        className="w-full h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  {formData.avatar.url && (
                    <div>
                      <p className="font-poppins text-xs mb-1" style={{ color: theme.colors.text, opacity: 0.6 }}>
                        Avatar:
                      </p>
                      <img
                        src={formData.avatar.url}
                        alt={formData.avatar.alt}
                        className="h-16 w-16 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    bio: user?.bio || "",
                    avatar: {
                      url: user?.avatar?.url || "",
                      alt: user?.avatar?.alt || "",
                    },
                    banner: {
                      url: user?.banner?.url || "",
                      alt: user?.banner?.alt || "",
                    },
                    venueManager: user?.venueManager || false,
                  });
                  setError("");
                  setSuccess("");
                }}
                className="px-6 py-3 font-poppins rounded-lg transition-colors cursor-pointer"
                style={{
                  borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
                  color: theme.colors.text,
                  opacity: 0.8
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isDarkMode ? '#4b5563' : '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary text-white font-poppins rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="small" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;