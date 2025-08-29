import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const VenueCard = ({ venue }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const defaultImage = "/images/placeholder-venue.jpg";
  const imageUrl = venue.media?.[0]?.url || defaultImage;
  const imageAlt = venue.media?.[0]?.alt || venue.name;

  const handleOwnerClick = (e, ownerName) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/auth');
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

    const amenities = [];
    if (venue.meta.wifi) amenities.push("WiFi");
    if (venue.meta.parking) amenities.push("Parking");
    if (venue.meta.breakfast) amenities.push("Breakfast");
    if (venue.meta.pets) amenities.push("Pets allowed");

    if (amenities.length === 0) return null;

    return (
      <div className="mt-2">
        <div className="flex flex-wrap gap-1">
          {amenities.slice(0, 2).map((amenity, index) => (
            <span
              key={index}
              className="text-xs bg-primary text-white px-2 py-1 rounded-full"
            >
              {amenity}
            </span>
          ))}
          {amenities.length > 2 && (
            <span className="text-xs text-gray-300">
              +{amenities.length - 2} more
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Link
      to={`/venues/${venue.id}`}
      className="block bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors group"
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
        <h3 className="font-poppins text-lg text-white mb-2 line-clamp-2">
          {venue.name}
        </h3>

        <p className="font-poppins text-gray-300 text-sm mb-2">
          {formatLocation()}
        </p>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="font-poppins text-xl text-white">
              ${venue.price}
            </span>
            <span className="font-poppins text-gray-300 text-sm ml-1">
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
              <span className="font-poppins text-gray-300 text-sm">
                {venue.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <p className="font-poppins text-gray-400 text-xs mb-2">
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
