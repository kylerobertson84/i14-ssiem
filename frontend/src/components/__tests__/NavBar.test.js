import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';  // Import jest-dom matchers
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../NavBar';
import { AuthProvider } from '../../services/AuthContext';

describe('NavBar Component', () => {
    test('renders Simple SIEM logo', () => {
        render(
            <AuthProvider>
                <MemoryRouter>
                    <NavBar />
                </MemoryRouter>
            </AuthProvider>
        );
        // Corrected to match the actual alt text
        const logoElement = screen.getByAltText(/logo/i);
        expect(logoElement).toBeInTheDocument();
    });

    test('renders login button if no user is logged in', () => {
        render(
            <AuthProvider>
                <MemoryRouter>
                    <NavBar />
                </MemoryRouter>
            </AuthProvider>
        );
        const loginButton = screen.getByText(/login/i);
        expect(loginButton).toBeInTheDocument();
    });
});
