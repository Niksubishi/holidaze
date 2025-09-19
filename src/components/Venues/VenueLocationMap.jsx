import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useTheme } from "../../context/ThemeContext";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});


const getLocationCoordinates = (location) => {
  
  const countryCoords = {
    'Norway': { lat: 60.472, lng: 8.4689 },
    'Denmark': { lat: 56.2639, lng: 9.5018 },
    'Sweden': { lat: 60.1282, lng: 18.6435 },
    'United States': { lat: 39.8283, lng: -98.5795 },
    'USA': { lat: 39.8283, lng: -98.5795 },
    'United Kingdom': { lat: 55.3781, lng: -3.4360 },
    'UK': { lat: 55.3781, lng: -3.4360 },
    'France': { lat: 46.2276, lng: 2.2137 },
    'Germany': { lat: 51.1657, lng: 10.4515 },
    'Spain': { lat: 40.4637, lng: -3.7492 },
    'Italy': { lat: 41.8719, lng: 12.5674 },
    'Netherlands': { lat: 52.1326, lng: 5.2913 },
    'Bahamas': { lat: 25.0343, lng: -77.3963 },
    'Canada': { lat: 56.1304, lng: -106.3468 },
    'Australia': { lat: -25.2744, lng: 133.7751 },
    'Japan': { lat: 36.2048, lng: 138.2529 },
    'Iceland': { lat: 64.9631, lng: -19.0208 },
    'Finland': { lat: 61.9241, lng: 25.7482 }
  };

  
  const cityCoords = {
    
    'Oslo': { lat: 59.9139, lng: 10.7522 },
    'Bergen': { lat: 60.3913, lng: 5.3221 },
    'Stavanger': { lat: 58.9700, lng: 5.7331 },
    'Trondheim': { lat: 63.4305, lng: 10.3951 },
    
    
    'Copenhagen': { lat: 55.6761, lng: 12.5683 },
    'Aarhus': { lat: 56.1629, lng: 10.2039 },
    'Odense': { lat: 55.4038, lng: 10.4024 },
    
    
    'Stockholm': { lat: 59.3293, lng: 18.0686 },
    'Gothenburg': { lat: 57.7089, lng: 11.9746 },
    'Malmö': { lat: 55.6050, lng: 13.0038 },
    
    
    'New York': { lat: 40.7128, lng: -74.0060 },
    'Los Angeles': { lat: 34.0522, lng: -118.2437 },
    'Chicago': { lat: 41.8781, lng: -87.6298 },
    'Miami': { lat: 25.7617, lng: -80.1918 },
    'San Francisco': { lat: 37.7749, lng: -122.4194 },
    'Las Vegas': { lat: 36.1699, lng: -115.1398 },
    'Orlando': { lat: 28.5383, lng: -81.3792 },
    'Boston': { lat: 42.3601, lng: -71.0589 },
    
    
    'London': { lat: 51.5074, lng: -0.1278 },
    'Manchester': { lat: 53.4808, lng: -2.2426 },
    'Birmingham': { lat: 52.4862, lng: -1.8904 },
    'Edinburgh': { lat: 55.9533, lng: -3.1883 },
    'Glasgow': { lat: 55.8642, lng: -4.2518 },
    
    
    'Berlin': { lat: 52.5200, lng: 13.4050 },
    'Munich': { lat: 48.1351, lng: 11.5820 },
    'Hamburg': { lat: 53.5511, lng: 9.9937 },
    'Frankfurt': { lat: 50.1109, lng: 8.6821 },
    
    
    'Paris': { lat: 48.8566, lng: 2.3522 },
    'Lyon': { lat: 45.7640, lng: 4.8357 },
    'Marseille': { lat: 43.2965, lng: 5.3698 },
    'Nice': { lat: 43.7102, lng: 7.2620 },
    
    
    'Madrid': { lat: 40.4168, lng: -3.7038 },
    'Barcelona': { lat: 41.3874, lng: 2.1686 },
    'Valencia': { lat: 39.4699, lng: -0.3763 },
    'Seville': { lat: 37.3886, lng: -5.9823 },
    
    
    'Rome': { lat: 41.9028, lng: 12.4964 },
    'Milan': { lat: 45.4642, lng: 9.1900 },
    'Venice': { lat: 45.4408, lng: 12.3155 },
    'Florence': { lat: 43.7696, lng: 11.2558 },
    'Naples': { lat: 40.8518, lng: 14.2681 },
    
    
    'Amsterdam': { lat: 52.3676, lng: 4.9041 },
    'Rotterdam': { lat: 51.9225, lng: 4.4792 },
    'The Hague': { lat: 52.0705, lng: 4.3007 },
    
    
    'Nassau': { lat: 25.0343, lng: -77.3963 },
    
    
    'Toronto': { lat: 43.6532, lng: -79.3832 },
    'Vancouver': { lat: 49.2827, lng: -123.1207 },
    'Montreal': { lat: 45.5017, lng: -73.5673 },
    'Calgary': { lat: 51.0447, lng: -114.0719 },
    
    
    'Sydney': { lat: -33.8688, lng: 151.2093 },
    'Melbourne': { lat: -37.8136, lng: 144.9631 },
    'Brisbane': { lat: -27.4698, lng: 153.0251 },
    'Perth': { lat: -31.9505, lng: 115.8605 },
    
    
    'Tokyo': { lat: 35.6762, lng: 139.6503 },
    'Osaka': { lat: 34.6937, lng: 135.5023 },
    'Kyoto': { lat: 35.0116, lng: 135.7681 },
    
    
    'Reykjavik': { lat: 64.1466, lng: -21.9426 }
  };

  
  if (location.city) {
    const cityKey = location.city;
    if (cityCoords[cityKey]) {
      return { ...cityCoords[cityKey], accuracy: 'city', source: `${cityKey} city center` };
    }
  }

  
  if (location.country) {
    const countryKey = location.country;
    if (countryCoords[countryKey]) {
      return { ...countryCoords[countryKey], accuracy: 'country', source: `${countryKey} center` };
    }
  }

  return null;
};

