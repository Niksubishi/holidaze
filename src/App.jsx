import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Layout from "./components/Layout/Layout";

// Pages
import Home from "./pages/Home";
import VenuesPage from "./pages/VenuesPage";
import VenueDetailsPage from "./pages/VenueDetailsPage";
import AuthPage from "./pages/AuthPage";
import MyBookings from "./pages/MyBookings";
import MyVenues from "./pages/MyVenues";
import CreateVenuePage from "./pages/CreateVenuePage";
import EditVenuePage from "./pages/EditVenuePage";
import ManageVenuePage from "./pages/ManageVenuePage";
import ProfilePage from "./pages/ProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import NotFound from "./pages/NotFound";

// Protected Route Component
const ProtectedRoute = ({ children, requireVenueManager = false }) => {
  const { isAuthenticated, isVenueManager, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300" style={{ borderTopColor: theme.colors.primary }}></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requireVenueManager && !isVenueManager) {
    return <Navigate to="/venues" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/venues" replace /> : <Home />}
      />
      <Route path="/venues" element={<VenuesPage />} />
      <Route path="/venues/:id" element={<VenueDetailsPage />} />
      <Route path="/profile/:username" element={<PublicProfilePage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected customer routes */}
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Protected venue manager routes */}
      <Route
        path="/my-venues"
        element={
          <ProtectedRoute requireVenueManager={true}>
            <MyVenues />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-venue"
        element={
          <ProtectedRoute requireVenueManager={true}>
            <CreateVenuePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/venues/:id/edit"
        element={
          <ProtectedRoute requireVenueManager={true}>
            <EditVenuePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/venues/:id/manage"
        element={
          <ProtectedRoute requireVenueManager={true}>
            <ManageVenuePage />
          </ProtectedRoute>
        }
      />

      {/* 404 and catch-all */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
