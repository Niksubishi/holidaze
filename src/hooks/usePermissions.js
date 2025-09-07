import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { isAuthenticated, isVenueManager, user } = useAuth();

  const permissions = useMemo(() => ({
    // Basic authentication
    isLoggedIn: isAuthenticated,
    isGuest: !isAuthenticated,
    
    // Role-based permissions
    isVenueManager: isAuthenticated && isVenueManager,
    isCustomer: isAuthenticated && !isVenueManager,
    
    // Action permissions
    canCreateVenue: isAuthenticated && isVenueManager,
    canEditVenue: (venue) => isAuthenticated && isVenueManager && venue?.owner?.name === user?.name,
    canManageVenue: (venue) => isAuthenticated && isVenueManager && venue?.owner?.name === user?.name,
    canDeleteVenue: (venue) => isAuthenticated && isVenueManager && venue?.owner?.name === user?.name,
    canBookVenue: isAuthenticated,
    canCancelBooking: (booking) => isAuthenticated && booking?.customer?.name === user?.name,
    canViewProfile: isAuthenticated,
    canEditProfile: isAuthenticated,
    canViewPublicProfile: true, // Anyone can view public profiles
    
    // Booking management permissions for venue owners
    canManageBookings: (venue) => isAuthenticated && isVenueManager && venue?.owner?.name === user?.name,
    canCancelGuestBooking: (booking, venue) => {
      return isAuthenticated && isVenueManager && 
             venue?.owner?.name === user?.name && 
             booking?.venue?.id === venue?.id;
    },
    
    // Content permissions
    canViewMyBookings: isAuthenticated,
    canViewMyVenues: isAuthenticated && isVenueManager,
  }), [isAuthenticated, isVenueManager, user]);

  return permissions;
};

// Helper function to check specific permission
export const useHasPermission = (permissionKey, ...args) => {
  const permissions = usePermissions();
  
  const hasPermission = useMemo(() => {
    const permission = permissions[permissionKey];
    
    if (typeof permission === 'function') {
      return permission(...args);
    }
    
    return Boolean(permission);
  }, [permissions, permissionKey, args]);

  return hasPermission;
};

// Higher-order component for permission-based rendering
export const withPermission = (Component, permissionKey, fallback = null) => {
  return function PermissionWrappedComponent(props) {
    const hasPermission = useHasPermission(permissionKey, props.data);
    
    if (!hasPermission) {
      return fallback;
    }
    
    return <Component {...props} />;
  };
};