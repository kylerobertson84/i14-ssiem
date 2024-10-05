import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReportList from '../Reports/ReportList';

describe('ReportList Component', () => {
    const mockOnSelect = jest.fn();
    const mockOnDelete = jest.fn();

    test('renders report list with available reports', () => {
        render(
            <ReportList
                onSelect={mockOnSelect}
                onDelete={mockOnDelete}
                loading={false}
            />
        );
        expect(screen.getByText(/Available Reports/i)).toBeInTheDocument();
    });

    test('calls onSelect when a report is clicked', () => {
        const reports = [
            { id: 1, title: 'Test Report', type: 'security_incident', status: 'open', updated_at: '2024-01-01' },
        ];
        render(
            <ReportList
                onSelect={mockOnSelect}
                onDelete={mockOnDelete}
                loading={false}
            />
        );
        const report = screen.getByText(/Test Report/i);
        fireEvent.click(report);
        expect(mockOnSelect).toHaveBeenCalled();
    });

    test('calls onDelete when delete button is clicked', () => {
        const reports = [
            { id: 1, title: 'Test Report', type: 'security_incident', status: 'open', updated_at: '2024-01-01' },
        ];
        render(
            <ReportList
                onSelect={mockOnSelect}
                onDelete={mockOnDelete}
                loading={false}
            />
        );
        const deleteButton = screen.getByLabelText('Delete Report');
        fireEvent.click(deleteButton);
        expect(mockOnDelete).toHaveBeenCalled();
    });
});
