import React, { createContext, useContext, useEffect, useState } from "react";
import { tokenManager, userManager } from "../api/auth.js";
import { profilesAPI } from "../api/profiles.js";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
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
      const storedToken = tokenManager.get();
      const storedUser = userManager.get();

      if (storedToken && storedUser) {
        setToken(storedToken);
        
        try {
          const response = await profilesAPI.getById(storedUser.name);
          const updatedUser = response.data;
          setUser(updatedUser);
          userManager.set(updatedUser);
        } catch {
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
      
      const response = await profilesAPI.getById(userData.name);
      const updatedUser = response.data;
      setUser(updatedUser);
      userManager.set(updatedUser);
    } catch {
      setUser(userData);
      userManager.set(userData);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    tokenManager.remove();
    userManager.remove();
    window.location.href = '/auth';
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
