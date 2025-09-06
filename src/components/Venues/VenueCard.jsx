import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import AmenityIcons from "../UI/AmenityIcons";

const VenueCard = ({ venue }) => {
  const { isAuthenticated } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const navigate = useNavigate();
  const defaultImage = "/images/default.jpg";
  const imageUrl = venue.media?.[0]?.url || defaultImage;
  const imageAlt = venue.media?.[0]?.alt || venue.name;

  const handleOwnerClick = (e, ownerName) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/auth");
    } else {
      navigate(`/profile/${ownerName}`);
    }
  };

  const formatLocation = () => {
    const { location } = venue;
    if (!location) return "Location not specified";

    const parts = [location.city, location.country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Location not specified";
  };

  const renderAmenities = () => {
    if (!venue.meta) return null;

    const greyColor = "#9ca3af";
    const amenities = [];
    if (venue.meta.wifi) amenities.push({ name: "WiFi", icon: "WiFi" });
    if (venue.meta.parking) amenities.push({ name: "Parking", icon: "Parking" });
    if (venue.meta.breakfast) amenities.push({ name: "Breakfast", icon: "Breakfast" });
    if (venue.meta.pets) amenities.push({ name: "Pets allowed", icon: "Pets" });

    if (amenities.length === 0) return null;

    return (
      <div className="mt-2">
        <div className="flex flex-wrap gap-2 items-center">
          {amenities.slice(0, 3).map((amenity, index) => {
            const IconComponent = AmenityIcons[amenity.icon];
            return (
              <div key={index} className="flex items-center space-x-1">
                <IconComponent size={14} color={greyColor} />
                <span
                  className="text-xs"
                  style={{ color: greyColor }}
                >
                  {amenity.name}
                </span>
              </div>
            );
          })}
          {amenities.length > 3 && (
            <span
              className="text-xs"
              style={{ color: theme.colors.text, opacity: 0.6 }}
            >
              +{amenities.length - 3} more
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Link
      to={`/venues/${venue.id}`}
      className="block rounded-lg overflow-hidden transition-colors group"
      style={{
        backgroundColor: isDarkMode ? "#3a3a3a" : "#ffffff",
        border: isDarkMode ? "none" : "none",
      }}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <h3
          className="font-poppins text-lg mb-2 line-clamp-2"
          style={{ color: theme.colors.text }}
        >
          {venue.name}
        </h3>

        <p
          className="font-poppins text-sm mb-2"
          style={{ color: theme.colors.text, opacity: 0.7 }}
        >
          {formatLocation()}
        </p>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span
              className="font-poppins text-xl"
              style={{ color: theme.colors.text }}
            >
              ${venue.price}
            </span>
            <span
              className="font-poppins text-sm ml-1"
              style={{ color: theme.colors.text, opacity: 0.7 }}
            >
              / night
            </span>
          </div>

          {venue.rating > 0 && (
            <div className="flex items-center">
              <svg
                className="h-4 w-4 text-yellow-400 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span
                className="font-poppins text-sm"
                style={{ color: theme.colors.text, opacity: 0.7 }}
              >
                {venue.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <p
          className="font-poppins text-xs mb-2"
          style={{ color: theme.colors.text, opacity: 0.6 }}
        >
          Max {venue.maxGuests} guest{venue.maxGuests !== 1 ? "s" : ""}
        </p>

        {venue.owner && (
          <div className="mb-2">
            <button
              onClick={(e) => handleOwnerClick(e, venue.owner.name)}
              className="font-poppins text-primary text-xs hover:text-opacity-80 transition-colors cursor-pointer"
            >
              Hosted by {venue.owner.name}
            </button>
          </div>
        )}

        {renderAmenities()}
      </div>
    </Link>
  );
};

export default VenueCard;
