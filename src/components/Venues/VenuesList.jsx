import React, { useState, useEffect, memo, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { venuesAPI } from "../../api/venues.js";
import { useTheme } from "../../context/ThemeContext";
import { useLoading } from "../../context/LoadingContext";
import VenueCard from "./VenueCard";
import SkeletonList from "../UI/SkeletonList";
import ErrorMessage from "../UI/ErrorMessage";
import AmenityIcons from "../UI/AmenityIcons";

const VenuesList = memo(() => {
  const { theme, isDarkMode } = useTheme();
  const { setLoading, isLoading } = useLoading();
  const [searchParams, setSearchParams] = useSearchParams();
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [, setIsSearching] = useState(false);
  const [amenityFilters, setAmenityFilters] = useState({
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false
  });
  const debounceTimeoutRef = useRef(null);

  const searchQuery = searchParams.get("search") || "";
  const [localSearchValue, setLocalSearchValue] = useState(searchQuery);
  const sortBy = searchParams.get("sortBy") || "created";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const venuesPerPage = 12;

  const applyAmenityFilters = useCallback((venuesList) => {
    const hasActiveFilters = Object.values(amenityFilters).some(filter => filter);

    if (!hasActiveFilters) {
      return venuesList;
    }

    return venuesList.filter(venue => {
      if (!venue.meta) return false;

      if (amenityFilters.wifi && !venue.meta.wifi) return false;
      if (amenityFilters.parking && !venue.meta.parking) return false;
      if (amenityFilters.breakfast && !venue.meta.breakfast) return false;
      if (amenityFilters.pets && !venue.meta.pets) return false;

      return true;
    });
  }, [amenityFilters]);

  const fetchVenues = useCallback(async (page = 1) => {
    try {
      setLoading('venues-list', true);

      let response;
      if (searchQuery.trim()) {
        setIsSearching(true);
        response = await venuesAPI.search(
          searchQuery,
          page,
          venuesPerPage,
          sortBy,
          sortOrder
        );
      } else {
        setIsSearching(false);
        response = await venuesAPI.getAll(
          page,
          venuesPerPage,
          sortBy,
          sortOrder
        );
      }

      const apiVenues = response.data || [];
      setVenues(apiVenues);

          const filtered = applyAmenityFilters(apiVenues);
      setFilteredVenues(filtered);

      setTotalPages(response.meta?.pageCount || 0);

      setError("");
    } catch (err) {
      setError(err.message || "Failed to load venues");
    } finally {
      setLoading('venues-list', false);
    }
  }, [searchQuery, sortBy, sortOrder, setLoading, applyAmenityFilters]);

  useEffect(() => {
    setCurrentPage(1);
    fetchVenues(1);
  }, [sortBy, sortOrder, searchQuery]);

  useEffect(() => {
    fetchVenues(currentPage);
  }, [currentPage, fetchVenues]);

  useEffect(() => {
    const filtered = applyAmenityFilters(venues);
    setFilteredVenues(filtered);
  }, [venues, applyAmenityFilters]);

  const updateParams = useCallback((newParams) => {
    setSearchParams(prevParams => {
      const updatedParams = new URLSearchParams(prevParams);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          updatedParams.set(key, value);
        } else {
          updatedParams.delete(key);
        }
      });
      return updatedParams;
    });
  }, [setSearchParams]);

  const handleClearSearch = useCallback(() => {
    setCurrentPage(1);
    setIsSearching(false);
    setLocalSearchValue("");
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    updateParams({
      search: "",
      sortBy: "created",
      sortOrder: "desc"
    });
  }, [updateParams]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAmenityFilterChange = useCallback((amenity) => {
    setAmenityFilters(prev => ({
      ...prev,
      [amenity]: !prev[amenity]
    }));
  }, []);

  const handleSortChange = useCallback((newSort, newOrder = "desc") => {
    updateParams({
      sortBy: newSort,
      sortOrder: newOrder
    });
  }, [updateParams]);

  const handleSearchInputChange = useCallback((value) => {
    setLocalSearchValue(value);
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      updateParams({
        search: value ? value.trim() : ""
      });
    }, 300);
  }, [updateParams]);
  
  useEffect(() => {
    setLocalSearchValue(searchQuery);
  }, [searchQuery]);
  
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const sortButtonStates = useMemo(() => ({
    newest: sortBy === "created" && sortOrder === "desc",
    oldest: sortBy === "created" && sortOrder === "asc",
    cheapest: sortBy === "price" && sortOrder === "asc",
    mostExpensive: sortBy === "price" && sortOrder === "desc",
    highestRated: sortBy === "rating" && sortOrder === "desc"
  }), [sortBy, sortOrder]);

  const inactiveButtonStyle = useMemo(() => ({
    backgroundColor: isDarkMode ? "#132F3D" : "#f3f4f6",
    color: isDarkMode ? "#9ca3af" : theme.colors.text,
  }), [isDarkMode, theme.colors.text]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-6 w-full max-w-2xl">
          <div className="relative w-full">
            <input
              type="text"
              value={localSearchValue}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              placeholder="Search venues by name or location..."
              className="px-4 py-2 rounded-lg focus:outline-none font-poppins text-sm w-full max-w-2xl"
              style={{
                backgroundColor: "#ffffff",
                border: "none",
                color: "#000000",
              }}
            />
            {localSearchValue && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <svg
                  className="h-5 w-5"
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
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => handleSortChange("created", "desc")}
            className={`px-4 py-2 rounded-lg font-poppins text-sm transition-colors cursor-pointer ${
              sortButtonStates.newest ? "bg-primary text-white" : ""
            }`}
            style={sortButtonStates.newest ? {} : inactiveButtonStyle}
          >
            Newest
          </button>
          <button
            onClick={() => handleSortChange("created", "asc")}
            className={`px-4 py-2 rounded-lg font-poppins text-sm transition-colors cursor-pointer ${
              sortButtonStates.oldest ? "bg-primary text-white" : ""
            }`}
            style={sortButtonStates.oldest ? {} : inactiveButtonStyle}
          >
            Oldest
          </button>
          <button
            onClick={() => handleSortChange("price", "asc")}
            className={`px-4 py-2 rounded-lg font-poppins text-sm transition-colors cursor-pointer ${
              sortButtonStates.cheapest ? "bg-primary text-white" : ""
            }`}
            style={sortButtonStates.cheapest ? {} : inactiveButtonStyle}
          >
            Cheapest
          </button>
          <button
            onClick={() => handleSortChange("price", "desc")}
            className={`px-4 py-2 rounded-lg font-poppins text-sm transition-colors cursor-pointer ${
              sortButtonStates.mostExpensive ? "bg-primary text-white" : ""
            }`}
            style={sortButtonStates.mostExpensive ? {} : inactiveButtonStyle}
          >
            Most Expensive
          </button>
          <button
            onClick={() => handleSortChange("rating", "desc")}
            className={`px-4 py-2 rounded-lg font-poppins text-sm transition-colors cursor-pointer ${
              sortButtonStates.highestRated ? "bg-primary text-white" : ""
            }`}
            style={sortButtonStates.highestRated ? {} : inactiveButtonStyle}
          >
            Highest Rated
          </button>
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap gap-2 justify-center items-center">
            <span className="font-poppins text-sm mr-2" style={{ color: theme.colors.text }}>
              Filter by amenities:
            </span>
            {[
              { key: 'wifi', label: 'WiFi', component: AmenityIcons.WiFi },
              { key: 'parking', label: 'Parking', component: AmenityIcons.Parking },
              { key: 'breakfast', label: 'Breakfast', component: AmenityIcons.Breakfast },
              { key: 'pets', label: 'Pets allowed', component: AmenityIcons.Pets }
            ].map(({ key, label, component: IconComponent }) => (
              <label
                key={key}
                className="flex items-center space-x-1.5 cursor-pointer font-poppins text-xs px-2 py-1.5 rounded transition-colors"
                style={{
                  backgroundColor: amenityFilters[key] ? theme.colors.primary : (isDarkMode ? '#3a3a3a' : '#f3f4f6'),
                  color: amenityFilters[key] ? '#ffffff' : theme.colors.text,
                }}
              >
                <input
                  type="checkbox"
                  checked={amenityFilters[key]}
                  onChange={() => handleAmenityFilterChange(key)}
                  className="sr-only"
                />
                <IconComponent
                  size={14}
                  color={amenityFilters[key] ? '#ffffff' : (isDarkMode ? theme.colors.text : '#6D7588')}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          {Object.values(amenityFilters).some(filter => filter) && (
            <div className="mt-3 text-center">
              <span className="font-poppins text-xs px-3 py-1 rounded-full" style={{
                backgroundColor: isDarkMode ? '#3a3a3a' : '#f3f4f6',
                color: theme.colors.text
              }}>
                {filteredVenues.length} of {venues.length} venues match your filters
              </span>
            </div>
          )}
        </div>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      {isLoading('venues-list') && venues.length === 0 && (
        <SkeletonList count={8} />
      )}

      {!isLoading('venues-list') && venues.length === 0 && !error && (
        <div className="text-center py-12">
          <h3
            className="font-poppins text-xl mb-2"
            style={{ color: theme.colors.text }}
          >
            No venues found
          </h3>
          <p
            className="font-poppins"
            style={{ color: theme.colors.text, opacity: 0.7 }}
          >
            {searchQuery
              ? "Try adjusting your search terms."
              : "No venues are available at the moment."}
          </p>
        </div>
      )}

      {!isLoading('venues-list') && venues.length > 0 && filteredVenues.length === 0 && (
        <div className="text-center py-12">
          <h3
            className="font-poppins text-xl mb-2"
            style={{ color: theme.colors.text }}
          >
            No venues match your filters
          </h3>
          <p
            className="font-poppins"
            style={{ color: theme.colors.text, opacity: 0.7 }}
          >
            Try removing some amenity filters or search different terms.
          </p>
        </div>
      )}

      {filteredVenues.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}

      {totalPages > 1 && filteredVenues.length > 0 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg font-poppins text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: currentPage === 1 ? inactiveButtonStyle.backgroundColor : theme.colors.primary,
              color: currentPage === 1 ? inactiveButtonStyle.color : "#ffffff",
            }}
          >
            ← Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
            const showPage =
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

            const showEllipsisBefore = pageNum === currentPage - 2 && currentPage > 4;
            const showEllipsisAfter = pageNum === currentPage + 2 && currentPage < totalPages - 3;

            return (
              <React.Fragment key={pageNum}>
                {showEllipsisBefore && (
                  <span className="px-2 py-2 font-poppins text-sm" style={{ color: theme.colors.text }}>
                    ...
                  </span>
                )}

                {showPage && (
                  <button
                    onClick={() => handlePageChange(pageNum)}
                    className="px-3 py-2 rounded-lg font-poppins text-sm transition-colors cursor-pointer min-w-[40px]"
                    style={{
                      backgroundColor: currentPage === pageNum ? theme.colors.primary : inactiveButtonStyle.backgroundColor,
                      color: currentPage === pageNum ? "#ffffff" : inactiveButtonStyle.color,
                    }}
                  >
                    {pageNum}
                  </button>
                )}

                {showEllipsisAfter && (
                  <span className="px-2 py-2 font-poppins text-sm" style={{ color: theme.colors.text }}>
                    ...
                  </span>
                )}
              </React.Fragment>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg font-poppins text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: currentPage === totalPages ? inactiveButtonStyle.backgroundColor : theme.colors.primary,
              color: currentPage === totalPages ? inactiveButtonStyle.color : "#ffffff",
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
});

VenuesList.displayName = 'VenuesList';

export default VenuesList;
