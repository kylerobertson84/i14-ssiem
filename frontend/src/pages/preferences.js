
// src/pages/preferences.js

import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import '../pages/ProfileStyle.css';
import PreferencesForm from '../components/PreferencesForm.js';
import axios from 'axios';
import AuthService from '../services/AuthService.js';
import API_ENDPOINTS from '../services/apiConfig.js';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';


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
    <div classname='preferences'>
      <Navbar />
      <h1>Preferences Page</h1>
        <div className='profile'>
          <div className='avatar'>
            <AccountCircleRoundedIcon fontSize='large'/>
          </div>
          <div className='body'>
            {!user ? (
              <p>Loading user data...</p>
            ) : (
              <>
                <p>Username: {user.username}</p>
                <p>Email: {user.email || 'No email provided'}</p>
                
                <p>Roles: {user.role ? user.role.name : 'No role assigned'}</p>
              </>
            )}
          </div>
          <div>
            <PreferencesForm />
          </div>
          <div>
          </div>

        </div>
    </div>

  );
};

export default Preferences;

{/* */ }