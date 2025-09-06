import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bookingsAPI } from "../api/bookings.js";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import SuccessMessage from "../components/UI/SuccessMessage";
import ConfirmationModal from "../components/UI/ConfirmationModal";

const MyBookings = () => {
  const { user } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingsAPI.getByProfile(user.name);

        // Filter for upcoming bookings and sort by date
        const now = new Date();
        const upcomingBookings = response.data
          .filter((booking) => new Date(booking.dateTo) >= now)
          .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

        setBookings(upcomingBookings);
        setError("");
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError(err.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleCancelBooking = (bookingId) => {
    setBookingToCancel(bookingId);
    setShowConfirmModal(true);
  };

  const confirmCancelBooking = async () => {
    try {
      setError("");
      await bookingsAPI.delete(bookingToCancel);
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingToCancel));
      setSuccess("Booking cancelled successfully");
      setShowConfirmModal(false);
      setBookingToCancel(null);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      setError(err.message || "Failed to cancel booking");
      setShowConfirmModal(false);
      setBookingToCancel(null);
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setBookingToCancel(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateNights = (dateFrom, dateTo) => {
    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = (booking) => {
    const nights = calculateNights(booking.dateFrom, booking.dateTo);
    return nights * booking.venue.price;
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.colors.background }}
      >
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1
            className="font-poppins text-3xl md:text-4xl mb-2"
            style={{ color: theme.colors.text }}
          >
            My Bookings
          </h1>
          <p
            className="font-poppins"
            style={{ color: theme.colors.text, opacity: 0.7 }}
          >
            Manage your upcoming reservations
          </p>
        </div>

        <ErrorMessage message={error} className="mb-6" />
        <SuccessMessage message={success} className="mb-6" />

        {bookings.length === 0 && !loading ? (
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
                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11m-6 0h8m-8 0V7a2 2 0 012-2h4a2 2 0 012 2v4"
                />
              </svg>
            </div>
            <h3
              className="font-poppins text-xl mb-2"
              style={{ color: theme.colors.text }}
            >
              No upcoming bookings
            </h3>
            <p
              className="font-poppins mb-6"
              style={{ color: theme.colors.text, opacity: 0.7 }}
            >
              Ready to plan your next getaway?
            </p>
            <Link
              to="/venues"
              className="inline-block px-6 py-3 text-white font-poppins rounded-lg hover:bg-opacity-90 transition-colors"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Browse Venues
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-lg p-6 transition-colors"
                style={{
                  backgroundColor:
                    theme.colors.background === "#2A2A2A"
                      ? "#3a3a3a"
                      : "#ffffff",
                  border: "none",
                }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Venue Image */}
                  <div className="lg:col-span-1">
                    <Link to={`/venues/${booking.venue.id}`}>
                      <div className="aspect-video w-full overflow-hidden rounded-lg">
                        <img
                          src={
                            booking.venue.media?.[0]?.url ||
                            "/images/default.jpg"
                          }
                          alt={
                            booking.venue.media?.[0]?.alt || booking.venue.name
                          }
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                  </div>

                  {/* Booking Details */}
                  <div className="lg:col-span-2">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <Link
                              to={`/venues/${booking.venue.id}`}
                              className="font-poppins text-xl hover:opacity-75 transition-colors"
                              style={{ color: theme.colors.text }}
                            >
                              {booking.venue.name}
                            </Link>
                            <p
                              className="font-poppins text-sm mt-1"
                              style={{ color: theme.colors.text, opacity: 0.7 }}
                            >
                              {booking.venue.location?.city &&
                              booking.venue.location?.country
                                ? `${booking.venue.location.city}, ${booking.venue.location.country}`
                                : "Location not specified"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className="font-poppins text-lg"
                              style={{ color: theme.colors.text }}
                            >
                              ${calculateTotalPrice(booking)}
                            </p>
                            <p
                              className="font-poppins text-sm"
                              style={{ color: theme.colors.text, opacity: 0.7 }}
                            >
                              total for{" "}
                              {calculateNights(
                                booking.dateFrom,
                                booking.dateTo
                              )}{" "}
                              night
                              {calculateNights(
                                booking.dateFrom,
                                booking.dateTo
                              ) !== 1
                                ? "s"
                                : ""}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p
                              className="font-poppins text-sm"
                              style={{ color: theme.colors.text, opacity: 0.6 }}
                            >
                              Check-in
                            </p>
                            <p
                              className="font-poppins"
                              style={{ color: theme.colors.text }}
                            >
                              {formatDate(booking.dateFrom)}
                            </p>
                          </div>
                          <div>
                            <p
                              className="font-poppins text-sm"
                              style={{ color: theme.colors.text, opacity: 0.6 }}
                            >
                              Check-out
                            </p>
                            <p
                              className="font-poppins"
                              style={{ color: theme.colors.text }}
                            >
                              {formatDate(booking.dateTo)}
                            </p>
                          </div>
                          <div>
                            <p
                              className="font-poppins text-sm"
                              style={{ color: theme.colors.text, opacity: 0.6 }}
                            >
                              Guests
                            </p>
                            <p
                              className="font-poppins"
                              style={{ color: theme.colors.text }}
                            >
                              {booking.guests} guest
                              {booking.guests !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div>
                            <p
                              className="font-poppins text-sm"
                              style={{ color: theme.colors.text, opacity: 0.6 }}
                            >
                              Booking ID
                            </p>
                            <p
                              className="font-poppins text-sm"
                              style={{ color: theme.colors.text }}
                            >
                              {booking.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <Link
                          to={`/venues/${booking.venue.id}`}
                          className="px-4 py-2 font-poppins rounded-lg hover:opacity-75 transition-colors"
                          style={{
                            borderColor: isDarkMode
                              ? "#ffffff"
                              : "#132F3D66",
                            color: isDarkMode ? "#ffffff" : "#132F3Dcc",
                          }}
                        >
                          View Venue
                        </Link>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-4 py-2 bg-red-600 text-white font-poppins rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
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
        onConfirm={confirmCancelBooking}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
      />
    </div>
  );
};

export default MyBookings;
