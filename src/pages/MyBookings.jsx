import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bookingsAPI } from "../api/bookings.js";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import SuccessMessage from "../components/UI/SuccessMessage";

const MyBookings = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setError("");
      await bookingsAPI.delete(bookingId);
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
      setSuccess("Booking cancelled successfully");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      setError(err.message || "Failed to cancel booking");
      setTimeout(() => setError(""), 5000);
    }
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.background }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-chivo text-3xl md:text-4xl mb-2" style={{ color: theme.colors.text }}>
            My Bookings
          </h1>
          <p className="font-lora" style={{ color: theme.colors.text, opacity: 0.7 }}>
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
            <h3 className="font-chivo text-xl mb-2" style={{ color: theme.colors.text }}>
              No upcoming bookings
            </h3>
            <p className="font-lora mb-6" style={{ color: theme.colors.text, opacity: 0.7 }}>
              Ready to plan your next getaway?
            </p>
            <Link
              to="/venues"
              className="inline-block px-6 py-3 text-white font-chivo rounded-lg hover:bg-opacity-90 transition-colors"
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
                  backgroundColor: theme.colors.background === '#2A2A2A' ? '#374151' : '#ffffff', 
                  border: theme.colors.background === '#2A2A2A' ? 'none' : '1px solid #e5e7eb'
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
                            "/images/placeholder-venue.jpg"
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
                              className="font-chivo text-xl hover:opacity-75 transition-colors"
                              style={{ color: theme.colors.text }}
                            >
                              {booking.venue.name}
                            </Link>
                            <p className="font-lora text-sm mt-1" style={{ color: theme.colors.text, opacity: 0.7 }}>
                              {booking.venue.location?.city &&
                              booking.venue.location?.country
                                ? `${booking.venue.location.city}, ${booking.venue.location.country}`
                                : "Location not specified"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-chivo text-lg" style={{ color: theme.colors.text }}>
                              ${calculateTotalPrice(booking)}
                            </p>
                            <p className="font-lora text-sm" style={{ color: theme.colors.text, opacity: 0.7 }}>
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
                            <p className="font-lora text-sm" style={{ color: theme.colors.text, opacity: 0.6 }}>
                              Check-in
                            </p>
                            <p className="font-lora" style={{ color: theme.colors.text }}>
                              {formatDate(booking.dateFrom)}
                            </p>
                          </div>
                          <div>
                            <p className="font-lora text-sm" style={{ color: theme.colors.text, opacity: 0.6 }}>
                              Check-out
                            </p>
                            <p className="font-lora" style={{ color: theme.colors.text }}>
                              {formatDate(booking.dateTo)}
                            </p>
                          </div>
                          <div>
                            <p className="font-lora text-sm" style={{ color: theme.colors.text, opacity: 0.6 }}>
                              Guests
                            </p>
                            <p className="font-lora" style={{ color: theme.colors.text }}>
                              {booking.guests} guest
                              {booking.guests !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div>
                            <p className="font-lora text-sm" style={{ color: theme.colors.text, opacity: 0.6 }}>
                              Booking ID
                            </p>
                            <p className="font-lora text-sm" style={{ color: theme.colors.text }}>
                              {booking.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <Link
                          to={`/venues/${booking.venue.id}`}
                          className="px-4 py-2 border font-chivo rounded-lg hover:opacity-75 transition-colors"
                          style={{ 
                            borderColor: theme.colors.text + '40',
                            color: theme.colors.text + 'CC'
                          }}
                        >
                          View Venue
                        </Link>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-4 py-2 bg-red-600 text-white font-chivo rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
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
    </div>
  );
};

export default MyBookings;
