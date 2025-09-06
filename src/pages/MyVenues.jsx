import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { venuesAPI } from "../api/venues.js";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import SuccessMessage from "../components/UI/SuccessMessage";
import ConfirmationModal from "../components/UI/ConfirmationModal";

const MyVenues = () => {
  const { user } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await venuesAPI.getByProfile(user.name);
        setVenues(response.data);
        setError("");
      } catch (err) {
        console.error("Failed to fetch venues:", err);
        setError(err.message || "Failed to load venues");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchVenues();
    }
  }, [user]);

  const handleDeleteVenue = (venueId) => {
    setVenueToDelete(venueId);
    setShowConfirmModal(true);
  };

  const confirmDeleteVenue = async () => {
    try {
      await venuesAPI.delete(venueToDelete);
      setVenues((prev) => prev.filter((venue) => venue.id !== venueToDelete));
      setSuccess("Venue deleted successfully");
      setShowConfirmModal(false);
      setVenueToDelete(null);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to delete venue:", err);
      setError(err.message || "Failed to delete venue");
      setShowConfirmModal(false);
      setVenueToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setVenueToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.background }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-poppins text-3xl md:text-4xl mb-2" style={{ color: theme.colors.text }}>
                My Venues
              </h1>
              <p className="font-poppins" style={{ color: theme.colors.text, opacity: 0.7 }}>
                Manage your properties and bookings
              </p>
            </div>
            <Link
              to="/create-venue"
              className="px-6 py-3 bg-primary text-white font-poppins rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Create New Venue
            </Link>
          </div>
        </div>

        <ErrorMessage message={error} className="mb-6" />
        <SuccessMessage message={success} className="mb-6" />

        {venues.length === 0 && !loading ? (
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="font-poppins text-xl mb-2" style={{ color: theme.colors.text }}>
              No venues created yet
            </h3>
            <p className="font-poppins mb-6" style={{ color: theme.colors.text, opacity: 0.7 }}>
              Start by creating your first venue to begin hosting guests.
            </p>
            <Link
              to="/create-venue"
              className="inline-block px-6 py-3 bg-primary text-white font-poppins rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Create Your First Venue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div
                key={venue.id}
                className="rounded-lg overflow-hidden transition-colors"
                style={{ 
                  backgroundColor: isDarkMode ? '#132F3D' : '#f3f4f6',
                  ':hover': { backgroundColor: isDarkMode ? '#4b5563' : '#e5e7eb' }
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isDarkMode ? '#4b5563' : '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = isDarkMode ? '#132F3D' : '#f3f4f6';
                }}
              >
                {/* Venue Image */}
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={
                      venue.media?.[0]?.url ||
                      "/images/default.jpg"
                    }
                    alt={
                      venue.media?.[0]?.alt || venue.name
                    }
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Venue Details */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-poppins text-xl mb-2" style={{ color: theme.colors.text }}>
                      {venue.name}
                    </h3>
                    <p className="font-poppins text-sm mb-2" style={{ color: theme.colors.text, opacity: 0.7 }}>
                      {venue.location?.city && venue.location?.country
                        ? `${venue.location.city}, ${venue.location.country}`
                        : "Location not specified"}
                    </p>
                    <p className="font-poppins text-sm line-clamp-2" style={{ color: theme.colors.text, opacity: 0.6 }}>
                      {venue.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="font-poppins text-lg" style={{ color: theme.colors.text }}>
                        ${venue.price}
                      </p>
                      <p className="font-poppins text-sm" style={{ color: theme.colors.text, opacity: 0.6 }}>
                        per night
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-poppins text-sm" style={{ color: theme.colors.text, opacity: 0.6 }}>
                        Max guests
                      </p>
                      <p className="font-poppins" style={{ color: theme.colors.text }}>
                        {venue.maxGuests}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-2">
                      {venue.meta?.wifi && (
                        <span className="text-primary text-sm">📶</span>
                      )}
                      {venue.meta?.parking && (
                        <span className="text-primary text-sm">🚗</span>
                      )}
                      {venue.meta?.breakfast && (
                        <span className="text-primary text-sm">🍳</span>
                      )}
                      {venue.meta?.pets && (
                        <span className="text-primary text-sm">🐕</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-poppins text-sm" style={{ color: theme.colors.text, opacity: 0.6 }}>
                        Bookings
                      </p>
                      <p className="font-poppins" style={{ color: theme.colors.text }}>
                        {venue._count?.bookings || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/venues/${venue.id}`}
                      className="flex-1 px-4 py-2 font-poppins rounded-lg transition-colors text-center"
                      style={{ 
                        borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
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
                      View Details
                    </Link>
                    <Link
                      to={`/venues/${venue.id}/edit`}
                      className="flex-1 px-4 py-2 bg-primary text-white font-poppins rounded-lg hover:bg-opacity-90 transition-colors text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteVenue(venue.id)}
                      className="px-4 py-2 bg-red-600 text-white font-poppins rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={confirmDeleteVenue}
        title="Delete Venue"
        message="Are you sure you want to delete this venue? This action cannot be undone."
        confirmText="Delete Venue"
        cancelText="Keep Venue"
      />
    </div>
  );
};

export default MyVenues;