import React, { useState } from "react";
import { bookingsAPI } from "../../api/bookings.js";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../UI/LoadingSpinner";
import ErrorMessage from "../UI/ErrorMessage";
import SuccessMessage from "../UI/SuccessMessage";

const BookingForm = ({ venue, onBookingSuccess }) => {
  const { isAuthenticated } = useAuth();
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
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="font-chivo text-xl text-white mb-4">Book This Venue</h3>
        <p className="font-lora text-gray-300 mb-4">
          Please sign up or log in to book this venue.
        </p>
        <a
          href="/auth"
          className="inline-block px-6 py-3 bg-primary text-white font-chivo rounded-lg hover:bg-opacity-90 transition-colors"
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
      console.error("Booking failed:", err);
      setError(err.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
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
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="font-chivo text-xl text-white mb-4">Book This Venue</h3>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="font-chivo text-lg text-white">${venue.price}</span>
          <span className="font-lora text-gray-300 text-sm">per night</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="dateFrom"
            className="block font-lora text-sm text-gray-300 mb-2"
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
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary font-lora"
            required
          />
        </div>

        <div>
          <label
            htmlFor="dateTo"
            className="block font-lora text-sm text-gray-300 mb-2"
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
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary font-lora"
            required
          />
        </div>

        <div>
          <label
            htmlFor="guests"
            className="block font-lora text-sm text-gray-300 mb-2"
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
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary font-lora"
            required
          />
          <p className="font-lora text-gray-400 text-xs mt-1">
            Maximum {venue.maxGuests} guests allowed
          </p>
        </div>

        {totalPrice > 0 && (
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-lora text-gray-300">
                ${venue.price} x {nights} night{nights !== 1 ? "s" : ""}
              </span>
              <span className="font-lora text-white">${totalPrice}</span>
            </div>
            <div className="border-t border-gray-600 pt-2">
              <div className="flex justify-between items-center">
                <span className="font-chivo text-lg text-white">Total</span>
                <span className="font-chivo text-lg text-white">
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
          className="w-full px-6 py-3 bg-primary text-white font-chivo rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
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
