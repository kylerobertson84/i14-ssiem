
import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import apiRequest from '../services/apiRequest';
import API_ENDPOINTS from '../services/apiConfig';
import DOMPurify from 'dompurify';

const CreateAnalystUserForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        department: '',
        jobTitle: '',
        role_id: '', 
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
                if (analystRole) {
                    setFormData(prevData => ({ ...prevData, role_id: analystRole.role_id }));
                }
            })
            .catch(() => setError('Failed to fetch roles'));
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            email: DOMPurify.sanitize(formData.email), //sanitize email input
            password: formData.password, //paswords do not need santisation
            role_id: formData.role_id,
        };

        try {
            // Create the user
            const userResponse = await apiRequest(API_ENDPOINTS.auth.createUser, 'POST', userData);
            const userId = userResponse.user_id;

            // Create the employee profile
            const employeeData = {
                user_id: userId, 
                first_name: DOMPurify.sanitize(formData.firstName), //Sanitize Inputs
                last_name: DOMPurify.sanitize(formData.lastName), //Sanitize Inputs
                department: DOMPurify.sanitize(formData.department), //Sanitize Inputs
                job_title: DOMPurify.sanitize(formData.jobTitle), //Sanitize Inputs
            };
            await apiRequest(API_ENDPOINTS.employee.create, 'POST', employeeData);

            setSuccess('Analyst created successfully');
            setError('');
        } catch {
            setError('Failed to create analyst user');
        }
    };

    return (
        <div>
            <h2>Create Analyst User</h2>
            {error && <p style={{ color: 'red' }}>{DOMPurify.sanitize(error)}</p>}
            {success && <p style={{ color: 'green' }}>{DOMPurify.sanitize(success)}</p>}
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
