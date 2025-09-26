import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { venuesAPI } from "../api/venues.js";
import { bookingsAPI } from "../api/bookings.js";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import ConfirmationModal from "../components/UI/ConfirmationModal";
import { getMainCardBackground, getSecondaryBackground } from "../utils/theme.js";

const ManageVenuePage = () => {
  const { id: venueId } = useParams();
  const { user } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pastBookingsToShow, setPastBookingsToShow] = useState(4);
  const { showSuccess } = useToast();
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
        
        
        if (venueData.owner.name !== user.name) {
          setError("You don't have permission to manage this venue");
          setLoading(false);
          return;
        }
        
        setVenue(venueData);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load venue");
      } finally {
        setLoading(false);
      }
    };

    if (venueId && user) {
      fetchVenue();
    } else if (venueId && !user) {
      
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
      
      
      setVenue(prev => ({
        ...prev,
        bookings: prev.bookings.filter(booking => booking.id !== bookingToDelete)
      }));
      
      showSuccess("Booking cancelled successfully!");
      setShowConfirmModal(false);
      setBookingToDelete(null);
    } catch (err) {
      setError(err.message || "Failed to cancel booking");
      setShowConfirmModal(false);
      setBookingToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setBookingToDelete(null);
  };

  const handleLoadMorePastBookings = () => {
    setPastBookingsToShow(prev => prev + 4);
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
    const allPastBookings = venue.bookings
      .filter(booking => isBookingPast(booking))
      .sort((a, b) => new Date(b.dateFrom) - new Date(a.dateFrom)); 
    return allPastBookings.slice(0, pastBookingsToShow);
  };

  const getTotalPastBookings = () => {
    if (!venue?.bookings) return 0;
    return venue.bookings.filter(booking => isBookingPast(booking)).length;
  };

  const hasMorePastBookings = () => {
    if (!venue?.bookings) return false;
    const totalPast = venue.bookings.filter(booking => isBookingPast(booking)).length;
    return totalPast > pastBookingsToShow;
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

        
        <div className="rounded-lg p-6 mb-8" style={{ backgroundColor: getMainCardBackground(isDarkMode) }}>
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

        
        {getCurrentBookings().length === 0 && getPastBookings().length === 0 ? (
          <div className="text-center py-12 rounded-lg" style={{ backgroundColor: getMainCardBackground(isDarkMode) }}>
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
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
            
            {getCurrentBookings().length > 0 && (
              <div className="space-y-4">
                <h2 className="font-poppins text-2xl mb-4" style={{ color: theme.colors.text }}>
                  Current Bookings ({getCurrentBookings().length})
                </h2>
                
                {getCurrentBookings().map((booking) => (
              <div
                key={booking.id}
                className="rounded-lg p-6 transition-colors"
                style={{ backgroundColor: getMainCardBackground(isDarkMode) }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
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

            
            {getTotalPastBookings() > 0 && (
              <div className="space-y-4">
                <h2 className="font-poppins text-2xl mb-4" style={{ color: theme.colors.text }}>
                  Past Bookings ({getTotalPastBookings()})
                </h2>
                
                {getPastBookings().map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-lg p-4 transition-colors"
                    style={{ backgroundColor: getSecondaryBackground(isDarkMode) }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
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

                      
                      <div>
                        <p className="font-poppins text-sm" style={{ color: theme.colors.text, opacity: 0.7 }}>
                          {formatDate(booking.dateFrom)} - {formatDate(booking.dateTo)}
                        </p>
                        <p className="font-poppins text-xs" style={{ color: theme.colors.text, opacity: 0.6 }}>
                          {calculateNights(booking.dateFrom, booking.dateTo)} night{calculateNights(booking.dateFrom, booking.dateTo) !== 1 ? 's' : ''} • {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                        </p>
                      </div>

                      
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

                
                {hasMorePastBookings() && (
                  <div className="text-center mt-6">
                    <button
                      onClick={handleLoadMorePastBookings}
                      className="px-6 py-3 text-white font-poppins rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      Load More Past Bookings
                    </button>
                  </div>
                )}
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