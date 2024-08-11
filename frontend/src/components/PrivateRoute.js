
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/AuthService';

const PrivateRoute = () => {
    const user = AuthService.getCurrentUser();
    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
