import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MockSearchBar from '../../__mocks__/SearchBar';

describe('SearchBar Component', () => {
    test('renders the search input', () => {
        const mockSetQuery = jest.fn();
        render(<MockSearchBar query="" setQuery={mockSetQuery} />);

        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
    });

    test('calls setQuery when input value changes', () => {
        const mockSetQuery = jest.fn();
        render(<MockSearchBar query="" setQuery={mockSetQuery} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'test' } });

        expect(mockSetQuery).toHaveBeenCalledWith('test');
    });
});
