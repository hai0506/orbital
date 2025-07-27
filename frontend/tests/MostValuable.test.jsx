import { render, screen } from "@testing-library/react";
import MostValuable from "../src/components/MostValuable";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest"

vi.mock("recharts", () => ({
  PieChart: ({ children }) => <div data-testid="piechart">{children}</div>,
  Pie: ({ children }) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
}));

describe("most valuable", () => {
  const mockData = [
    { name: "Socks", value: 100 },
    { name: "Shirts", value: 50 },
  ];

  it("renders total by default", () => {
    render(<MostValuable data={mockData} total={150} />);
    expect(screen.getByText("$150 Total")).toBeInTheDocument();
    expect(screen.getByText("Socks")).toBeInTheDocument();
    expect(screen.getByText("Shirts")).toBeInTheDocument();
  });
});