const VenueLocationMap = ({ venue }) => {
  const { theme } = useTheme();

  
  const mapCoordinates = useMemo(() => {
    if (!venue?.location) {
      return null;
    }

    
    if (venue.location.lat && venue.location.lng && 
        venue.location.lat !== 0 && venue.location.lng !== 0 &&
        typeof venue.location.lat === 'number' && 
        typeof venue.location.lng === 'number') {
      return {
        lat: venue.location.lat,
        lng: venue.location.lng,
        accuracy: 'exact',
        zoom: 14,
        source: 'Exact coordinates'
      };
    }

    
    const locationCoords = getLocationCoordinates(venue.location);
    if (locationCoords) {
      return {
        lat: locationCoords.lat,
        lng: locationCoords.lng,
        accuracy: locationCoords.accuracy,
        zoom: locationCoords.accuracy === 'city' ? 11 : 6,
        source: locationCoords.source
      };
    }

    return null;
  }, [venue]);

  
  const locationText = useMemo(() => {
    if (!venue?.location) return "Location unavailable";

    const parts = [];
    if (venue.location.address) parts.push(venue.location.address);
    if (venue.location.city) parts.push(venue.location.city);
    if (venue.location.zip) parts.push(venue.location.zip);
    if (venue.location.country) parts.push(venue.location.country);
    
    return parts.length > 0 ? parts.join(', ') : "Location unavailable";
  }, [venue]);

  if (!mapCoordinates) {
    return (
      <div className="w-full h-48 rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="font-poppins text-sm text-gray-600">
            {locationText}
          </p>
          <p className="font-poppins text-xs text-gray-400 mt-1">
            Map unavailable
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full h-48 rounded-lg overflow-hidden relative">
        <MapContainer
          center={[mapCoordinates.lat, mapCoordinates.lng]}
          zoom={mapCoordinates.zoom}
          style={{ height: "100%", width: "100%" }}
          className="leaflet-container"
          scrollWheelZoom={true}
          dragging={true}
          touchZoom={true}
          doubleClickZoom={true}
          boxZoom={true}
          keyboard={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={[mapCoordinates.lat, mapCoordinates.lng]} />
        </MapContainer>

        
        {mapCoordinates.accuracy !== 'exact' && (
          <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-poppins ${
            mapCoordinates.accuracy === 'city' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {mapCoordinates.accuracy === 'city' ? 'City center' : 'Approximate location'}
          </div>
        )}
      </div>
      
      
      <div className="mt-2 text-center">
        <p className="font-poppins text-sm" style={{ color: theme.colors.text }}>
          {locationText}
        </p>
        <p className="font-poppins text-xs opacity-70 mt-1" style={{ color: theme.colors.text }}>
          {mapCoordinates.accuracy === 'exact' && 'Exact location'}
          {mapCoordinates.accuracy === 'city' && `Showing ${mapCoordinates.source}`}
          {mapCoordinates.accuracy === 'country' && `Showing ${mapCoordinates.source} - exact address not available`}
        </p>
      </div>
    </div>
  );
};

export default VenueLocationMap;