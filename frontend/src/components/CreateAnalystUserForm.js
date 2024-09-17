import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import apiRequest from '../services/apiRequest';
import API_ENDPOINTS from '../services/apiConfig';


const CreateAnalystUserForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        department: '',
        jobTitle: '',
        role_id: '', // This will store the role ID for Analyst
    });

    const [roles, setRoles] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch roles to get the ANALYST role ID
        apiRequest(API_ENDPOINTS.roles)
            .then((response) => {
                setRoles(response);
                const analystRole = response.find(role => role.name === 'ANALYST');
                setFormData((prevData) => ({ ...prevData, role_id: analystRole?.id || '' }));
            })
            .catch((err) => setError('Failed to fetch roles'));
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const userData = {
            email: formData.email,
            password: formData.password,
            role_id: formData.role_id,
        };

        const employeeData = {
            user_id: '', // Will be set after user creation
            first_name: formData.firstName,
            last_name: formData.lastName,
            department: formData.department,
            job_title: formData.jobTitle,
        };

        // Create the user
        apiRequest(API_ENDPOINTS.auth.createUser, 'POST', userData)
            .then((response) => {
                const userId = response.user_id;
                employeeData.user_id = userId;

                // Create the employee profile
                return apiRequest(API_ENDPOINTS.auth.createUser, 'POST', employeeData);
            })
            .then(() => {
                setSuccess('Analyst created successfully');
                setError('');
            })
            .catch((err) => setError('Failed to create analyst user'));
    };

    return (
        <div>
            <h2>Create Analyst User</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Job Title"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                <Button type="submit" variant="contained" color="primary">
                    Create Analyst
                </Button>
            </form>
        </div>
    );
};

export default CreateAnalystUserForm;
