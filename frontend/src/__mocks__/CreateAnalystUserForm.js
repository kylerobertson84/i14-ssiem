import React from 'react';
import { TextField, Button, Typography } from '@mui/material';

const MockCreateAnalystUserForm = ({ onSubmit, successMessage, errorMessage }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit();
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h5">Create Analyst User</Typography>
            {successMessage && <Typography color="green">{successMessage}</Typography>}
            {errorMessage && <Typography color="red">{errorMessage}</Typography>}
            <TextField label="Email" name="email" required />
            <TextField label="Password" name="password" type="password" required />
            <TextField label="First Name" name="firstName" />
            <TextField label="Last Name" name="lastName" />
            <Button type="submit">Create Analyst</Button>
        </form>
    );
};

export default MockCreateAnalystUserForm;
