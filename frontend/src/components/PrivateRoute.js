
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const user = AuthService.getCurrentUser();
    return user ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
