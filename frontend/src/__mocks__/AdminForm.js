// __mocks__/AdminForm.js
import React from 'react';
import { Box, Typography, Button, TextField, CircularProgress, FormHelperText } from '@mui/material';

const MockAdminForm = ({ formData, onInputChange, onSubmit, loading, error, success, roles }) => {
    return (
        <Box
            component="form"
            onSubmit={onSubmit}
            sx={{
                maxWidth: "600px",
                margin: "0 auto",
                padding: "2rem",
                backgroundColor: "#f9f9f9",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Typography
                variant="h4"
                sx={{ textAlign: "center", mb: 4, fontWeight: "bold", color: "#333" }}
            >
                Employee User Registration
            </Typography>

            <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="First Name"
                name="firstName"
                onChange={onInputChange}
                value={formData.firstName}
                fullWidth
                required
                sx={{ backgroundColor: "#fff", mb: 2 }}
            />

            <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Last Name"
                name="lastName"
                onChange={onInputChange}
                value={formData.lastName}
                fullWidth
                required
                sx={{ backgroundColor: "#fff", mb: 2 }}
            />

            <TextField
                type="email"
                variant="outlined"
                color="secondary"
                label="Email"
                name="email"
                onChange={onInputChange}
                value={formData.email}
                fullWidth
                required
                sx={{ backgroundColor: "#fff", mb: 2 }}
            />

            <TextField
                type="password"
                variant="outlined"
                color="secondary"
                label="Password"
                name="password"
                onChange={onInputChange}
                value={formData.password}
                required
                fullWidth
                sx={{ backgroundColor: "#fff", mb: 2 }}
            />

            <Typography sx={{ color: "#333", fontWeight: "bold", mb: 1 }}>
                Employee Role
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : roles.length > 0 ? (
                roles.map((role) => (
                    <div key={role.role_id}>
                        <label>
                            <input
                                type="radio"
                                name="role_id"
                                value={role.role_id}
                                onChange={onInputChange}
                                checked={formData.role_id === role.role_id}
                            />
                            {role.name}
                        </label>
                    </div>
                ))
            ) : (
                <Typography color="error">No roles available</Typography>
            )}

            {error && (
                <FormHelperText sx={{ color: "red", fontSize: "14px", fontWeight: "bold", marginBottom: "16px" }}>
                    {error}
                </FormHelperText>
            )}

            {success && (
                <FormHelperText sx={{ color: "green", fontSize: "14px", fontWeight: "bold", marginBottom: "16px" }}>
                    {success}
                </FormHelperText>
            )}

            <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={loading}
                sx={{
                    backgroundColor: loading ? "#ccc" : "#007bff",
                    ":hover": loading ? null : { backgroundColor: "#0056b3" },
                    padding: "12px 0",
                    fontSize: "16px",
                    fontWeight: "bold",
                }}
            >
                {loading ? "Submitting..." : "Submit"}
            </Button>
        </Box>
    );
};

export default MockAdminForm;
