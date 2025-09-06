import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { profilesAPI } from "../api/profiles.js";
import { useTheme } from "../context/ThemeContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import VenueCard from "../components/Venues/VenueCard";

const PublicProfilePage = () => {
  const { username } = useParams();
  const { theme, isDarkMode } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await profilesAPI.getById(username);
        setProfile(response.data);
        setError("");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.background }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: theme.colors.background }}>
        <div className="max-w-6xl mx-auto px-4">
          <ErrorMessage message={error} className="mb-6" />
          <div className="text-center">
            <Link
              to="/venues"
              className="inline-block px-6 py-3 bg-primary text-white font-poppins rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Back to Venues
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: theme.colors.background }}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="font-poppins text-3xl mb-4" style={{ color: theme.colors.text }}>
            Profile not found
          </h1>
          <p className="font-poppins mb-6" style={{ color: theme.colors.text, opacity: 0.7 }}>
            The user profile you're looking for doesn't exist.
          </p>
          <Link
            to="/venues"
            className="inline-block px-6 py-3 bg-primary text-white font-poppins rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Back to Venues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="rounded-lg p-6 mb-8" style={{ backgroundColor: isDarkMode ? '#3a3a3a' : '#f9fafb' }}>
          {/* Banner */}
          {profile.banner?.url && (
            <div className="w-full h-48 mb-6 rounded-lg overflow-hidden">
              <img
                src={profile.banner.url}
                alt={profile.banner.alt || `${profile.name}'s banner`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Profile Info */}
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            {profile.avatar?.url ? (
              <img
                src={profile.avatar.url}
                alt={profile.avatar.alt || profile.name}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center">
                <span className="font-poppins text-white text-2xl">
                  {profile.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Name and Bio */}
            <div className="flex-1">
              <h1 className="font-poppins text-3xl mb-2" style={{ color: theme.colors.text }}>
                {profile.name}
              </h1>
              <p className="font-poppins mb-2" style={{ color: theme.colors.text, opacity: 0.7 }}>
                {profile.email}
              </p>
              <p className="font-poppins text-sm mb-4" style={{ color: theme.colors.text, opacity: 0.6 }}>
                {profile.venueManager ? "Venue Manager" : "Customer"}
              </p>
              {profile.bio && (
                <p className="font-poppins leading-relaxed" style={{ color: theme.colors.text, opacity: 0.8 }}>
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Venues Section */}
        {profile.venues && profile.venues.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="font-poppins text-2xl mb-2" style={{ color: theme.colors.text }}>
                {profile.name}'s Venues
              </h2>
              <p className="font-poppins" style={{ color: theme.colors.text, opacity: 0.7 }}>
                {profile.venues.length} venue{profile.venues.length !== 1 ? "s" : ""} available
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          </div>
        )}

        {/* No Venues Message */}
        {(!profile.venues || profile.venues.length === 0) && (
          <div className="text-center py-12">
            <div className="mb-6">
              <svg
                className="mx-auto h-24 w-24 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4m0 0V9a2 2 0 011-1h2a2 2 0 011 1v12m-3 0h4"
                />
              </svg>
            </div>
            <h3 className="font-poppins text-xl mb-2" style={{ color: theme.colors.text }}>
              No venues listed
            </h3>
            <p className="font-poppins" style={{ color: theme.colors.text, opacity: 0.7 }}>
              {profile.name} hasn't created any venue listings yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfilePage;