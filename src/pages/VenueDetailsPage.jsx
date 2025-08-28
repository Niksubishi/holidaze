import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { venuesAPI } from "../api/venues.js";
import { useTheme } from "../context/ThemeContext";
import VenueDetails from "../components/Venues/VenueDetails";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";

const VenueDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const response = await venuesAPI.getById(id);
        setVenue(response.data);
        setError("");
      } catch (err) {
        console.error("Failed to fetch venue:", err);
        if (err.message.includes("not found") || err.message.includes("404")) {
          navigate("/404", { replace: true });
        } else {
          setError(err.message || "Failed to load venue");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVenue();
    }
  }, [id, navigate]);

  const handleBookingSuccess = () => {
    // Could trigger a refetch of venue data or show a success message
    // For now, we'll just let the booking form handle the success message
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.background }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: theme.colors.background }}>
        <div className="text-center">
          <ErrorMessage message={error} className="mb-4" />
          <button
            onClick={() => navigate("/venues")}
            className="px-6 py-3 bg-primary text-white font-chivo rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Back to Venues
          </button>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: theme.colors.background }}>
        <div className="text-center">
          <h2 className="font-chivo text-2xl mb-4" style={{ color: theme.colors.text }}>
            Venue not found
          </h2>
          <button
            onClick={() => navigate("/venues")}
            className="px-6 py-3 bg-primary text-white font-chivo rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Back to Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 transition-colors font-lora"
          style={{ color: theme.colors.text, opacity: 0.7 }}
          onMouseEnter={(e) => {
            e.target.style.color = theme.colors.text;
            e.target.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = theme.colors.text;
            e.target.style.opacity = '0.7';
          }}
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
      </div>

      <VenueDetails venue={venue} onBookingSuccess={handleBookingSuccess} />
    </div>
  );
};

export default VenueDetailsPage;
