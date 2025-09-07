import React, { useState } from "react";
import { bookingsAPI } from "../../api/bookings.js";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../UI/LoadingSpinner";
import ErrorMessage from "../UI/ErrorMessage";
import SuccessMessage from "../UI/SuccessMessage";
import { getCardBackground, getInputBackground, getInputBorderColor, getInputTextColor, getSecondaryBackground } from "../../utils/theme.js";

const BookingForm = ({ venue, onBookingSuccess }) => {
  const { isAuthenticated } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    dateFrom: "",
    dateTo: "",
    guests: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="p-6 rounded-lg" style={{ backgroundColor: getCardBackground(isDarkMode) }}>
        <h3 className="font-poppins text-xl mb-4" style={{ color: theme.colors.text }}>Book This Venue</h3>
        <p className="font-poppins mb-4" style={{ color: theme.colors.text, opacity: 0.8 }}>
          Please sign up or log in to book this venue.
        </p>
        <a
          href="/auth"
          className="inline-block px-6 py-3 bg-primary text-white font-poppins rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Sign Up / Login
        </a>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const calculateTotalPrice = () => {
    const { dateFrom, dateTo } = formData;
    if (!dateFrom || !dateTo) return 0;

    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays * venue.price;
  };

  // Check if a date range overlaps with any existing bookings
  const hasDateConflict = (checkInDate, checkOutDate) => {
    if (!venue.bookings) return false;

    const newStart = new Date(checkInDate);
    const newEnd = new Date(checkOutDate);

    return venue.bookings.some(booking => {
      const bookingStart = new Date(booking.dateFrom);
      const bookingEnd = new Date(booking.dateTo);

      // Check if dates overlap (including touching dates)
      return (newStart < bookingEnd && newEnd > bookingStart);
    });
  };

  const validateForm = () => {
    const { dateFrom, dateTo, guests } = formData;

    if (!dateFrom || !dateTo) {
      setError("Please select check-in and check-out dates");
      return false;
    }

    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      setError("Check-in date cannot be in the past");
      return false;
    }

    if (start >= end) {
      setError("Check-out date must be after check-in date");
      return false;
    }

    // Check for booking conflicts
    if (hasDateConflict(dateFrom, dateTo)) {
      setError("Selected dates conflict with existing bookings. Please choose different dates.");
      return false;
    }

    if (guests < 1 || guests > venue.maxGuests) {
      setError(`Number of guests must be between 1 and ${venue.maxGuests}`);
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
      const bookingData = {
        dateFrom: new Date(formData.dateFrom).toISOString(),
        dateTo: new Date(formData.dateTo).toISOString(),
        guests: parseInt(formData.guests),
        venueId: venue.id,
      };

      await bookingsAPI.create(bookingData);

      setSuccess("Booking created successfully!");
      setFormData({
        dateFrom: "",
        dateTo: "",
        guests: 1,
      });

      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (err) {
      setError(err.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const formatDateRange = (dateFrom, dateTo) => {
    const start = new Date(dateFrom).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    const end = new Date(dateTo).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    return `${start} - ${end}`;
  };

  const getUnavailableDateRanges = () => {
    if (!venue.bookings || venue.bookings.length === 0) return [];
    
    const today = new Date();
    return venue.bookings
      .filter(booking => new Date(booking.dateTo) > today) // Only future/current bookings
      .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom))
      .slice(0, 5); // Show max 5 upcoming bookings
  };

  const totalPrice = calculateTotalPrice();
  const nights =
    totalPrice > 0
      ? Math.ceil(
          Math.abs(new Date(formData.dateTo) - new Date(formData.dateFrom)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  return (
    <div className="p-6 rounded-lg" style={{ backgroundColor: getCardBackground(isDarkMode) }}>
      <h3 className="font-poppins text-xl mb-4" style={{ color: theme.colors.text }}>Book This Venue</h3>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="font-poppins text-lg" style={{ color: theme.colors.text }}>${venue.price}</span>
          <span className="font-poppins text-sm" style={{ color: theme.colors.text, opacity: 0.8 }}>per night</span>
        </div>
      </div>

      {/* Unavailable Dates Display */}
      {getUnavailableDateRanges().length > 0 && (
        <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? '#4b5563' : '#fef3c7' }}>
          <h4 className="font-poppins text-sm mb-2" style={{ color: theme.colors.text, opacity: 0.9 }}>
            Unavailable Dates
          </h4>
          <div className="space-y-1">
            {getUnavailableDateRanges().map((booking, index) => (
              <div key={booking.id || index} className="font-poppins text-xs" style={{ color: theme.colors.text, opacity: 0.7 }}>
                {formatDateRange(booking.dateFrom, booking.dateTo)}
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="dateFrom"
            className="block font-poppins text-sm mb-2"
            style={{ color: theme.colors.text, opacity: 0.8 }}
          >
            Check-in Date
          </label>
          <input
            type="date"
            id="dateFrom"
            name="dateFrom"
            value={formData.dateFrom}
            onChange={handleInputChange}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2 rounded-lg focus:outline-none font-poppins"
            style={{
              backgroundColor: getInputBackground(isDarkMode),
              borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
              color: isDarkMode ? '#ffffff' : '#132F3D'
            }}
            required
          />
        </div>

        <div>
          <label
            htmlFor="dateTo"
            className="block font-poppins text-sm mb-2"
            style={{ color: theme.colors.text, opacity: 0.8 }}
          >
            Check-out Date
          </label>
          <input
            type="date"
            id="dateTo"
            name="dateTo"
            value={formData.dateTo}
            onChange={handleInputChange}
            min={formData.dateFrom || new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2 rounded-lg focus:outline-none font-poppins"
            style={{
              backgroundColor: getInputBackground(isDarkMode),
              borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
              color: isDarkMode ? '#ffffff' : '#132F3D'
            }}
            required
          />
        </div>

        <div>
          <label
            htmlFor="guests"
            className="block font-poppins text-sm mb-2"
            style={{ color: theme.colors.text, opacity: 0.8 }}
          >
            Number of Guests
          </label>
          <input
            type="number"
            id="guests"
            name="guests"
            value={formData.guests}
            onChange={handleInputChange}
            min="1"
            max={venue.maxGuests}
            className="w-full px-3 py-2 rounded-lg focus:outline-none font-poppins"
            style={{
              backgroundColor: getInputBackground(isDarkMode),
              borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
              color: isDarkMode ? '#ffffff' : '#132F3D'
            }}
            required
          />
          <p className="font-poppins text-xs mt-1" style={{ color: theme.colors.text, opacity: 0.6 }}>
            Maximum {venue.maxGuests} guests allowed
          </p>
        </div>

        {totalPrice > 0 && (
          <div className="p-4 rounded-lg" style={{ backgroundColor: getSecondaryBackground(isDarkMode) }}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-poppins" style={{ color: theme.colors.text, opacity: 0.8 }}>
                ${venue.price} x {nights} night{nights !== 1 ? "s" : ""}
              </span>
              <span className="font-poppins" style={{ color: theme.colors.text }}>${totalPrice}</span>
            </div>
            <div className="border-t pt-2" style={{ borderColor: isDarkMode ? '#6b7280' : '#d1d5db' }}>
              <div className="flex justify-between items-center">
                <span className="font-poppins text-lg" style={{ color: theme.colors.text }}>Total</span>
                <span className="font-poppins text-lg" style={{ color: theme.colors.text }}>
                  ${totalPrice}
                </span>
              </div>
            </div>
          </div>
        )}

        <ErrorMessage message={error} />
        <SuccessMessage message={success} />

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-primary text-white font-poppins rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <LoadingSpinner size="small" />
              <span>Booking...</span>
            </div>
          ) : (
            "Book Now"
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
