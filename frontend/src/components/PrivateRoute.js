// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/AuthService';

const PrivateRoute = () => {
    const user = AuthService.getCurrentUser();
    console.log("Current user:", user);
    const shouldBypassAuth = process.env.REACT_APP_BYPASS_AUTH === 'true';
    console.log("Bypass auth:", shouldBypassAuth); // Debug line
    console.log("REACT_APP_BYPASS_AUTH:", process.env.REACT_APP_BYPASS_AUTH);


    if (shouldBypassAuth)
    {
        return <Outlet />;
    }
    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
