import React, { Children, useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from '@mui/icons-material';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/styles';
import { Grid, Paper, Typography, Box, IconButton } from '@mui/material';


const themes = createTheme();

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: themes.spacing(3),
  },
  paper: {
    padding: themes.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  infoCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
    padding: theme.spacing(1),
    marginBottom: themes.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  systemStats: {
    padding: themes.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
}));


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const classes = useStyles();

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
      <Typography variant="h4" className={classes.title}>
        Dashboard
      </Typography>
      {user ? <p>Welcome, {user.username}!</p> : <p>Please log in.</p>}
      </div>,
    <Content>
      <Title/>
      <Container>
        <InfoCards
          value ="200K" 
          icon ="test"
          title ="Logs"
        />
        <InfoCards
          value ="20" 
          icon ="test"
          title ="Active Alerts"
        />
        <InfoCards
          value ="12" 
          icon ="test"
          title ="closed alerts"
        />
        <InfoCards
          value ="184"
          icon ="test"
          title ="Total Devices"
        />
        <InfoCards
          value ="10,435"
          icon ="test"
          title ="Events per Day"
        />
        <InfoCards
          value ="13" 
          icon ="test"
          title ="New Devices (24hr)"
        />
      </Container>
      <Container>
        <Alerts 
        hostname="WDT-01"
        message="failed login"
        />
        <Alerts 
        hostname="WDT-02"
        message="Anti-Virus Alert"
        />
        <Alerts 
        hostname="WDT-03"
        message="Some other alert thing"
        />
      </Container>
      <SystemStats />
      <Container>
        <Graphs />
        <Graphs />
      </Container>
    </Content>
  );
};

export default Dashboard;

function Content( {children} ) {
  return (
    <div className='content'>
      {children}
    </div>
  );
}

function Title() {
  return (
  <div className='title'>
    <h1>Dashboard</h1>
  </div>
  );
}

function InfoCardContainer({children}) {
  return (
    <div className='infoCardContainer'>
      {children}
    </div>
  );
}

function InfoCards(
  {
    icon,
    value,
    title,
  }
){
  return (
    <div className='infoCard'>
      <p>{title}</p>
      <p><b>{value}</b></p>
      <div className='infoCardIcons'>
        <img src={'../resources/' + icon + ".svg"} alt={icon} /*todo size of icon*//> 
      </div>
    </div>
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

function Alerts(
  {
    hostname,
    message,
  }
) {
  return (
    <div className='alert'>
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

function SystemStats() {
  return (
    <div className='systemStats'>
      <p>SIEM DB Server Status</p>
      <p>Disk Used</p>
      <p>RAM Usage</p>
      <p>CPU Load</p>
    </div>
  );

}