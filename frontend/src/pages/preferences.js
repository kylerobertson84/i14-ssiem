
// import React, { useEffect, useState } from 'react';
import PreferencesForm from '../components/PreferencesForm.js';
import { fetchUser } from '../services/apiService.js';

import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';


import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { Box, Typography, CircularProgress } from '@mui/material';

//import {IoPersonCirculeOutline} from "react-icons/io5"; 

const Preferences = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData] = await Promise.all([
          fetchUser(),
        ]);

        setUser(userData);
        
      } catch (error) {
        console.error('Error loading dashboard data', error);
      }
    };

    loadData();
  }, []);



return (
  <div>
  
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
            {/* <Typography variant="body1">Username: {user.username}</Typography> */}
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
