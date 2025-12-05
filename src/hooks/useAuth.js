import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authService } from '../services/auth.service';
import { logoutUser } from '../store/authSlice'; // Redux Action

const useAuth = () => {
  const dispatch = useDispatch();
  
  // Select state directly from Redux Store (The "Global Brain")
  const { user, isAuthenticated, loading, error } = useSelector(state => state.auth);

  // 1. Memoized Logout Function
  const logout = useMemo(() => {
    return async () => {
      try {
        await authService.logout(); // Call Firebase signOut
        dispatch(logoutUser());    // Clear Redux state
        console.log("User successfully logged out.");
        
        // Optional: Redirect to home page if necessary
        // window.location.href = '/'; 
      } catch (err) {
        console.error("Logout failed:", err);
      }
    };
  }, [dispatch]);

  // 2. Memoized User Data Access
  const userData = useMemo(() => {
    return {
      user,
      isAuthenticated,
      isLoading: loading,
      isAdmin: user?.isAdmin || false, // Assuming your Postgres sync adds this field
      error,
      logout,
      // Helper function to get the latest token for API calls
      getToken: authService.getToken,
    };
  }, [user, isAuthenticated, loading, error, logout]);

  // Return the consolidated object
  return userData;
};

export default useAuth;