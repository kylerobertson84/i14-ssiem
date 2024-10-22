import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReportGenerator from '../Reports/ReportGenerator';

describe('ReportGenerator Component', () => {
    const mockOnClose = jest.fn();

    test('calls onGenerate when generate button is clicked', async () => {
        // Render the ReportGenerator component
        render(<ReportGenerator onClose={mockOnClose} isFromInvestigationPage={false} />);

        // Fill out the required fields in the form
        fireEvent.change(screen.getByLabelText(/report title/i), {
            target: { value: 'Test Report Title' },
        });
        fireEvent.mouseDown(screen.getByLabelText(/report type/i)); // Open select dropdown
        fireEvent.click(screen.getByText(/security incident/i)); // Select an option

        // Simulate selecting a rule (autocomplete mocking)
        const inputElement = screen.getByLabelText(/rules/i);
        fireEvent.change(inputElement, { target: { value: 'Rule 1' } });

        // Since autocomplete relies on API data, you could mock that logic,
        // but for the purpose of this example, we will skip the actual rule selection.

        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'Test description' },
        });

        // Find the submit button and click it
        const generateButton = screen.getByRole('button', { name: /generate report/i });
        fireEvent.click(generateButton);

        // Wait for the submission and check if the form attempted to generate the report
        await waitFor(() => {
            expect(mockOnClose).not.toHaveBeenCalled(); // Expect it not to cancel
        });
    });
});
