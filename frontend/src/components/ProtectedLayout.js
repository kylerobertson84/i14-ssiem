// src/components/ProtectedLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './NavBar';
import Footer from './Footer';

const ProtectedLayout = () => {
    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default ProtectedLayout;