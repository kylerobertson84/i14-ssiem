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
  SaveOutlined,
  WarningAmber,
}
from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { Grid, Paper, Typography, Box, useTheme, Chip, IconButton } from '@mui/material';
import { LogsPerHourChart, LogsByDeviceChart, CpuLoadChart, RamUsageChart, DiskUsageChart } from '../components/dashboardGraphs.js';

import { fetchUser, fetchLogCount, fetchRouterLogCount, fetchLogPercentages, fetchLogsPerHour, fetchEventsToday, fetchLatestAlerts, fetchHostnameCount, fetchInvestigationsCount } from '../services/apiService.js';

const Dashboard = () => {
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recordCount, setRecordCount] = useState(0);
  const [routerLogCount, setRouterLogCount] = useState(0);
  const [logPercentages, setLogPercentages] = useState({});
  const [logsPerHour, setLogsPerHour] = useState([]);
  const [eventsToday, setEventsToday] = useState({});
  const [latestAlerts, setLatestAlerts] = useState({});
  const [hostnameCount, setHostnameCount] = useState({});
  const [investigationCount, setInvestigationCount] = useState({});

  const logsByDeviceData = [
    { name: 'Windows OS', value: logPercentages.windows_os_percentage },
    { name: 'Network', value: logPercentages.network_percentage }
  ];

  const severityColors = {
    INFO: '#2196f3',    // Blue
    LOW: '#4caf50',     // Green
    MEDIUM: '#ff9800',  // Orange
    HIGH: '#f44336',    // Red
    CRITICAL: '#9c27b0' // Purple
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, logCountData, routerLogCountData, logPercentages, logsPerHour, fetchedEventsToday, fetchedLatestAlerts, fetchedHostnameCount, fetchedInvestigationCount] = await Promise.all([
          fetchUser(),
          fetchLogCount(),
          fetchRouterLogCount(),
          fetchLogPercentages(),
          fetchLogsPerHour(),
          fetchEventsToday(),
          fetchLatestAlerts(),
          fetchHostnameCount(),
          fetchInvestigationsCount(),

        ]);

        setUser(userData);
        setRecordCount(logCountData.count);
        setRouterLogCount(routerLogCountData.router_log_count);
        setLogPercentages(logPercentages);
        setLogsPerHour(logsPerHour);
        setEventsToday(fetchedEventsToday);
        setLatestAlerts(fetchedLatestAlerts);
        setHostnameCount(fetchedHostnameCount);
        setInvestigationCount(fetchedInvestigationCount);

        console.log("investigations", fetchedInvestigationCount);

        console.log("latest alerts", fetchedLatestAlerts);


        console.log("logPercentages", logPercentages);
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

  const navigate = useNavigate();
  const handleViewMoreClick = () => {
    navigate('/alerts');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Error loading data.</div>;
  }

  const LatestAlertsSection = () => (
    <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}>
      <Box sx={{ p: 2, bgcolor: '#1976d2', color: 'white', display: 'flex', alignItems: 'center' }}>
        <WarningAmber sx={{ mr: 1 }} />
        <Typography variant="h6" component="h2" fontWeight="bold">
          Latest Alerts
        </Typography>
      </Box>
      <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
        {latestAlerts.results && latestAlerts.results.map((alert, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              borderBottom: index < latestAlerts.results.length - 1 ? '1px solid #e0e0e0' : 'none',
              '&:hover': { bgcolor: '#f5f5f5' },
              transition: 'background-color 0.3s'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                Device: {alert.event.hostname}
              </Typography>
              <Chip
                label={alert.severity}
                size="small"
                sx={{
                  bgcolor: severityColors[alert.severity],
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>{alert.rule}</strong>
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                {new Date(alert.created_at).toLocaleString()}
              </Typography>
              <IconButton size="small" color="primary" aria-label="investigate">
                <Search />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ p: 1, textAlign: 'right' }}>
        <Typography
          variant="body2"
          color="primary"
          sx={{ cursor: 'pointer' }}
          onClick={handleViewMoreClick}
        >
          View more &gt;
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <div>
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
              <InfoCard title="Total Devices" value={hostnameCount.total_devices} icon={Devices} />
              <InfoCard title="Logs" value={recordCount + routerLogCount} icon={Notes} />
              <InfoCard title="Events per Day" value={eventsToday.events_today} icon={EditCalendar} />

              <InfoCard title="Open Investigations" value={investigationCount.other_status_count} icon={Search} />
              <InfoCard title="In Progress Investigations" value={investigationCount.other_status_count} icon={Search} />
              <InfoCard title="Closed Investigations" value={investigationCount.closed_count} icon={AssignmentTurnedInOutlined} />
              {/* Graphs Section */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ padding: 2 }}>
                  <LogsPerHourChart data={logsPerHour} />
                </Paper>
              </Grid>


              <Grid item xs={12} md={6}>
                <Paper sx={{ padding: 2 }}>

                  <LogsByDeviceChart data={logsByDeviceData} />
                </Paper>
              </Grid>


            </Grid>

          </Grid>


          {/* Alerts Section */}
          <Grid item xs={12} md={4}>
            {/* Latest Alerts Section */}
            <LatestAlertsSection />

            {/* System Stats Section */}
            <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}>
              <Box sx={{
                p: 2,
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  SIEM Database Server Status
                </Typography>
                <MonitorHeartOutlined sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Box sx={{ p: 2 }}>
                <SystemStat
                  dataDisk={data.graphs.diskData}
                  dataRam={data.graphs.ramData}
                  dataCpu={data.graphs.cpuData}
                />
              </Box>
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
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard
      </Typography>
    </div>
  );
}




const InfoCard = ({ icon: IconComponent, value, title }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="subtitle1" color="textSecondary">{title}</Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        <IconComponent sx={{ fontSize: 40, color: 'primary.main' }} />
      </Box>
    </Paper>
  </Grid>
);





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

        <DiskUsageChart data={dataDisk} />
      </Box>

      {/* RAM Usage */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <MemoryOutlined sx={{ fontSize: 40, color: '#6c757d', marginRight: 2 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body1" >
            RAM Load: {dataRam[5].value}%
          </Typography>
        </Box>
        <RamUsageChart data={dataRam} />
      </Box>

      {/* CPU Load */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <DeveloperBoardOutlined sx={{ fontSize: 40, color: '#6c757d', marginRight: 2 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body1" >
            CPU Load: {dataCpu[5].value}%

          </Typography>
        </Box>
        <CpuLoadChart data={dataCpu} />

      </Box>
    </Box>
  );

}