import { render, screen } from "@testing-library/react";
import BestVendor from "../src/components/BestVendor";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest"

vi.mock("recharts", () => ({
  PieChart: ({ children }) => <div data-testid="piechart">{children}</div>,
  Pie: ({ children }) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
}));

describe("BestVendor", () => {
  const mockData = [
    { name: "Vendor A", value: 100 },
    { name: "Vendor B", value: 50 },
  ];

  it("renders total by default", () => {
    render(<BestVendor data={mockData} total={150} />);
    expect(screen.getByText("$150.00 Total")).toBeInTheDocument();
    expect(screen.getByText("Vendor A")).toBeInTheDocument();
    expect(screen.getByText("Vendor B")).toBeInTheDocument();
  });
});

