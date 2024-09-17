
// src/pages/preferences.js

import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import '../Design/ProfileStyle.css';
import PreferencesForm from '../components/PreferencesForm.js';
import axios from 'axios';
import AuthService from '../services/AuthService.js';
import API_ENDPOINTS from '../services/apiConfig.js';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { Box, Typography, CircularProgress } from '@mui/material';


const Preferences = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      // const token = localStorage.getItem('token');
      const token = AuthService.getToken();
      if (token) {
        console.log('Authorization header:', `Bearer ${token}`);
        try {
          const response = await axios.get(API_ENDPOINTS.user, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data', error);
          setError('Failed to fetch user data');
        }
      } else {
        setError('No token found');
      }
    }
    fetchUser();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
    <Navbar />
    <Box className="preferences">
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold', color: '#333' }}>
        Preferences Page
      </Typography>
      
      <Box className="profile">
        <Box className="avatar">
          <AccountCircleRoundedIcon fontSize="large" />
        </Box>
        
        <Box className="body">
          {!user ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="body1">Username: {user.username}</Typography>
              <Typography variant="body1">Email: {user.email || 'No email provided'}</Typography>
              <Typography variant="body1">Roles: {user.role ? user.role.name : 'No role assigned'}</Typography>
            </>
          )}
        </Box>

        <Box className="preferences-form">
          <PreferencesForm />
        </Box>
      </Box>
    </Box>
  </div>
);
};

export default Preferences;