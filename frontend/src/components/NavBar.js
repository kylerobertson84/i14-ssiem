
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AuthService from '../services/AuthService';
import { Box } from '@mui/material';

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
    };
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">
                    Simple SIEM
                </Typography>
                <Box
                sx={{ 
                  flexGrow: 1,
                  display: 'flex', 
                  justifyContent: 'center' 
                }}
                >
                  <Button color="inherit" component={Link} to="/dashboard">
                      Dashboard
                  </Button>
                  <Button color="inherit" component={Link} to="/investigations">
                      Investigations
                  </Button>
                  <Button color="inherit" component={Link} to="/queries">
                      Queries
                  </Button>
                  <Button color="inherit" component={Link} to="/reports">
                      Reports
                  </Button>
                </Box>
                <Button color="inherit" onClick={handleLogout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;

