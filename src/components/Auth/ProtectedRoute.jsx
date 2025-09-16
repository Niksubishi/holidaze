import React, { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useLoading } from "../../context/LoadingContext";

const ProtectedRoute = ({
  children,
  requireVenueManager = false,
  allowUnauthenticated = false,
  redirectTo = "/auth",
}) => {
  const { isAuthenticated, isVenueManager, loading } = useAuth();
  const { theme } = useTheme();
  const { isAnyLoading } = useLoading();
  const location = useLocation();

  // Memoize the loading component to avoid recreation
  const LoadingComponent = useMemo(
    () => (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="flex flex-col items-center space-y-4">
          <div
            className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300"
            style={{ borderTopColor: theme.colors.primary }}
          />
          <p
            className="font-poppins text-sm"
            style={{ color: theme.colors.text, opacity: 0.7 }}
          >
            Loading...
          </p>
        </div>
      </div>
    ),
    [theme.colors.background, theme.colors.primary, theme.colors.text]
  );

  if (loading || isAnyLoading()) {
    return LoadingComponent;
  }

  if (allowUnauthenticated) {
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requireVenueManager && !isVenueManager) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="text-center max-w-md">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              stroke="currentColor"
              style={{ color: theme.colors.text, opacity: 0.5 }}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m0 0v2m0-2h2m-2 0H8m4-7V6a3 3 0 00-3-3H7a3 3 0 00-3 3v4a1 1 0 001 1h10a1 1 0 001-1z"
              />
            </svg>
          </div>
          <h2
            className="font-poppins text-xl mb-2"
            style={{ color: theme.colors.text }}
          >
            Access Restricted
          </h2>
          <p
            className="font-poppins mb-6"
            style={{ color: theme.colors.text, opacity: 0.7 }}
          >
            This page requires venue manager permissions. Contact support to
            upgrade your account.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 font-poppins rounded-lg hover:bg-opacity-90 transition-colors"
            style={{
              backgroundColor: theme.colors.primary,
              color: "white",
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
