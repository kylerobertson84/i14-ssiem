

import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import { 
  Container, 
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { DataGrid, GridRowProp, GridColDef } from '@mui/x-data-grid';
//import '../Design/Investigation.css'

const alerts = [
  { id: 1, device: 'Stefan-Laptop', type: 'Failed Login Attempt', status: 'Closed', timestamp: '2024-03-12 16:04:26' },
  { id: 2, device: 'Stefan-Laptop', type: 'New User Account Created', status: 'In Progress', timestamp: '2024-03-12 16:04:26' },
  { id: 4, device: 'PC-4', type: 'Failed Login Attempt', status: 'Open', timestamp: '2024-04-12 16:04:26' },
  { id: 5, device: 'Pc-5', type: 'Windows Defender Detected Malware', status: 'Open', timestamp: '2024-05-12 16:04:26' },
];

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'device', headerName: 'Device Name', width: 130 },
  { field: 'type', headerName: 'Type', width: 130 },
  { field: 'status', headerName: 'Status', width: 130},
  { field: 'timestamp', headerName: 'TimeStamp', width: 160,},
];

const Investigations = () => {
  return (
    <div>
      <Navbar/>
      <h1>Investigations</h1>
      <Container maxWidth="sm" className="investigation-Table">
            <DataGrid>
              rows = {alerts}
              columns = {columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              sx={{ overflow: 'clip' }}
            </DataGrid>
      </Container>
  </div>
  );
};

export default Investigations;

/*
const Investigations = () => {
  return (
    <div>
      <Navbar/>
      <h1>Investigations Page</h1>
      
    </div>
  );
};

export default Investigations;
*/