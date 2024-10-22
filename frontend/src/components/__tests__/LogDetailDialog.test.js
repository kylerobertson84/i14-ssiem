// src/components/__tests__/LogDetailDialog.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MockLogDetailDialog from '../../__mocks__/LogDetailDialog';
import '@testing-library/jest-dom/extend-expect';

describe('LogDetailDialog', () => {
    const logData = {
        id: 1,
        iso_timestamp: '2023-10-01T12:00:00Z',
        hostname: 'localhost',
        message: 'This is a test log message',
    };

    test('renders the dialog with log details when open', () => {
        render(<MockLogDetailDialog log={logData} open={true} onClose={jest.fn()} />);

        expect(screen.getByTestId('log-detail-dialog')).toBeInTheDocument();
        expect(screen.getByText(/Log Details/i)).toBeInTheDocument();
        expect(screen.getByText(/Log ID: 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Timestamp: 2023-10-01T12:00:00Z/i)).toBeInTheDocument();
        expect(screen.getByText(/Hostname: localhost/i)).toBeInTheDocument();
        expect(screen.getByText(/Message: This is a test log message/i)).toBeInTheDocument();
    });

    test('does not render the dialog when closed', () => {
        render(<MockLogDetailDialog log={logData} open={false} onClose={jest.fn()} />);

        expect(screen.queryByTestId('log-detail-dialog')).not.toBeInTheDocument();
    });

    test('calls onClose when close button is clicked', () => {
        const mockOnClose = jest.fn();
        render(<MockLogDetailDialog log={logData} open={true} onClose={mockOnClose} />);

        fireEvent.click(screen.getByTestId('close-button'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});
