import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ListingDetails from "../src/components/ListingDetails";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";

describe("ListingDetails", () => {
  const sampleFields = {
    title: "Project 1",
    location: "National University of Singapore",
    start_date: "2025-06-17",
    end_date: "2025-06-29",
    start_time: "08:45:00",
    end_time: "13:45:00",
    commission: 30,
    categories: ["Art & Crafts", "Accessories", "Books"],
  };

  it("renders listing details correctly", () => {
    render(
      <MemoryRouter>
        <ListingDetails fields={sampleFields} />
      </MemoryRouter>
    );

    // Title
    expect(screen.getByText("Project 1")).toBeInTheDocument();

    // Location
    expect(screen.getByText("National University of Singapore")).toBeInTheDocument();

    // Dates
    expect(screen.getByText("17/06/2025 - 29/06/2025")).toBeInTheDocument();

    // Time
    expect(screen.getByText("08:45 - 13:45")).toBeInTheDocument();

    // Commission
    expect(screen.getByText("30% of Total Revenue")).toBeInTheDocument();

    // Categories 
    expect(screen.getByText("Art & Crafts")).toBeInTheDocument();
  });
});

