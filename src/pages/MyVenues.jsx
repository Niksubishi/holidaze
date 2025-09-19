import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { venuesAPI } from "../api/venues.js";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import SkeletonList from "../components/UI/SkeletonList";
import ErrorMessage from "../components/UI/ErrorMessage";
import ConfirmationModal from "../components/UI/ConfirmationModal";
import AmenityIcons from "../components/UI/AmenityIcons";
import { getMainCardBackground, getSecondaryBackground } from "../utils/theme.js";

const MyVenues = () => {
  const { user } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { showSuccess } = useToast();
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
      showSuccess("Venue deleted successfully!");
      setShowConfirmModal(false);
      setVenueToDelete(null);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
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
      <div className="min-h-screen py-8" style={{ backgroundColor: theme.colors.background }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-poppins text-3xl md:text-4xl mb-2" style={{ color: theme.colors.text }}>
              My Venues
            </h1>
            <p className="font-poppins" style={{ color: theme.colors.text, opacity: 0.7 }}>
              Manage your properties and bookings
            </p>
          </div>
          <SkeletonList count={6} />
        </div>
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
                  backgroundColor: getMainCardBackground(isDarkMode),
                  border: isDarkMode ? "none" : "none",
                }}
              >
                
                <div className="aspect-video w-full overflow-hidden">
                  <Link to={`/venues/${venue.id}`}>
                    <img
                      src={
                        venue.media?.[0]?.url ||
                        "/images/default.jpg"
                      }
                      alt={
                        venue.media?.[0]?.alt || venue.name
                      }
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  </Link>
                </div>

                
                <div className="p-6">
                  <div className="mb-4">
                    <Link to={`/venues/${venue.id}`}>
                      <h3 className="font-poppins text-xl mb-2 hover:opacity-75 transition-colors cursor-pointer" style={{ color: theme.colors.text }}>
                        {venue.name}
                      </h3>
                    </Link>
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
                    <div className="flex flex-wrap gap-2 items-center">
                      {venue.meta?.wifi && (
                        <div className="flex items-center space-x-1">
                          <AmenityIcons.WiFi size={16} color="#9ca3af" />
                          <span className="text-xs" style={{ color: "#9ca3af" }}>WiFi</span>
                        </div>
                      )}
                      {venue.meta?.parking && (
                        <div className="flex items-center space-x-1">
                          <AmenityIcons.Parking size={16} color="#9ca3af" />
                          <span className="text-xs" style={{ color: "#9ca3af" }}>Parking</span>
                        </div>
                      )}
                      {venue.meta?.breakfast && (
                        <div className="flex items-center space-x-1">
                          <AmenityIcons.Breakfast size={16} color="#9ca3af" />
                          <span className="text-xs" style={{ color: "#9ca3af" }}>Breakfast</span>
                        </div>
                      )}
                      {venue.meta?.pets && (
                        <div className="flex items-center space-x-1">
                          <AmenityIcons.Pets size={16} color="#9ca3af" />
                          <span className="text-xs" style={{ color: "#9ca3af" }}>Pets</span>
                        </div>
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
                      to={`/venues/${venue.id}/edit`}
                      className="flex-1 px-4 py-2 bg-primary text-white font-poppins rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/venues/${venue.id}/manage`}
                      className="flex-1 px-4 py-2 font-poppins rounded-lg transition-colors hover:opacity-80 flex items-center justify-center"
                      style={{
                        backgroundColor: getSecondaryBackground(isDarkMode),
                        color: theme.colors.text,
                      }}
                    >
                      Manage
                    </Link>
                    <button
                      onClick={() => handleDeleteVenue(venue.id)}
                      className="px-3 py-2 bg-red-600 text-white font-poppins rounded-lg hover:bg-red-700 transition-colors cursor-pointer flex items-center justify-center"
                      title="Delete venue"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
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