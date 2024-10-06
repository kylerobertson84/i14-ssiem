import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MockPreferencesForm from '../../__mocks__/PreferencesForm';

describe('PreferencesForm Component', () => {
    test('renders the form with initial fields', () => {
        render(<MockPreferencesForm />);

        expect(screen.getByLabelText(/Preference 1/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Preference 2/i)).toBeInTheDocument();
    });

    test('calls onSubmit when the form is submitted', () => {
        // Mock the onSubmit function
        const mockOnSubmit = jest.fn();

        // Render the MockPreferencesForm with the mocked onSubmit prop
        render(<MockPreferencesForm onSubmit={mockOnSubmit} />);

        // Simulate form submission
        fireEvent.click(screen.getByText(/Save Preferences/i));

        // Ensure the onSubmit handler is called
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
});
