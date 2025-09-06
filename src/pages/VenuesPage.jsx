import React from "react";
import { useTheme } from "../context/ThemeContext";
import VenuesList from "../components/Venues/VenuesList";

const VenuesPage = () => {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="pt-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p
            className="font-poppins text-center text-lg"
            style={{ color: theme.colors.text }}
          >
            Discover amazing venues for your next holiday
          </p>
        </div>

        <VenuesList />
      </div>
    </div>
  );
};

export default VenuesPage;
