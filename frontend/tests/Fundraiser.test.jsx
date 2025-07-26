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
  inventory: [],
};

it("shows modal when vendor clicks on 'Check it out!' and fundraiser is yet to start", () => {
  render(
    <MemoryRouter>
      <Fundraiser fundraiser={mockFundraiser} role="vendor" />
    </MemoryRouter>
  );

  // Hover to reveal the button
  fireEvent.mouseEnter(screen.getByText(/Cool Fundraiser/i));
  
  const button = screen.getByRole("button", { name: /Check it out!/i });
  fireEvent.click(button);

  expect(screen.getByText(/Terms and Conditions/i)).toBeInTheDocument(); // Modal content
});

