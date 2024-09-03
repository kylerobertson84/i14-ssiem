import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function MyForm() {
  return (
    <form>
      <TextField
        label="First Name"
        variant="outlined"
        fullWidth
        margin="normal"
      />
        <TextField
        label="Last Name"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <FormLabel id="employee=role">Employee Role</FormLabel>
      <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="Security-anaylist"
            name="radio-buttons-group"
            >
            <FormControlLabel value="security-anaylist" control={<Radio />} label="Security-anaylist" />
            <FormControlLabel value="admin" control={<Radio />} label="Admin" />
        </RadioGroup>

      <Button
        variant="contained"
        color="primary"
        type="submit"
      >
        Submit
      </Button>
    </form>
  );
}

export default MyForm;