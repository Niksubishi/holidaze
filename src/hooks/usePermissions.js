import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { isAuthenticated, isVenueManager, user } = useAuth();

  const permissions = useMemo(() => ({
    
    isLoggedIn: isAuthenticated,
    isGuest: !isAuthenticated,
    
    
    isVenueManager: isAuthenticated && isVenueManager,
    isCustomer: isAuthenticated && !isVenueManager,
    
    
    canCreateVenue: isAuthenticated && isVenueManager,
    canEditVenue: (venue) => isAuthenticated && isVenueManager && venue?.owner?.name === user?.name,
    canManageVenue: (venue) => isAuthenticated && isVenueManager && venue?.owner?.name === user?.name,
    canDeleteVenue: (venue) => isAuthenticated && isVenueManager && venue?.owner?.name === user?.name,
    canBookVenue: isAuthenticated,
    canCancelBooking: (booking) => isAuthenticated && booking?.customer?.name === user?.name,
    canViewProfile: isAuthenticated,
    canEditProfile: isAuthenticated,
    canViewPublicProfile: true, 
    
    
    canManageBookings: (venue) => isAuthenticated && isVenueManager && venue?.owner?.name === user?.name,
    canCancelGuestBooking: (booking, venue) => {
      return isAuthenticated && isVenueManager && 
             venue?.owner?.name === user?.name && 
             booking?.venue?.id === venue?.id;
    },
    
    
    canViewMyBookings: isAuthenticated,
    canViewMyVenues: isAuthenticated && isVenueManager,
  }), [isAuthenticated, isVenueManager, user]);

  return permissions;
};


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


export const withPermission = (Component, permissionKey, fallback = null) => {
  return function PermissionWrappedComponent(props) {
    const hasPermission = useHasPermission(permissionKey, props.data);
    
    if (!hasPermission) {
      return fallback;
    }
    
    return <Component {...props} />;
  };
};