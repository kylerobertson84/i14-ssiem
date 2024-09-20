// src/components/ProtectedLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './NavBar';

const ProtectedLayout = () => {
    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default ProtectedLayout;