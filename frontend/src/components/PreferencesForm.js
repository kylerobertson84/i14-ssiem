import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


export default function ControlledRadioButtonsGroup() {
    const [value, setValue] = React.useState('female');
  
    const handleChange = (event) => {
      setValue(event.target.value);
    };
  
    return (
      <FormControl>
        <FormLabel id="Alert-emails">Recieve Alert email notifications</FormLabel>
        <RadioGroup
            row
            aria-labelledby="Alert-emails"
            name="Alert-emails"
            value={value}
            onChange={handleChange}
        >
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
    );
  }