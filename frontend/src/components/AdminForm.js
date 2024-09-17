import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';



const AdminForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeRole, setEmployeeRole] = useState('');
  const [error, setError] = useState(false); // To track role selection validation

  function handleSubmit(event) {
    event.preventDefault();

    // Validate if employee role is selected
    if (!employeeRole) {
      setError(true);
      return; // Don't proceed if the role is not selected
    }

    console.log(firstName, lastName, email, password, employeeRole);
    // Continue with form submission logic, e.g., sending data to an API
  }

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '2rem', 
        backgroundColor: '#f9f9f9', 
        borderRadius: '8px', 
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography 
        variant="h4" 
        sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold', color: '#333' }}
      >
        Employee User Registration
      </Typography>

      <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
        <TextField
          type="text"
          variant="outlined"
          color="secondary"
          label="First Name"
          onChange={e => setFirstName(e.target.value)}
          value={firstName}
          fullWidth
          required
          sx={{ backgroundColor: '#fff', borderRadius: '4px' }}
        />
        <TextField
          type="text"
          variant="outlined"
          color="secondary"
          label="Last Name"
          onChange={e => setLastName(e.target.value)}
          value={lastName}
          fullWidth
          required
          sx={{ backgroundColor: '#fff', borderRadius: '4px' }}
        />
      </Stack>

      <TextField
        type="email"
        variant="outlined"
        color="secondary"
        label="Email"
        onChange={e => setEmail(e.target.value)}
        value={email}
        fullWidth
        required
        sx={{ backgroundColor: '#fff', mb: 4, borderRadius: '4px' }}
      />

      <TextField
        type="password"
        variant="outlined"
        color="secondary"
        label="Password"
        onChange={e => setPassword(e.target.value)}
        value={password}
        required
        fullWidth
        sx={{ backgroundColor: '#fff', mb: 4, borderRadius: '4px' }}
      />

      <FormLabel 
        id="employee-role" 
        sx={{ color: '#333', fontWeight: 'bold', mb: 1 }}
      >
        Employee Role
      </FormLabel>
      <RadioGroup
        aria-labelledby="employee-role"
        name="employee-role-group"
        onChange={e => {
          setEmployeeRole(e.target.value);
          setError(false); // Clear error when role is selected
        }}
        value={employeeRole}
        sx={{ mb: 3 }}
      >
        <FormControlLabel 
          value="security-analyst" 
          control={<Radio color="secondary" />} 
          label="Security Analyst" 
        />
        <FormControlLabel 
          value="admin" 
          control={<Radio color="secondary" />} 
          label="Admin" 
        />
      </RadioGroup>
      {error && (
        <FormHelperText 
          sx={{
            color: 'red', 
            fontSize: '14px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
          }}
        >
          Please select an employee role
        </FormHelperText>
      )}

      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
        sx={{
          backgroundColor: '#007bff', 
          ':hover': { backgroundColor: '#0056b3' }, 
          padding: '12px 0', 
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default AdminForm;