import React, { useEffect, useState } from 'react';

/* Icons */
import { 
  EditCalendar, 
  Search, 
  Notes, 
  Devices, 
  AddToQueue, 
  AssignmentTurnedInOutlined, 
  MonitorHeartOutlined, 
  MemoryOutlined, 
  DeveloperBoardOutlined,
  SaveOutlined } 
from '@mui/icons-material';


import { Link } from 'react-router-dom';
import { Grid, Paper, Typography, Box } from '@mui/material';
import Navbar from '../components/NavBar.js';
import { LogsPerHourChart, LogsByDeviceChart, CpuLoadChart, RamUsageChart, DiskUsageChart } from '../components/dashboardGraphs.js';

import { fetchUser, fetchLogCount, fetchRouterLogCount, fetchLogPercentages, fetchLogsPerHour } from '../services/apiService.js';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recordCount, setRecordCount] = useState(0);
  const [routerLogCount, setRouterLogCount] = useState(0);
  const [logPercentages, setLogPercentages] = useState({});
  const [logsPerHour, setLogsPerHour] = useState([]);

  const logsByDeviceData = [
    { name: 'Windows OS', value: logPercentages.windows_os_percentage },
    { name: 'Network', value: logPercentages.network_percentage }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, logCountData, routerLogCountData, logPercentages, logsPerHour] = await Promise.all([
          fetchUser(),
          fetchLogCount(),
          fetchRouterLogCount(),
          fetchLogPercentages(),
          fetchLogsPerHour(),
        ]);

        setUser(userData);
        setRecordCount(logCountData.count);
        setRouterLogCount(routerLogCountData.router_log_count);
        setLogPercentages(logPercentages);
        setLogsPerHour(logsPerHour);

        console.log("logPercentages",logPercentages);
      } catch (error) {
        console.error('Error loading dashboard data', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(json => {
        setData(json);
        setLoading(false); // Data is now loaded
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setLoading(false); // Even if there's an error, stop the loading state
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Error loading data.</div>;
  }


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
        }}>

        <Title />
        
        {/* Alerts, database stats and graph grids */}
        <Grid container spacing={3}>
          
          {/* Info cards and two graph grid */}
          <Grid item xs={12} md={8}>
            
            {/* Info cards and graph spacing */}
            <Grid container spacing={3} >
              
              {/* Info cards styling padding and grid items */}
              <Grid item xs={12} sm={6} md={4} sx={{ padding: 3 }}>
                <Paper sx={{ padding: 2 }}>
                  <InfoCard title="Total Devices" value={data.infoCards.values[0]} icon={Devices}/>
                  
                </Paper>
              </Grid>
              
              
              <Grid item xs={12} sm={6} md={4} sx={{ padding: 3 }}>
                <Paper sx={{ padding: 2 }}>

                  <InfoCard title="Logs" value={recordCount + routerLogCount} icon={Notes}/>

                </Paper>
              </Grid>

             
              <Grid item xs={12} sm={6} md={4} sx={{ padding: 3 }}>
                <Paper sx={{ padding: 2 }}>
                  
                  <InfoCard title="New Devices (24hr)" value={data.infoCards.values[2]} icon={AddToQueue}/>
                </Paper>
              </Grid>

           
              <Grid item xs={12} sm={6} md={4} sx={{ padding: 3 }}>
                <Paper sx={{ padding: 2 }}>
                  
                  <InfoCard title="Open Investigations" value={data.infoCards.values[3]} icon={Search}/>
                </Paper>
              </Grid>

              
              <Grid item xs={12} sm={6} md={4} sx={{ padding: 3 }}>
                <Paper sx={{ padding: 2 }}>
                 
                  <InfoCard title="Events per Day" value={data.infoCards.values[4]} icon={EditCalendar}/>
                </Paper>
              </Grid>

             

              <Grid item xs={12} sm={6} md={4} sx={{ padding: 3 }}>
                <Paper sx={{ padding: 2 }}>
                  
                  <InfoCard title="Closed Investigations" value={data.infoCards.values[5]} icon={AssignmentTurnedInOutlined}/>
                </Paper>
              </Grid>

              {/* Graphs Section */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ padding: 2 }}>
                  <LogsPerHourChart data={logsPerHour} />
                </Paper>
              </Grid>
              

              <Grid item xs={12} md={6}>
                <Paper sx={{ padding: 2 }}>
                  
                  <LogsByDeviceChart data={logsByDeviceData}/>
                </Paper>
              </Grid>
              

            </Grid>
          
          </Grid>

         
          {/* Alerts Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ padding: 2, marginBottom: 3 }}>
              <Typography variant="h6" gutterBottom>Latest Alerts</Typography>
              <Alert hostname={data.alerts.hostName[0]} message={data.alerts.message[0]} />
              <Alert hostname={data.alerts.hostName[1]} message={data.alerts.message[1]} />
              <Alert hostname={data.alerts.hostName[2]} message={data.alerts.message[2]} />
              <Alert hostname={data.alerts.hostName[3]} message={data.alerts.message[3]} />

              <Typography variant="body2">
                <Link style={{ width: "100%", display: 'flex', justifyContent: 'right', textDecoration: 'none', color: 'black' }} to="/alerts">
                  View more &gt;
                </Link>
              </Typography>
            </Paper>


            {/* System Stats */}
            <Paper sx={{ padding: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">SIEM Database Server Status</Typography>
                <MonitorHeartOutlined sx={{ fontSize: 40, color: '#6c757d' }}/>
              </Box>
              <SystemStat 
                dataDisk={data.graphs.diskData} 
                dataRam={data.graphs.ramData} 
                dataCpu={data.graphs.cpuData}      
              />
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
    icon: IconComponent,
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
          backgroundColor: 'rgba(0,88,255,0.102)',
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
        <IconComponent style={{ fontSize: 30, color: '#0058ff' }} />
      </Box>
    </Box>
  );

}





function Alert(
  {
    hostname,
    message,
  }
) {
  return (
    <Paper sx={{ 
      padding: 0, 
      margin: 1.5,
      borderRadius: 5,
      backgroundColor: 'rgb(197,217,226)'
      }}>
    
      <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 0,
      }}>
    
        <Box 
          sx={{
            paddingLeft: 2.5,
            paddingTop: .25,
            paddingBottom: .25,
          }}>
        
            <p><strong>Device: {hostname}</strong></p>
            <p><strong>{message}</strong></p>
        
        </Box>

        <Box
          sx={{
            padding: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
        
          <Search />
        
        </Box>

      </Box>
    
    </Paper>
  );

}





function SystemStat({
  dataCpu,
  dataDisk,
  dataRam
}) {
  return (
    <Box sx={{ padding: 2 }}>
      {/* Disk Usage */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <SaveOutlined sx={{ fontSize: 40, color: '#6c757d', marginRight: 2 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body1" >
            Disk Used: {dataDisk[5].value}%
          </Typography>
        </Box>

        <DiskUsageChart data={dataDisk}/>
      </Box>

      {/* RAM Usage */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <MemoryOutlined sx={{ fontSize: 40, color: '#6c757d', marginRight: 2 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body1" >
            RAM Load: {dataRam[5].value}%
          </Typography>
        </Box>
        <RamUsageChart data={dataRam}/>
      </Box>

      {/* CPU Load */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <DeveloperBoardOutlined sx={{ fontSize: 40, color: '#6c757d', marginRight: 2 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body1" >
            CPU Load: {dataCpu[5].value}%

          </Typography>
        </Box>
        <CpuLoadChart data={dataCpu}/>

      </Box>
    </Box>
  );

}