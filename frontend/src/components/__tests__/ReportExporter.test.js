import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ReportExporter from "../Reports/ReportExporter";
import '@testing-library/jest-dom';
import { GetApp as GetAppIcon } from "@mui/icons-material";
import { Button } from "@mui/material";

// Mock data for the tests
const mockOnExport = jest.fn();
const report = { id: 1, name: "Sample Report" };

describe("ReportExporter Component", () => {
    test("renders export report button with correct text", () => {
        // Render the component with a report and isExporting as false
        render(
            <ReportExporter report={report} onExport={mockOnExport} isExporting={false} />
        );

        // Check that the button with "Export as PDF" text is rendered
        expect(screen.getByRole('button', { name: /export as pdf/i })).toBeInTheDocument();
    });

    test("calls onExport when export button is clicked", () => {
        // Render the component with a report and isExporting as false
        render(
            <ReportExporter report={report} onExport={mockOnExport} isExporting={false} />
        );

        // Get the button and click it
        const exportButton = screen.getByRole('button', { name: /export as pdf/i });
        fireEvent.click(exportButton);

        // Check that the onExport function was called with the correct report id
        expect(mockOnExport).toHaveBeenCalledWith(report.id);
    });

    test("displays 'Exporting...' when isExporting is true", () => {
        // Render the component with isExporting set to true
        render(
            <ReportExporter report={report} onExport={mockOnExport} isExporting={true} />
        );

        // Check that the button displays "Exporting..."
        expect(screen.getByRole('button', { name: /exporting/i })).toBeInTheDocument();
    });

    test("disables the button when no report is provided", () => {
        // Render the component without a report
        render(
            <ReportExporter report={null} onExport={mockOnExport} isExporting={false} />
        );

        // Check that the button is disabled
        const exportButton = screen.getByRole('button', { name: /export as pdf/i });
        expect(exportButton).toBeDisabled();
    });
});
