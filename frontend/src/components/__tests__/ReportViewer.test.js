import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReportViewer from '../Reports/ReportViewer';

describe('ReportViewer Component', () => {
    const mockOnUpdate = jest.fn();
    const mockReport = {
        id: 1,
        title: 'Test Report',
        user: { email: 'test@example.com' },
        created_at: '2024-01-01',
        updated_at: '2024-01-02',
        type: 'security_incident',
        status: 'open',
        rules: [],
        description: 'Test description',
    };
    const mockRules = [{ id: 1, name: 'Rule 1' }];

    test('renders report details', () => {
        render(<ReportViewer report={mockReport} onUpdate={mockOnUpdate} rules={mockRules} />);
        expect(screen.getByText(/Test Report/i)).toBeInTheDocument();
        expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
        expect(screen.getByText(/Test description/i)).toBeInTheDocument();
    });

    test('enables edit mode when edit button is clicked', () => {
        render(<ReportViewer report={mockReport} onUpdate={mockOnUpdate} rules={mockRules} />);
        const editButton = screen.getByText(/Edit/i);
        fireEvent.click(editButton);
        expect(screen.getByText(/Save/i)).toBeInTheDocument();
    });

    test('calls onUpdate when save button is clicked', () => {
        render(<ReportViewer report={mockReport} onUpdate={mockOnUpdate} rules={mockRules} />);
        const editButton = screen.getByText(/Edit/i);
        fireEvent.click(editButton);
        const saveButton = screen.getByText(/Save/i);
        fireEvent.click(saveButton);
        expect(mockOnUpdate).toHaveBeenCalled();
    });
});
