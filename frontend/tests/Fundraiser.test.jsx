import { render, fireEvent, screen } from "@testing-library/react";
import Fundraiser from "@/components/Fundraiser";
import { MemoryRouter } from "react-router-dom";
import { it, expect } from "vitest";

const mockFundraiser = {
  fundraiser_id: 1,
  status: "yet to start",
  offer: {
    listing: {
      title: "Cool Fundraiser",
      categories: [],
      commission: 10,
    },
    commission: 10,
    selectedDays: [],
  },
  inventory: [{ Item: "Necklace", Price: 15.0, Quantity: 40, Remarks: "Handmade" },],
};

it("shows modal when vendor clicks on 'Check it out!' and fundraiser is yet to start", () => {
    render(
      <MemoryRouter>
        <Fundraiser fundraiser={mockFundraiser} role="vendor" />
      </MemoryRouter>
    );

    // Hover to reveal the button
    fireEvent.mouseEnter(screen.getByText(/Cool Fundraiser/i));
    
    // check modal is rendered
    const button1 = screen.getByRole("button", { name: /Check it out!/i });
    fireEvent.click(button1);
    expect(screen.getAllByText(/Terms and Conditions/i).length).toBeGreaterThan(0);

    // inventory opens
    const button2 = screen.getByRole("button", { name: /View Inventory/i });
    fireEvent.click(button2);
    expect(screen.getByText(/Your Inventory/i));
    expect(screen.getByText(/Item/i));
    expect(screen.getByText(/Price/i));
    expect(screen.getByText(/Quantity/i));
    expect(screen.getByText(/Remarks/i));
});

