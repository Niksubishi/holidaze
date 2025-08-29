import React from "react";
import { useTheme } from "../context/ThemeContext";
import VenuesList from "../components/Venues/VenuesList";

const VenuesPage = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <h1 className="font-poppins text-3xl md:text-4xl text-center mb-2" style={{ color: theme.colors.text }}>
            Find Your Perfect Stay
          </h1>
          <p className="font-poppins text-center text-lg" style={{ color: theme.colors.text }}>
            Discover amazing venues for your next holiday
          </p>
        </div>

        <VenuesList />
      </div>
    </div>
  );
};

export default VenuesPage;
