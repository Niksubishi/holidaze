import React, { useState, useEffect } from "react";
import { venuesAPI } from "../../api/venues.js";
import { useTheme } from "../../context/ThemeContext";
import VenueCard from "./VenueCard";
import LoadingSpinner from "../UI/LoadingSpinner";
import ErrorMessage from "../UI/ErrorMessage";

const VenuesList = () => {
  const { theme } = useTheme();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const venuesPerPage = 12;

  const fetchVenues = async (page = 1, isNewSearch = false) => {
    try {
      if (page === 1) setLoading(true);

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
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchVenues(1, true);
  }, [sortBy, sortOrder, searchQuery]);


  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    setIsSearching(false);
    setSortBy("created");
    setSortOrder("desc");
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchVenues(nextPage, false);
  };


  const handleSortChange = (newSort, newOrder = "desc") => {
    setSortBy(newSort);
    setSortOrder(newOrder);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search venues by name or location..."
                className={`w-full px-4 py-3 bg-transparent border rounded-lg focus:outline-none focus:border-primary font-poppins ${theme.isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
                style={{
                  borderColor: theme.isDarkMode ? '#6b7280' : '#d1d5db',
                  color: theme.colors.navLinks
                }}
              />
            </div>
            {searchQuery && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-4 py-3 font-poppins rounded-lg transition-colors"
                  style={{
                    backgroundColor: theme.isDarkMode ? '#4b5563' : '#e5e7eb',
                    color: theme.colors.navLinks
                  }}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSortChange("created", "desc")}
            className={`px-4 py-2 rounded-lg font-poppins text-sm transition-colors ${
              sortBy === "created" && sortOrder === "desc"
                ? "bg-primary text-white"
                : ""
            }`}
            style={
              sortBy === "created" && sortOrder === "desc"
                ? {}
                : {
                    backgroundColor: theme.isDarkMode ? '#374151' : '#f3f4f6',
                    color: theme.colors.navLinks
                  }
            }
          >
            Newest
          </button>
          <button
            onClick={() => handleSortChange("created", "asc")}
            className={`px-4 py-2 rounded-lg font-poppins text-sm transition-colors ${
              sortBy === "created" && sortOrder === "asc"
                ? "bg-primary text-white"
                : ""
            }`}
            style={
              sortBy === "created" && sortOrder === "asc"
                ? {}
                : {
                    backgroundColor: theme.isDarkMode ? '#374151' : '#f3f4f6',
                    color: theme.colors.navLinks
                  }
            }
          >
            Oldest
          </button>
          <button
            onClick={() => handleSortChange("price", "asc")}
            className={`px-4 py-2 rounded-lg font-poppins text-sm transition-colors ${
              sortBy === "price" && sortOrder === "asc"
                ? "bg-primary text-white"
                : ""
            }`}
            style={
              sortBy === "price" && sortOrder === "asc"
                ? {}
                : {
                    backgroundColor: theme.isDarkMode ? '#374151' : '#f3f4f6',
                    color: theme.colors.navLinks
                  }
            }
          >
            Cheapest
          </button>
          <button
            onClick={() => handleSortChange("price", "desc")}
            className={`px-4 py-2 rounded-lg font-poppins text-sm transition-colors ${
              sortBy === "price" && sortOrder === "desc"
                ? "bg-primary text-white"
                : ""
            }`}
            style={
              sortBy === "price" && sortOrder === "desc"
                ? {}
                : {
                    backgroundColor: theme.isDarkMode ? '#374151' : '#f3f4f6',
                    color: theme.colors.navLinks
                  }
            }
          >
            Most Expensive
          </button>
          <button
            onClick={() => handleSortChange("rating", "desc")}
            className={`px-4 py-2 rounded-lg font-poppins text-sm transition-colors ${
              sortBy === "rating" && sortOrder === "desc"
                ? "bg-primary text-white"
                : ""
            }`}
            style={
              sortBy === "rating" && sortOrder === "desc"
                ? {}
                : {
                    backgroundColor: theme.isDarkMode ? '#374151' : '#f3f4f6',
                    color: theme.colors.navLinks
                  }
            }
          >
            Highest Rated
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && <ErrorMessage message={error} className="mb-6" />}

      {/* Loading Spinner */}
      {loading && venues.length === 0 && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      )}

      {/* Venues Grid */}
      {!loading && venues.length === 0 && !error && (
        <div className="text-center py-12">
          <h3 className="font-poppins text-xl mb-2" style={{ color: theme.colors.text }}>
            No venues found
          </h3>
          <p className="font-poppins" style={{ color: theme.colors.text, opacity: 0.7 }}>
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

      {/* Load More Button */}
      {hasMore && venues.length > 0 && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-8 py-3 bg-primary text-white font-poppins rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            {loading ? (
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
};

export default VenuesList;
