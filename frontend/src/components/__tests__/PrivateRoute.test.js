import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";
import { useAuth } from "../../services/AuthContext";
import { CircularProgress } from "@mui/material";

// Mock the useAuth hook
jest.mock("../../services/AuthContext");

describe("PrivateRoute Component", () => {
    test("renders loading state when loading is true", () => {
        useAuth.mockReturnValue({
            user: null,
            loading: true,
            hasRole: jest.fn(),
        });

        render(
            <Router>
                <PrivateRoute />
            </Router>
        );

        // Check if CircularProgress is shown during loading
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("bypasses authentication when REACT_APP_BYPASS_AUTH is true", () => {
        process.env.REACT_APP_BYPASS_AUTH = "true";

        useAuth.mockReturnValue({
            user: null,
            loading: false,
            hasRole: jest.fn(),
        });

        render(
            <Router>
                <PrivateRoute>
                    <div data-testid="protected-content">Protected Content</div>
                </PrivateRoute>
            </Router>
        );

        // Check if content is rendered when auth is bypassed
        expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });

    test("redirects to login when user is not authenticated", () => {
        process.env.REACT_APP_BYPASS_AUTH = "false";

        useAuth.mockReturnValue({
            user: null,
            loading: false,
            hasRole: jest.fn(),
        });

        render(
            <Router>
                <PrivateRoute />
            </Router>
        );

        // Check if redirected to /login
        expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
        // Usually tested using react-router mock or by verifying <Navigate>
    });

    test("renders children or Outlet when user is authenticated", () => {
        useAuth.mockReturnValue({
            user: { id: 1, name: "Test User" },
            loading: false,
            hasRole: jest.fn().mockReturnValue(true),
        });

        render(
            <Router>
                <PrivateRoute>
                    <div data-testid="protected-content">Protected Content</div>
                </PrivateRoute>
            </Router>
        );

        // Check if protected content is shown
        expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });

    test("redirects to dashboard when user lacks the required role", () => {
        useAuth.mockReturnValue({
            user: { id: 1, name: "Test User" },
            loading: false,
            hasRole: jest.fn().mockReturnValue(false),
        });

        render(
            <Router>
                <PrivateRoute roles={["admin"]}>
                    <div data-testid="protected-content">Protected Content</div>
                </PrivateRoute>
            </Router>
        );

        // Check if redirected to /dashboard
        expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
        // Usually tested using react-router mock or by verifying <Navigate>
    });
});
