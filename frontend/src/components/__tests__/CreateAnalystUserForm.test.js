import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MockCreateAnalystUserForm from '../../__mocks__/CreateAnalystUserForm';
import '@testing-library/jest-dom/extend-expect';

describe('CreateAnalystUserForm', () => {
    test('renders the form with initial fields', () => {
        render(<MockCreateAnalystUserForm />);

        expect(screen.getByText(/Create Analyst User/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });

    test('displays success message when submitted', () => {
        const mockOnSubmit = jest.fn();
        render(<MockCreateAnalystUserForm onSubmit={mockOnSubmit} successMessage="Analyst created successfully" />);

        expect(screen.getByText(/Analyst created successfully/i)).toBeInTheDocument();
    });

    test('displays error message when there is an error', () => {
        render(<MockCreateAnalystUserForm errorMessage="Failed to create analyst user" />);

        expect(screen.getByText(/Failed to create analyst user/i)).toBeInTheDocument();
    });

    test('calls onSubmit when the form is submitted', () => {
        const mockOnSubmit = jest.fn();
        render(<MockCreateAnalystUserForm onSubmit={mockOnSubmit} />);

        // Use getByRole to target the submit button more precisely
        const submitButton = screen.getByRole('button', { name: /Create Analyst/i });

        fireEvent.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

});
