import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';


export default function ControlledRadioButtonsGroup() {
    const [value, setValue] = React.useState('Yes');
  
    const handleChange = (event) => {
      setValue(event.target.value);
    };
  
    return (
      <Box 
        sx={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '1.5rem',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          mb: 4,
        }}
      >
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormLabel 
            id="alert-emails" 
            sx={{ 
              color: '#333', 
              fontWeight: 'bold', 
              fontSize: '1.1rem', 
              mb: 2,
              display: 'block',
            }}
          >
            Receive Alert Email Notifications
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="alert-emails"
            name="alert-emails"
            value={value}
            onChange={handleChange}
            sx={{
              justifyContent: 'center',
            }}
          >
            <FormControlLabel 
              value="Yes" 
              control={<Radio sx={{ color: '#007bff' }} />} 
              label="Yes" 
              sx={{ 
                '& .MuiFormControlLabel-label': {
                  color: '#333',
                  fontSize: '1rem',
                },
              }}
            />
            <FormControlLabel 
              value="No" 
              control={<Radio sx={{ color: '#007bff' }} />} 
              label="No" 
              sx={{ 
                '& .MuiFormControlLabel-label': {
                  color: '#333',
                  fontSize: '1rem',
                },
              }}
            />
          </RadioGroup>
        </FormControl>
      </Box>
    );
  }