

import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import { 
  Container,
  Select,
  MenuItem, 
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { 
  DataGrid,
  GridColumnMenuFilterItem,
  GridColumnMenuSortItem,
  GridColumnMenuColumnsItem, 
} from '@mui/x-data-grid';
//import '../Design/Investigation.css'

const initialAlerts = [
  { id: 1, device: 'Stefan-Laptop', type: 'Failed Login Attempt', status: 'Closed', timestamp: '2024-03-12 16:04:26' },
  { id: 2, device: 'Stefan-Laptop', type: 'New User Account Created', status: 'In Progress', timestamp: '2024-03-12 16:04:26' },
  { id: 4, device: 'PC-4', type: 'Failed Login Attempt', status: 'Open', timestamp: '2024-04-12 16:04:26' },
  { id: 5, device: 'Pc-5', type: 'Windows Defender Detected Malware', status: 'Open', timestamp: '2024-05-12 16:04:26' },
];

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'device', headerName: 'Device Name', width: 130 },
  { field: 'type', headerName: 'Type', width: 130 },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 180,
    renderCell: (params) => {
      const handleChange = (event) => {
        const newStatus = event.target.value;
        const rowIndex = params.api.getRowIndex(params.id);
        params.api.updateRows([{ ...params.row, status: newStatus }]);
      };

      return (
        <Select
          value={params.value}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="Open">Open</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Closed">Closed</MenuItem>
        </Select>
      );
    }
  },
  { field: 'timestamp', headerName: 'TimeStamp', width: 160,},
];

const Investigations = () => {
  
  const [alerts, setAlerts] = useState(initialAlerts);

  const handleProcessRowUpdate = (newRow) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === newRow.id ? newRow : alert))
    );
    return newRow;
  };


  return (
    <div>
      <Navbar/>
      <h1>Investigations</h1>
      <Container maxWidth="sm" className="investigation-Table">
      <DataGrid
          rows={alerts}
          columns={columns}
          processRowUpdate={handleProcessRowUpdate}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          disableSelectionOnClick
          sx={{ overflow: 'clip' }}
        />
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