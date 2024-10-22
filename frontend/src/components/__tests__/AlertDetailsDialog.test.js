// src/components/__tests__/AlertDetailsDialog.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MockAlertDetailsDialog from '../../__mocks__/AlertDetailsDialog';

const alertData = {
    id: 1,
    created_at: '2023-10-01T12:00:00Z',
    severity: 'High',
    event: {
        hostname: 'localhost',
        EventID: '1001',
        UserID: 'user123',
    },
    rule: {
        name: 'Unauthorized Access', // This text is expected in the test
    },
};

const mockUsers = [
    { id: 1, email: 'user1@example.com' },
    { id: 2, email: 'user2@example.com' },
];

describe('MockAlertDetailsDialog', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    test('renders the mock dialog with alert details when open', () => {
        render(
            <MockAlertDetailsDialog
                alert={alertData}
                open={true}
                onClose={jest.fn()}
                onAssign={jest.fn()}
                users={mockUsers}
            />
        );

        // Assertions to check if the expected text is present
        expect(screen.getByText('Mock Alert Details')).toBeInTheDocument();
        expect(screen.getByText(/High/i)).toBeInTheDocument();
        expect(screen.getByText(/Unauthorized Access/i)).toBeInTheDocument();
        expect(screen.getByText(/Event ID: 1001/i)).toBeInTheDocument();
        expect(screen.getByText(/Hostname: localhost/i)).toBeInTheDocument();
        expect(screen.getByText(/user1@example.com/i)).toBeInTheDocument();
        expect(screen.getByText(/user2@example.com/i)).toBeInTheDocument();
    });

    test('calls onClose when the close button is clicked', () => {
        const onCloseMock = jest.fn();
        render(
            <MockAlertDetailsDialog
                alert={alertData}
                open={true}
                onClose={onCloseMock}
                onAssign={jest.fn()}
                users={mockUsers}
            />
        );

        const closeButton = screen.getByText('Close');
        closeButton.click(); // Simulate button click
        expect(onCloseMock).toHaveBeenCalled(); // Check if onClose was called
    });

    test('calls onAssign when the assign button is clicked', () => {
        const onAssignMock = jest.fn();
        render(
            <MockAlertDetailsDialog
                alert={alertData}
                open={true}
                onClose={jest.fn()}
                onAssign={onAssignMock}
                users={mockUsers}
            />
        );

        const assignButton = screen.getByText('Assign');
        assignButton.click(); // Simulate button click
        expect(onAssignMock).toHaveBeenCalled(); // Check if onAssign was called
    });
});
