import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from "vitest";
import Fundraiser from '../src/components/Fundraiser'
import "@testing-library/jest-dom/vitest"

const listing = {
  post_id: 1,
  title: "Project 1",
  location: "National University of Singapore",
  start_date: new Date("2025-06-17"),
  end_date: new Date("2025-06-29"),
  start_time: new Date("2025-06-17T08:45:00"),
  end_time: new Date("2025-06-17T13:45:00"),
  commission: 30,
  categories: ["Art & Crafts", "Accessories", "Books"]
};

const offer = {
  offer_id: 101,
  vendor: { username: "Bob", email: "test@test.com" },
  allDays: "No",
  selectedDays: [new Date("2025-06-19"), new Date("2025-06-20")],
  selectedCategories: ["Art & Crafts", "Accessories"],
  commission: 25,
  remarks: "Looking forward to participating.",
  status: "confirmed",
  listing,
  inventory_file: "https://example.com/inventory.xlsx"
};

const fundraiser = {
  listing,
  vendors: [offer],
  allDays: "No",
  selectedDays: [new Date("2025-06-19"), new Date("2025-06-20")],
  selectedCategories: ["Art & Crafts", "Accessories"],
  commission: 25,
  remarks: "Looking forward to participating.",
  inventory_file: "https://example.com/inventory.xlsx"
};

describe('Fundraiser (vendor view)', () => {
  it('opens modal and shows vendor details', async () => {
    render(<Fundraiser fundraiser={fundraiser} role="vendor" />)

    // hover over fundraiser
    const card = screen.getAllByText('Project 1')[0].closest('div');
    if (!card) throw new Error("Card container not found");

    fireEvent.mouseEnter(card);


    // check it now
    const cta = await screen.findByText(/check it out!/i)
    fireEvent.click(cta)
    const download = await screen.findByRole('link', { name: /download inventory file/i })

    // test download
    const modal = download.closest('div');
    if (!modal) throw new Error("Modal container not found");
    expect(within(modal).getByText(/25% of revenue/i)).toBeInTheDocument();
    expect(download).toHaveAttribute('href', offer.inventory_file)
  })
})
