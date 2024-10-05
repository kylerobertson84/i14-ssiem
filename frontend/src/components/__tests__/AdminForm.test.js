// src/components/__tests__/AdminForm.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MockAdminForm from '../../__mocks__/AdminForm';
import '@testing-library/jest-dom/extend-expect';

const mockRoles = [
    { role_id: '1', name: 'Admin' },
    { role_id: '2', name: 'User' },
];

describe('MockAdminForm', () => {
    const formData = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role_id: '',
    };

    const handleInputChange = jest.fn();
    const handleSubmit = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    test('renders the mock admin form', () => {
        render(
            <MockAdminForm
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                loading={false}
                error=""
                success=""
                roles={mockRoles}
            />
        );

        expect(screen.getByText('Employee User Registration')).toBeInTheDocument();
        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByText('User')).toBeInTheDocument();
    });

    test('calls handleInputChange when input fields change', () => {
        render(
            <MockAdminForm
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                loading={false}
                error=""
                success=""
                roles={mockRoles}
            />
        );

        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
        expect(handleInputChange).toHaveBeenCalled(); // Check if input change handler was called
    });

    test('calls handleSubmit when the form is submitted', () => {
        render(
            <MockAdminForm
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                loading={false}
                error=""
                success=""
                roles={mockRoles}
            />
        );

        fireEvent.click(screen.getByText('Submit')); // Simulate form submission
        expect(handleSubmit).toHaveBeenCalled(); // Check if submit handler was called
    });

    test('displays loading state', () => {
        render(
            <MockAdminForm
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                loading={true}
                error=""
                success=""
                roles={mockRoles}
            />
        );

        expect(screen.getByText('Submitting...')).toBeInTheDocument(); // Check loading state text
    });

    test('displays error message', () => {
        render(
            <MockAdminForm
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                loading={false}
                error="Failed to create user"
                success=""
                roles={mockRoles}
            />
        );

        expect(screen.getByText(/Failed to create user/i)).toBeInTheDocument(); // Check error message
    });

    test('displays success message', () => {
        render(
            <MockAdminForm
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                loading={false}
                error=""
                success="User created successfully"
                roles={mockRoles}
            />
        );

        expect(screen.getByText(/User created successfully/i)).toBeInTheDocument(); // Check success message
    });
});
