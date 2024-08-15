
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/AuthService';

const PrivateRoute = () => {
    const user = AuthService.getCurrentUser();
    const shouldBypassAuth = process.env.REACT_APP_BYPASS_AUTH === 'true';

    if (shouldBypassAuth)
    {
        return <Outlet />;
    }
    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
