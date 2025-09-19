import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ToastProvider } from "./context/ToastContext";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import ToastContainer from "./components/UI/ToastContainer";
import useScrollToTop from "./hooks/useScrollToTop";

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


const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  useScrollToTop(); // Add global scroll-to-top

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
      <LoadingProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <Layout>
                <AppRoutes />
              </Layout>
              <ToastContainer />
            </Router>
          </AuthProvider>
        </ToastProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
