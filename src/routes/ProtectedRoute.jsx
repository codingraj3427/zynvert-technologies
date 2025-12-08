// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Assumes useAuth is in ../hooks/useAuth

// This component controls access based on authentication and admin role.
const ProtectedRoute = ({ children, isAdminRoute = false }) => {
    const { isAuthenticated, isAdmin, isLoading } = useAuth();

    if (isLoading) {
        // You can use your PageLoader here if you prefer
        return <div style={{ padding: 20 }}>Loading User Data...</div>; 
    }

    // 1. Check Authentication
    if (!isAuthenticated) {
        // If not logged in, redirect to the authentication page
        return <Navigate to="/auth" replace />;
    }

    // 2. Check Admin Role (if it's an admin-specific route)
    if (isAdminRoute && !isAdmin) {
        // If logged in but not an admin, redirect to a safe page (e.g., account or home)
        return <Navigate to="/account" replace />;
    }

    // If checks pass, render the child component (the page)
    return children;
};

export default ProtectedRoute;