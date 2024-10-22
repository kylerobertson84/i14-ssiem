import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Alert from '../Alerts';

test('renders the alert component with correct data', () => {
    const alertData = {
        id: 1,
        hostname: 'localhost',
        event_id: 1001,
        severity: 'High',
        event_time: '2023-10-01T12:00:00Z',
        message: 'Unauthorized access detected.',
        ip_address: '192.168.1.1',
        user_id: 'user123',
        rule_triggered: 'Suspicious Login',
        comments: 'Investigate ASAP'
    };

    render(<Alert alert={alertData} />);

    // Target the alert card using test id
    const alertCard = screen.getByTestId('alert');

    // Check if the component renders the data correctly using within
    expect(within(alertCard).getByText(/Alert #1/i)).toBeInTheDocument();
    expect(within(alertCard).getByText(/Hostname/i)).toBeInTheDocument();
    expect(within(alertCard).getByText(/localhost/i)).toBeInTheDocument();
    expect(within(alertCard).getByText(/Event ID/i)).toBeInTheDocument();
    expect(within(alertCard).getByText(/1001/i)).toBeInTheDocument();
    expect(within(alertCard).getByText(/Severity/i)).toBeInTheDocument();
    expect(within(alertCard).getByText(/High/i)).toBeInTheDocument();
    expect(within(alertCard).getByText(/Event Time/i)).toBeInTheDocument();
    expect(within(alertCard).getByText(/2023-10-01T12:00:00Z/i)).toBeInTheDocument();
    expect(within(alertCard).getByText(/Message/i)).toBeInTheDocument();
    expect(within(alertCard).getByText(/Unauthorized access detected./i)).toBeInTheDocument();
    expect(within(alertCard).getByText(/IP Address/i)).toBeInTheDocument();
    expect(within(alertCard).getByText(/192.168.1.1/i)).toBeInTheDocument();
    expect(within(alertCard).getByText(/User ID/i)).toBeInTheDocument();
    expect(within(alertCard).getByText(/user123/i)).toBeInTheDocument();
    expect(within(alertCard).getByText(/Rule Triggered/i)).toBeInTheDocument();
    expect(within(alertCard).getByText(/Suspicious Login/i)).toBeInTheDocument();
    expect(within(alertCard).getByText(/Comments/i)).toBeInTheDocument();
    expect(within(alertCard).getByText(/Investigate ASAP/i)).toBeInTheDocument();
});

test('renders the Open Investigation button', () => {
    const alertData = {
        id: 1,
        hostname: 'localhost',
        event_id: 1001,
        severity: 'High',
        event_time: '2023-10-01T12:00:00Z',
        message: 'Unauthorized access detected.',
        ip_address: '192.168.1.1',
        user_id: 'user123',
        rule_triggered: 'Suspicious Login',
        comments: 'Investigate ASAP'
    };

    render(<Alert alert={alertData} />);

    // Check if the button is rendered
    const button = screen.getByRole('button', { name: /Open Investigation/i });
    expect(button).toBeInTheDocument();
});
