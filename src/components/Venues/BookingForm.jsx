import React, { useState, useMemo, useCallback, memo } from "react";
import { bookingsAPI } from "../../api/bookings.js";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useLoading } from "../../context/LoadingContext";
import { useToast } from "../../context/ToastContext";
import LoadingSpinner from "../UI/LoadingSpinner";
import ErrorMessage from "../UI/ErrorMessage";
import AvailabilityCalendar from "../UI/AvailabilityCalendar";
import { getCardBackground, getInputBackground, getInputBorderColor, getInputTextColor, getSecondaryBackground } from "../../utils/theme.js";

const BookingForm = memo(({ venue, onBookingSuccess }) => {
  const { isAuthenticated } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const { setLoading, isLoading } = useLoading();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    dateFrom: "",
    dateTo: "",
    guests: 1,
  });
  const [error, setError] = useState("");

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

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  }, [error]);

  const handleCalendarDateSelect = useCallback((dateStr) => {
    if (!formData.dateFrom) {
      setFormData(prev => ({
        ...prev,
        dateFrom: dateStr,
        dateTo: ""
      }));
    } else if (!formData.dateTo) {
      const checkInDate = new Date(formData.dateFrom);
      const checkOutDate = new Date(dateStr);

      if (checkOutDate > checkInDate) {
        setFormData(prev => ({
          ...prev,
          dateTo: dateStr
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          dateFrom: dateStr,
          dateTo: ""
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        dateFrom: dateStr,
        dateTo: ""
      }));
    }

    if (error) setError("");
  }, [formData.dateFrom, formData.dateTo, error]);

  const pricingData = useMemo(() => {
    const { dateFrom, dateTo } = formData;
    if (!dateFrom || !dateTo) {
      return { totalPrice: 0, nights: 0 };
    }

    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    const diffTime = Math.abs(end - start);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = nights * venue.price;

    return { totalPrice, nights };
  }, [formData.dateFrom, formData.dateTo, venue.price]);

  const hasDateConflict = useCallback((checkInDate, checkOutDate) => {
    if (!venue.bookings) return false;

    const newStart = new Date(checkInDate);
    const newEnd = new Date(checkOutDate);

    return venue.bookings.some(booking => {
      const bookingStart = new Date(booking.dateFrom);
      const bookingEnd = new Date(booking.dateTo);

      return (newStart < bookingEnd && newEnd > bookingStart);
    });
  }, [venue.bookings]);

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

    setLoading('booking-form', true);
    setError("");

    try {
      const bookingData = {
        dateFrom: new Date(formData.dateFrom).toISOString(),
        dateTo: new Date(formData.dateTo).toISOString(),
        guests: parseInt(formData.guests),
        venueId: venue.id,
      };

      await bookingsAPI.create(bookingData);

      showSuccess("Booking created successfully! Check your bookings page for details.");
      setFormData({
        dateFrom: "",
        dateTo: "",
        guests: 1,
      });

      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to create booking";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading('booking-form', false);
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

  const unavailableDateRanges = useMemo(() => {
    if (!venue.bookings || venue.bookings.length === 0) return [];
    
    const today = new Date();
    return venue.bookings
      .filter(booking => new Date(booking.dateTo) > today)
      .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom))
      .slice(0, 5);
  }, [venue.bookings]);

  const { totalPrice, nights } = pricingData;

  return (
    <div className="p-6 rounded-lg" style={{ backgroundColor: getCardBackground(isDarkMode) }}>
      <h3 className="font-poppins text-xl mb-4" style={{ color: theme.colors.text }}>Book This Venue</h3>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="font-poppins text-lg" style={{ color: theme.colors.text }}>${venue.price}</span>
          <span className="font-poppins text-sm" style={{ color: theme.colors.text, opacity: 0.8 }}>per night</span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-poppins text-sm mb-3" style={{ color: theme.colors.text, opacity: 0.9 }}>
          Select Your Dates
        </h4>
        <AvailabilityCalendar
          venue={venue}
          selectedDateFrom={formData.dateFrom}
          selectedDateTo={formData.dateTo}
          onDateSelect={handleCalendarDateSelect}
        />
      </div>

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

        <button
          type="submit"
          disabled={isLoading('booking-form')}
          className="w-full px-6 py-3 bg-primary text-white font-poppins rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isLoading('booking-form') ? (
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
});

BookingForm.displayName = 'BookingForm';

export default BookingForm;
