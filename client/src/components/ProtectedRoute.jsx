import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A wrapper component for routes that require authentication.
 * @param {children} React nodes to be rendered if authenticated
 * @param {adminOnly} boolean flag to restrict access to admins only
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <div className="spinner">Verifying access...</div>
            </div>
        );
    }

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== 'admin') {
        // Redirect to home if admin privilege is required but user is not an admin
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
