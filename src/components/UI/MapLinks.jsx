import React, { memo, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getMapUrls } from '../../utils/mapLinks';

const MapLinks = memo(({ location, venueName, className = '' }) => {
  const { isDarkMode } = useTheme();

  
  const mapUrls = useMemo(() => {
    return getMapUrls(location, venueName);
  }, [location, venueName]);

  
  if (!mapUrls.google && !mapUrls.apple) {
    return null;
  }

  const buttonBaseStyle = {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    border: 'none',
    cursor: 'pointer'
  };

  const googleButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#4285F4',
    color: '#ffffff'
  };

  const appleButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: isDarkMode ? '#ffffff' : '#000000',
    color: isDarkMode ? '#000000' : '#ffffff'
  };

  
  const GoogleMapsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  );

  
  const AppleMapsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  );

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {mapUrls.google && (
        <a
          href={mapUrls.google}
          target="_blank"
          rel="noopener noreferrer"
          style={googleButtonStyle}
          className="font-poppins hover:opacity-90"
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(66, 133, 244, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <GoogleMapsIcon />
          Open in Google Maps
        </a>
      )}

      {mapUrls.apple && (
        <a
          href={mapUrls.apple}
          target="_blank"
          rel="noopener noreferrer"
          style={appleButtonStyle}
          className="font-poppins hover:opacity-90"
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = `0 4px 8px rgba(${isDarkMode ? '255, 255, 255' : '0, 0, 0'}, 0.3)`;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <AppleMapsIcon />
          Open in Apple Maps
        </a>
      )}
    </div>
  );
});

MapLinks.displayName = 'MapLinks';

export default MapLinks;