import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { venuesAPI } from "../api/venues.js";
import { bookingsAPI } from "../api/bookings.js";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import SuccessMessage from "../components/UI/SuccessMessage";
import ConfirmationModal from "../components/UI/ConfirmationModal";

const ManageVenuePage = () => {
  const { id: venueId } = useParams();
  const { user } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const response = await Promise.race([
          venuesAPI.getByIdWithBookings(venueId),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 10000))
        ]);
        const venueData = response.data;
        
        // Check if user owns this venue
        if (venueData.owner.name !== user.name) {
          setError("You don't have permission to manage this venue");
          setLoading(false);
          return;
        }
        
        setVenue(venueData);
        setError("");
      } catch (err) {
        console.error("Failed to fetch venue:", err);
        setError(err.message || "Failed to load venue");
      } finally {
        setLoading(false);
      }
    };

    if (venueId && user) {
      fetchVenue();
    } else if (venueId && !user) {
      // User not loaded yet, wait
      setLoading(true);
    } else {
      setLoading(false);
      setError("Invalid venue ID");
    }
  }, [venueId, user]);

  const handleDeleteBooking = (bookingId) => {
    setBookingToDelete(bookingId);
    setShowConfirmModal(true);
  };

  const confirmDeleteBooking = async () => {
    try {
      await bookingsAPI.delete(bookingToDelete);
      
      // Remove the booking from the venue's bookings array
      setVenue(prev => ({
        ...prev,
        bookings: prev.bookings.filter(booking => booking.id !== bookingToDelete)
      }));
      
      setSuccess("Booking cancelled successfully");
      setShowConfirmModal(false);
      setBookingToDelete(null);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      setError(err.message || "Failed to cancel booking");
      setShowConfirmModal(false);
      setBookingToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setBookingToDelete(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isBookingPast = (booking) => {
    const today = new Date();
    const checkoutDate = new Date(booking.dateTo);
    return checkoutDate < today;
  };

  const getCurrentBookings = () => {
    if (!venue?.bookings) return [];
    return venue.bookings.filter(booking => !isBookingPast(booking));
  };

  const getPastBookings = () => {
    if (!venue?.bookings) return [];
    return venue.bookings.filter(booking => isBookingPast(booking));
  };

  const getTotalRevenue = () => {
    if (!venue?.bookings) return 0;
    return venue.bookings.reduce((total, booking) => {
      const nights = calculateNights(booking.dateFrom, booking.dateTo);
      return total + (nights * venue.price);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.background }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error && !venue) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: theme.colors.background }}>
        <div className="max-w-6xl mx-auto px-4">
          <ErrorMessage message={error} className="mb-6" />
          <div className="text-center">
            <Link
              to="/my-venues"
              className="inline-block px-6 py-3 bg-primary text-white font-poppins rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Back to My Venues
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-poppins text-3xl md:text-4xl mb-2" style={{ color: theme.colors.text }}>
                Manage Bookings
              </h1>
              <p className="font-poppins" style={{ color: theme.colors.text, opacity: 0.7 }}>
                {venue?.name}
              </p>
            </div>
            <Link
              to="/my-venues"
              className="px-6 py-3 font-poppins rounded-lg transition-colors hover:opacity-80"
              style={{
                backgroundColor: isDarkMode ? '#4b5563' : '#f3f4f6',
                color: theme.colors.text,
              }}
            >
              Back to My Venues
            </Link>
          </div>
        </div>

        <ErrorMessage message={error} className="mb-6" />
        <SuccessMessage message={success} className="mb-6" />

        {/* Venue Summary */}
        <div className="rounded-lg p-6 mb-8" style={{ backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff' }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="font-poppins text-2xl mb-1" style={{ color: theme.colors.text }}>
                {getCurrentBookings().length}
              </p>
              <p className="font-poppins text-sm" style={{ color: theme.colors.text, opacity: 0.7 }}>
                Current Bookings
              </p>
            </div>
            <div className="text-center">
              <p className="font-poppins text-2xl mb-1" style={{ color: theme.colors.text }}>
                ${venue?.price}
              </p>
              <p className="font-poppins text-sm" style={{ color: theme.colors.text, opacity: 0.7 }}>
                Per Night
              </p>
            </div>
            <div className="text-center">
              <p className="font-poppins text-2xl mb-1" style={{ color: theme.colors.text }}>
                {venue?.maxGuests}
              </p>
              <p className="font-poppins text-sm" style={{ color: theme.colors.text, opacity: 0.7 }}>
                Max Guests
              </p>
            </div>
            <div className="text-center">
              <p className="font-poppins text-2xl mb-1" style={{ color: theme.colors.text }}>
                ${getTotalRevenue()}
              </p>
              <p className="font-poppins text-sm" style={{ color: theme.colors.text, opacity: 0.7 }}>
                Total Revenue
              </p>
            </div>
          </div>
        </div>

        {/* Current Bookings List */}
        {getCurrentBookings().length === 0 && getPastBookings().length === 0 ? (
          <div className="text-center py-12 rounded-lg" style={{ backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff' }}>
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
                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l6 6 6-6"
                />
              </svg>
            </div>
            <h3 className="font-poppins text-xl mb-2" style={{ color: theme.colors.text }}>
              No bookings yet
            </h3>
            <p className="font-poppins" style={{ color: theme.colors.text, opacity: 0.7 }}>
              Once guests book your venue, their reservations will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Current Bookings */}
            {getCurrentBookings().length > 0 && (
              <div className="space-y-4">
                <h2 className="font-poppins text-2xl mb-4" style={{ color: theme.colors.text }}>
                  Current Bookings ({getCurrentBookings().length})
                </h2>
                
                {getCurrentBookings().map((booking) => (
              <div
                key={booking.id}
                className="rounded-lg p-6 transition-colors"
                style={{ backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff' }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Guest Information */}
                  <div>
                    <h4 className="font-poppins text-lg mb-2" style={{ color: theme.colors.text }}>
                      Guest Details
                    </h4>
                    <div className="space-y-1">
                      {booking.customer?.name ? (
                        <Link
                          to={`/profile/${booking.customer.name}`}
                          className="font-poppins text-primary hover:text-opacity-80 transition-colors cursor-pointer"
                          style={{ color: theme.colors.primary || '#007bff' }}
                        >
                          {booking.customer.name}
                        </Link>
                      ) : (
                        <p className="font-poppins" style={{ color: theme.colors.text }}>
                          Guest Name
                        </p>
                      )}
                      <p className="font-poppins text-sm" style={{ color: theme.colors.text, opacity: 0.7 }}>
                        {booking.customer?.email || 'guest@email.com'}
                      </p>
                      <p className="font-poppins text-sm" style={{ color: theme.colors.text, opacity: 0.6 }}>
                        {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Booking Dates */}
                  <div>
                    <h4 className="font-poppins text-lg mb-2" style={{ color: theme.colors.text }}>
                      Booking Details
                    </h4>
                    <div className="space-y-1">
                      <p className="font-poppins text-sm" style={{ color: theme.colors.text, opacity: 0.7 }}>
                        <span className="font-medium">Check-in:</span> {formatDate(booking.dateFrom)}
                      </p>
                      <p className="font-poppins text-sm" style={{ color: theme.colors.text, opacity: 0.7 }}>
                        <span className="font-medium">Check-out:</span> {formatDate(booking.dateTo)}
                      </p>
                      <p className="font-poppins text-sm" style={{ color: theme.colors.text, opacity: 0.7 }}>
                        <span className="font-medium">Duration:</span> {calculateNights(booking.dateFrom, booking.dateTo)} night{calculateNights(booking.dateFrom, booking.dateTo) !== 1 ? 's' : ''}
                      </p>
                      <p className="font-poppins" style={{ color: theme.colors.text }}>
                        <span className="font-medium">Total:</span> ${calculateNights(booking.dateFrom, booking.dateTo) * venue.price}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-end justify-end">
                    <button
                      onClick={() => handleDeleteBooking(booking.id)}
                      className="px-4 py-2 bg-red-600 text-white font-poppins rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
                ))}
              </div>
            )}

            {/* Past Bookings */}
            {getPastBookings().length > 0 && (
              <div className="space-y-4">
                <h2 className="font-poppins text-2xl mb-4" style={{ color: theme.colors.text }}>
                  Past Bookings ({getPastBookings().length})
                </h2>
                
                {getPastBookings().map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-lg p-4 transition-colors"
                    style={{ backgroundColor: isDarkMode ? '#4b5563' : '#f9fafb' }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Guest Name */}
                      <div>
                        {booking.customer?.name ? (
                          <Link
                            to={`/profile/${booking.customer.name}`}
                            className="font-poppins text-primary hover:text-opacity-80 transition-colors cursor-pointer"
                            style={{ color: theme.colors.primary || '#007bff' }}
                          >
                            {booking.customer.name}
                          </Link>
                        ) : (
                          <p className="font-poppins" style={{ color: theme.colors.text }}>
                            Guest Name
                          </p>
                        )}
                      </div>

                      {/* Booking Dates */}
                      <div>
                        <p className="font-poppins text-sm" style={{ color: theme.colors.text, opacity: 0.7 }}>
                          {formatDate(booking.dateFrom)} - {formatDate(booking.dateTo)}
                        </p>
                        <p className="font-poppins text-xs" style={{ color: theme.colors.text, opacity: 0.6 }}>
                          {calculateNights(booking.dateFrom, booking.dateTo)} night{calculateNights(booking.dateFrom, booking.dateTo) !== 1 ? 's' : ''} • {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-poppins" style={{ color: theme.colors.text }}>
                          ${calculateNights(booking.dateFrom, booking.dateTo) * venue.price}
                        </p>
                        <p className="font-poppins text-xs" style={{ color: theme.colors.text, opacity: 0.6 }}>
                          Total paid
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={confirmDeleteBooking}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone and the guest will need to be notified separately."
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
      />
    </div>
  );
};

export default ManageVenuePage;