// __mocks__/Login.js
import React from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';

const MockLogin = ({ onSubmit, message }) => {
    const handleLogin = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit();
    };

    return (
        <Box component="form" onSubmit={handleLogin} noValidate>
            <Typography variant="h5" gutterBottom>
                Sign In
            </Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
            />
            <Button type="submit" fullWidth variant="contained">
                Sign In
            </Button>
            {message && (
                <Typography color="error" align="center" sx={{ mt: 2 }}>
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default MockLogin;
