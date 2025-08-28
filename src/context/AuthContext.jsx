import React, { createContext, useContext, useEffect, useState } from "react";
import { tokenManager, userManager } from "../api/auth.js";
import { profilesAPI } from "../api/profiles.js";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for existing authentication on app load
      const storedToken = tokenManager.get();
      const storedUser = userManager.get();

      if (storedToken && storedUser) {
        setToken(storedToken);
        
        try {
          // Fetch the latest user profile to ensure we have current venueManager status
          const response = await profilesAPI.getById(storedUser.name);
          const updatedUser = response.data;
          setUser(updatedUser);
          userManager.set(updatedUser);
        } catch (error) {
          console.error("Failed to fetch latest user profile:", error);
          // Use cached data if API call fails
          setUser(storedUser);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (userData, authToken) => {
    setToken(authToken);
    tokenManager.set(authToken);
    
    try {
      // Fetch the latest user profile to ensure we have current venueManager status
      const response = await profilesAPI.getById(userData.name);
      const updatedUser = response.data;
      setUser(updatedUser);
      userManager.set(updatedUser);
    } catch (error) {
      console.error("Failed to fetch latest user profile during login:", error);
      // Use login response data if API call fails
      setUser(userData);
      userManager.set(userData);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    tokenManager.remove();
    userManager.remove();
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    userManager.set(newUserData);
  };

  const isAuthenticated = Boolean(user && token);
  const isVenueManager = Boolean(user?.venueManager);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
    isVenueManager,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
