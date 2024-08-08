import React, { Children, useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from '@mui/icons-material';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/styles';
import { Grid, Paper, Typography, Box, IconButton } from '@mui/material';
import Navbar from '../components/NavBar.js';


const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          
          const response = await axios.get('http://localhost:8000/accounts/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      <Navbar />
      <Box
      sx={{
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        display: 'flex',
        flexDirection: 'column',
      }}
      >

      {/* Dashboard text, possibly make this a component that dynamically gets the page name?? */}
      <Title />
      
      
      {/* Alerts, database stats and graph grids */}
      <Grid container spacing={3}>
        
        {/* Info cards and two graph grid */}
        <Grid item xs={12} md={8}>
          
          {/* Info cards and two graph spacing */}
          <Grid container spacing={3} >
            
        
            
              <Grid item xs={12} sm={6} md={4} sx={{ padding: 3}}>
                <Paper sx={{ padding: 2 }}>

                  <InfoCard title="Logs" value="321k" />

                </Paper>
              </Grid>


              <Grid item xs={12} sm={6} md={4} sx={{ padding: 3}}>
                <Paper sx={{ padding: 2 }}>

                  <InfoCard title="Active Alerts" value="20" />

                </Paper>
              </Grid>


              <Grid item xs={12} sm={6} md={4} sx={{ padding: 3}}>
                <Paper sx={{ padding: 2 }}>

                  <InfoCard title="Closed Alerts" value="32" />

                </Paper>
              </Grid>


              <Grid item xs={12} sm={6} md={4} sx={{ padding: 3}}>
                <Paper sx={{ padding: 2 }}>

                  <InfoCard title="Total Devices" value="301" />

                </Paper>
              </Grid>


              <Grid item xs={12} sm={6} md={4} sx={{ padding: 3}}>
                <Paper sx={{ padding: 2 }}>

                  <InfoCard title="Events per Day" value="10,556" />
              
                </Paper>
              </Grid>
            
            
              <Grid item xs={12} sm={6} md={4} sx={{ padding: 3}}>
                <Paper sx={{ padding: 2 }}>
                
                  <InfoCard title="New Devices (24hr)" value="6" />
              
                </Paper>
              </Grid>

            

            {/* Graphs Section */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ padding: 2 }}>
                
                <Typography variant="h6">Graph 1</Typography>
                {/* todo make graph serise */}
              
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ padding: 2 }}>
                
                <Typography variant="h6">Graph 2</Typography>
                {/* todo make graph serise */}
              
              </Paper>
            </Grid>
          </Grid>
          
        </Grid>

        {/* Alerts Section */}
        <Grid item xs={12} md={4}>

          <Paper sx={{ padding: 2, marginBottom: 3 }}>

            <Typography variant="h6" gutterBottom>
              Latest Alerts
            </Typography>

            <Alert hostname="WDT-01" message="Failed login attempt" />
            <Alert hostname="WDT-02" message="New User Account Created" />
            <Alert hostname="WDT-03" message="Failed login attempt" />
            <Alert hostname="WDT-04" message="Windows Defender Detected Malware" />

            <Typography sx={{ textAlign: 'right' }} variant="body2">
              View more &gt;
            </Typography>

          </Paper>

          {/* System Stats */}
          <Paper sx={{ padding: 2 }}>

            <Typography variant="h6">SIEM Database Server Status</Typography>
            <SystemStat />

          </Paper>

        </Grid>

      </Grid>

      </Box>
    
    </div>
  );
};

export default Dashboard;



function Title() {
  return (
  <div className='title'>
    <h1>Dashboard</h1>
  </div>
  );
}


function InfoCard(
  {
    icon,
    value,
    title,
  }
){
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Box>
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="h6">
          <b>{value}</b>
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '50%',
          padding: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: '2.5rem', // Minimum size
          minHeight: '2.5rem', // Minimum size
          width: 'auto', // Responsive width
          height: 'auto', // Responsive height
        }}
      >
        <Search />
      </Box>
    </Box>
  );

}

function AlertContainer({children}) {
  return (
    <div className='alertContainer'>
      <h3 className='alertTitle'>Latest Alerts</h3>
      {children}
      <p>view more &gt;</p> {/* to do link this to the alerts page */}
    </div>
  );
}

function Alert(
  {
    hostname,
    message,
  }
) {
  return (
    <div>
      <p>Device: {hostname}</p>
      <p>{message}</p>
      <div className='alerticon'>
        {<Search />}
      </div>
    </div>
  );

}

function GraphContainer({children}) {
  return (
    <div className='graphContainer'>
      {children}
    </div>
  );

}

function Graphs({}) {
  return (
    <div >
      <p>
        Here are some graphs they are very pretty and show important information from the backend stuff
      </p>
    </div>
  );

}

function SystemStat() {
  return (
    <div className='systemStats'>
      <p>SIEM DB Server Status</p>
      <p>Disk Used</p>
      <p>RAM Usage</p>
      <p>CPU Load</p>
    </div>
  );

}