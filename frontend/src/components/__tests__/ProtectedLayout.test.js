import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProtectedLayout from '../ProtectedLayout';
import { MemoryRouter } from 'react-router-dom';

describe('ProtectedLayout Component', () => {
    test('renders Outlet component', () => {
        render(
            <MemoryRouter>
                <ProtectedLayout />
            </MemoryRouter>
        );

        expect(screen.getByTestId('protected-layout')).toBeInTheDocument();
    });
});
