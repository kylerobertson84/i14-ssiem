// src/components/__tests__/Login.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MockLogin from '../../__mocks__/Login';
import '@testing-library/jest-dom/extend-expect';

describe('MockLogin', () => {
    test('renders the login form', () => {
        render(<MockLogin />);

        expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    test('displays error message when provided', () => {
        render(<MockLogin message="Invalid credentials" />);

        expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });

    test('calls onSubmit when form is submitted', () => {
        const mockSubmit = jest.fn();
        render(<MockLogin onSubmit={mockSubmit} />);

        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
        expect(mockSubmit).toHaveBeenCalled();
    });
});
