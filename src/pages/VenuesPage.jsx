import React from "react";
import { useTheme } from "../context/ThemeContext";
import VenuesList from "../components/Venues/VenuesList";
import AnimatedText from "../components/UI/AnimatedText";

const VenuesPage = () => {
  const { theme } = useTheme();

  const animatedTexts = [
    "Discover amazing venues for your next holiday",
    "Your dream venue is just a click away!",
    "Find the perfect escape for your getaway",
    "Unforgettable stays await your booking",
    "Book unique venues from around the world"
  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="pt-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <AnimatedText
            texts={animatedTexts}
            className="font-poppins text-center text-lg h-7"
            style={{ color: theme.colors.text }}
            interval={5000}
          />
        </div>

        <VenuesList />
      </div>
    </div>
  );
};

export default VenuesPage;
