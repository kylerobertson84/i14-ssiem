// src/components/__tests__/LogsCharts.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import {
    LogsPerHourChart,
    LogsByDeviceChart,
    CpuLoadChart,
    RamUsageChart,
    DiskUsageChart,
} from "../../__mocks__/LogsCharts";
import '@testing-library/jest-dom/extend-expect';

describe("Logs Charts", () => {
    const mockData = [
        { name: "Hour 1", Computer: 20, Networking: 10 },
        { name: "Hour 2", Computer: 30, Networking: 25 },
    ];

    test("renders LogsPerHourChart with provided data", () => {
        render(<LogsPerHourChart data={mockData} />);
        expect(screen.getByText(/Logs Per Hour/i)).toBeInTheDocument();
        expect(screen.getByText(/Mock Bar Chart with data:/i)).toBeInTheDocument();
    });

    test("renders LogsByDeviceChart with provided data", () => {
        render(<LogsByDeviceChart data={mockData} />);
        expect(screen.getByText(/Logs By Device/i)).toBeInTheDocument();
        expect(screen.getByText(/Mock Pie Chart with data:/i)).toBeInTheDocument();
    });

    test("renders CpuLoadChart with provided data", () => {
        render(<CpuLoadChart data={mockData} />);
        expect(screen.getByText(/Mock CPU Load Chart with data:/i)).toBeInTheDocument();
    });

    test("renders RamUsageChart with provided data", () => {
        render(<RamUsageChart data={mockData} />);
        expect(screen.getByText(/Mock RAM Usage Chart with data:/i)).toBeInTheDocument();
    });

    test("renders DiskUsageChart with provided data", () => {
        render(<DiskUsageChart data={mockData} />);
        expect(screen.getByText(/Mock Disk Usage Chart with data:/i)).toBeInTheDocument();
    });
});
