import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import Offer from "../src/components/Offer"
import "@testing-library/jest-dom/vitest"
import { MemoryRouter } from "react-router-dom"

vi.mock("../src/components/ListingDetails", () => ({
  default: () => <div>ListingDetailsMock</div>,
}))

describe("Offer", () => {
    const listing = {
      title: "Project 1",
      location: "NUS",
      start_date: "2025-06-17",
      end_date: "2025-06-29",
      start_time: "08:45:00",
      end_time: "13:45:00",
      commission: 30,
      categories: ["Art & Crafts", "Accessories"],
    }

    const offer = {
      offer_id: 1,
      listing,
      vendor: { username: "Bob" },
      allDays: "No",
      selectedDays: ["2025-06-19", "2025-06-20"],
      selectedCategories: ["Art & Crafts"],
      commission: 25,
      remarks: "",
      status: "pending",
    }

    it("shows vendor card, reveals button on hover, opens modal", () => {
      const onChangeStatus = vi.fn()

      render(
        <MemoryRouter>
          <Offer offer={offer} onChangeStatus={onChangeStatus} />
        </MemoryRouter>
      )

      // vendor name visible
      expect(screen.getByText("Bob")).toBeInTheDocument()

      // button hidden until hover
      expect(screen.queryByText("Check it out!")).not.toBeInTheDocument()

      // hover over component
      fireEvent.mouseEnter(screen.getByText("Bob").parentElement)

      expect(screen.getByText("Check it out!")).toBeInTheDocument()

      // open component
      fireEvent.click(screen.getByText("Check it out!"))
      expect(screen.getByText("ListingDetailsMock")).toBeInTheDocument()

      // approve / reject buttons
      expect(screen.getByRole("button", { name: "Approve Offer" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Reject Offer" })).toBeInTheDocument()
    })
})
