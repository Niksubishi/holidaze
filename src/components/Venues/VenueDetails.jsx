import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BookingForm from "./BookingForm";

const VenueDetails = ({ venue, onBookingSuccess }) => {
  const defaultImage = "/images/placeholder-venue.jpg";
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleOwnerClick = (ownerName) => {
    if (!isAuthenticated) {
      navigate('/auth');
    } else {
      navigate(`/profile/${ownerName}`);
    }
  };

  const formatLocation = () => {
    const { location } = venue;
    if (!location) return "Location not specified";

    const parts = [];
    if (location.address) parts.push(location.address);
    if (location.city) parts.push(location.city);
    if (location.country) parts.push(location.country);

    return parts.length > 0 ? parts.join(", ") : "Location not specified";
  };

  const renderAmenities = () => {
    if (!venue.meta) return null;

    const amenities = [];
    if (venue.meta.wifi) amenities.push({ name: "WiFi", icon: "📶" });
    if (venue.meta.parking) amenities.push({ name: "Parking", icon: "🚗" });
    if (venue.meta.breakfast) amenities.push({ name: "Breakfast", icon: "🍳" });
    if (venue.meta.pets) amenities.push({ name: "Pets allowed", icon: "🐕" });

    if (amenities.length === 0) {
      return (
        <div className="mb-6">
          <h3 className="font-chivo text-lg text-white mb-3">Amenities</h3>
          <p className="font-lora text-gray-400">
            No specific amenities listed
          </p>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <h3 className="font-chivo text-lg text-white mb-3">Amenities</h3>
        <div className="grid grid-cols-2 gap-3">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-lg">{amenity.icon}</span>
              <span className="font-lora text-gray-300">{amenity.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderImageGallery = () => {
    const images =
      venue.media && venue.media.length > 0
        ? venue.media
        : [{ url: defaultImage, alt: venue.name }];

    return (
      <div className="mb-6">
        <div className="aspect-video w-full overflow-hidden rounded-lg mb-4">
          <img
            src={images[selectedImageIndex].url}
            alt={images[selectedImageIndex].alt || venue.name}
            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <div
                key={index}
                className={`aspect-square overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedImageIndex === index
                    ? "ring-2 ring-primary scale-105"
                    : "hover:scale-105 hover:opacity-80"
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={image.url}
                  alt={image.alt || `${venue.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderImageModal = () => {
    if (!isModalOpen) return null;

    const images =
      venue.media && venue.media.length > 0
        ? venue.media
        : [{ url: defaultImage, alt: venue.name }];

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
        onClick={() => setIsModalOpen(false)}
      >
        <div className="relative max-w-4xl max-h-full">
          <img
            src={images[selectedImageIndex].url}
            alt={images[selectedImageIndex].alt || venue.name}
            className="max-w-full max-h-full object-contain"
          />
          
          {/* Close button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Navigation arrows for multiple images */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1);
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderOwnerInfo = () => {
    if (!venue.owner) return null;

    return (
      <div className="mb-6 bg-gray-800 p-4 rounded-lg">
        <h3 className="font-chivo text-lg text-white mb-3">Hosted by</h3>
        <div className="flex items-center space-x-3">
          {venue.owner.avatar?.url ? (
            <img
              src={venue.owner.avatar.url}
              alt={venue.owner.avatar.alt || venue.owner.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <span className="font-chivo text-white text-lg">
                {venue.owner.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <button
              onClick={() => handleOwnerClick(venue.owner.name)}
              className="font-chivo text-white hover:text-primary transition-colors cursor-pointer"
            >
              {venue.owner.name}
            </button>
            {venue.owner.bio && (
              <p className="font-lora text-gray-300 text-sm mt-1">
                {venue.owner.bio}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images and Details */}
          <div>
            {renderImageGallery()}

            <div className="mb-6">
              <h1 className="font-chivo text-3xl text-white mb-2">
                {venue.name}
              </h1>

              <div className="flex items-center justify-between mb-4">
                <p className="font-lora text-gray-300">{formatLocation()}</p>
                {venue.rating > 0 && (
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-yellow-400 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-lora text-white">
                      {venue.rating.toFixed(1)} ({venue._count?.bookings || 0}{" "}
                      reviews)
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <span className="font-lora text-gray-300">
                  Max {venue.maxGuests} guest{venue.maxGuests !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Description */}
            {venue.description && (
              <div className="mb-6">
                <h3 className="font-chivo text-lg text-white mb-3">
                  About this venue
                </h3>
                <p className="font-lora text-gray-300 leading-relaxed">
                  {venue.description}
                </p>
              </div>
            )}

            {renderAmenities()}
            {renderOwnerInfo()}
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <BookingForm venue={venue} onBookingSuccess={onBookingSuccess} />
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {renderImageModal()}
    </>
  );
};

export default VenueDetails;
