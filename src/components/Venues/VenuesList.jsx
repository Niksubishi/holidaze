import React, { useState, useEffect, memo, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { venuesAPI } from "../../api/venues.js";
import { useTheme } from "../../context/ThemeContext";
import { useLoading } from "../../context/LoadingContext";
import VenueCard from "./VenueCard";
import LoadingSpinner from "../UI/LoadingSpinner";
import SkeletonList from "../UI/SkeletonList";
import ErrorMessage from "../UI/ErrorMessage";

const VenuesList = memo(() => {
  const { theme, isDarkMode } = useTheme();
  const { setLoading, isLoading } = useLoading();
  const [searchParams, setSearchParams] = useSearchParams();
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [, setIsSearching] = useState(false);
  const debounceTimeoutRef = useRef(null);

  // Get state from URL params with fallbacks
  const searchQuery = searchParams.get("search") || "";
  const [localSearchValue, setLocalSearchValue] = useState(searchQuery);
  const sortBy = searchParams.get("sortBy") || "created";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const venuesPerPage = 12;

  const fetchVenues = useCallback(async (page = 1, isNewSearch = false) => {
    try {
      if (page === 1) setLoading('venues-list', true);

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

      if (isNewSearch || page === 1) {
        setVenues(response.data || []);
      } else {
        setVenues((prev) => [...prev, ...(response.data || [])]);
      }

      setHasMore(response.meta && !response.meta.isLastPage);

      setError("");
    } catch (err) {
      console.error("Failed to fetch venues:", err);
      setError(err.message || "Failed to load venues");
    } finally {
      setLoading('venues-list', false);
    }
  }, [searchQuery, sortBy, sortOrder, setLoading]);

  useEffect(() => {
    setCurrentPage(1);
    fetchVenues(1, true);
  }, [sortBy, sortOrder, searchQuery]);

  // Update URL params helper
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
    
    // Clear any pending debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    updateParams({
      search: "",
      sortBy: "created",
      sortOrder: "desc"
    });
  }, [updateParams]);

  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchVenues(nextPage, false);
  }, [currentPage, fetchVenues]);

  const handleSortChange = useCallback((newSort, newOrder = "desc") => {
    updateParams({
      sortBy: newSort,
      sortOrder: newOrder
    });
  }, [updateParams]);

  // Update local search value immediately for responsive UI
  const handleSearchInputChange = useCallback((value) => {
    setLocalSearchValue(value);
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    debounceTimeoutRef.current = setTimeout(() => {
      updateParams({
        search: value ? value.trim() : ""
      });
    }, 300); // 300ms debounce delay
  }, [updateParams]);
  
  // Sync local value when URL search param changes (for browser back/forward)
  useEffect(() => {
    setLocalSearchValue(searchQuery);
  }, [searchQuery]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Memoize sort button states to avoid recalculation
  const sortButtonStates = useMemo(() => ({
    newest: sortBy === "created" && sortOrder === "desc",
    oldest: sortBy === "created" && sortOrder === "asc",
    cheapest: sortBy === "price" && sortOrder === "asc",
    mostExpensive: sortBy === "price" && sortOrder === "desc",
    highestRated: sortBy === "rating" && sortOrder === "desc"
  }), [sortBy, sortOrder]);

  // Memoize inactive button styles
  const inactiveButtonStyle = useMemo(() => ({
    backgroundColor: isDarkMode ? "#132F3D" : "#f3f4f6",
    color: isDarkMode ? "#9ca3af" : theme.colors.text,
  }), [isDarkMode, theme.colors.text]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search and Filter Section */}
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

        {/* Sort Options */}
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
      </div>

      {/* Error Display */}
      {error && <ErrorMessage message={error} className="mb-6" />}

      {/* Loading Skeleton */}
      {isLoading('venues-list') && venues.length === 0 && (
        <SkeletonList count={8} />
      )}

      {/* Venues Grid */}
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

      {venues.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}

      {hasMore && venues.length > 0 && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoading('venues-list')}
            className="px-8 py-3 text-white font-poppins rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: theme.colors.primary }}
          >
            {isLoading('venues-list') ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="small" />
                <span>Loading...</span>
              </div>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}
    </div>
  );
});

// Add display name for better debugging
VenuesList.displayName = 'VenuesList';

export default VenuesList;
