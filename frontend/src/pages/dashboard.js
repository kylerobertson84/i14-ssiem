import React, { Children, useEffect, useState } from 'react';
import axios from 'axios';
//import { Search } from '@mui/icons-material';


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
      <h1>Dashboard</h1>
      {user ? <p>Welcome, {user.username}!</p> : <p>Please log in.</p>}
    </div>,
    <Content>
      <Title/>
      <InfoCardContainer>
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
      </InfoCardContainer>
      <AlertContainer>
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
      </AlertContainer>
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
        {/*<Search />*/}
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