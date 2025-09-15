import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';

const AvailabilityCalendar = ({ venue, selectedDateFrom, selectedDateTo, onDateSelect }) => {
  const { theme, isDarkMode } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Helper function to check if a date is unavailable
  const isDateUnavailable = (date) => {
    if (!venue.bookings) return false;

    return venue.bookings.some(booking => {
      const bookingStart = new Date(booking.dateFrom);
      const bookingEnd = new Date(booking.dateTo);
      const checkDate = new Date(date);

      // Check if date falls within any booking range (inclusive)
      return checkDate >= bookingStart && checkDate < bookingEnd;
    });
  };

  // Helper function to check if date is in the past
  const isDateInPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Helper function to check if date is selected
  const isDateSelected = (date) => {
    if (!selectedDateFrom) return false;

    // Use local date formatting to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    if (!selectedDateTo) {
      return dateStr === selectedDateFrom;
    }

    // For date range comparison, use string comparison since we're using YYYY-MM-DD format
    return dateStr >= selectedDateFrom && dateStr <= selectedDateTo;
  };

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get starting day of week (0 = Sunday)
    const startDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentMonth]);

  const handleDateClick = (date) => {
    if (isDateInPast(date) || isDateUnavailable(date)) return;

    // Use local date formatting to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    onDateSelect(dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-2 rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer"
          style={{ backgroundColor: isDarkMode ? '#4b5563' : '#f3f4f6' }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>

        <h3 className="font-poppins text-lg" style={{ color: theme.colors.text }}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-2 rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer"
          style={{ backgroundColor: isDarkMode ? '#4b5563' : '#f3f4f6' }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div
            key={day}
            className="p-2 text-center font-poppins text-sm"
            style={{ color: theme.colors.text, opacity: 0.7 }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={index} className="p-2"></div>;
          }

          const isUnavailable = isDateUnavailable(date);
          const isPast = isDateInPast(date);
          const isSelected = isDateSelected(date);
          const isDisabled = isPast || isUnavailable;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
              className={`
                p-2 text-sm font-poppins rounded-lg transition-all duration-200 cursor-pointer
                ${isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-opacity-80'}
              `}
              style={{
                backgroundColor: isSelected
                  ? theme.colors.primary || '#007bff'
                  : isUnavailable
                    ? '#ef4444' // Red for booked dates
                    : isPast
                      ? isDarkMode ? '#374151' : '#e5e7eb' // Gray for past dates
                      : isDarkMode ? '#4b5563' : '#f9fafb', // Normal background
                color: isSelected
                  ? '#ffffff'
                  : isUnavailable
                    ? '#ffffff'
                    : theme.colors.text
              }}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs font-poppins">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span style={{ color: theme.colors.text, opacity: 0.7 }}>Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: theme.colors.primary || '#007bff' }}
          ></div>
          <span style={{ color: theme.colors.text, opacity: 0.7 }}>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' }}
          ></div>
          <span style={{ color: theme.colors.text, opacity: 0.7 }}>Past dates</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;