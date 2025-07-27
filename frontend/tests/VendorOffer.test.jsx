import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { describe, it, expect, vi, afterEach } from "vitest"
import VendorOffer from "../src/components/VendorOffer"
import "@testing-library/jest-dom/vitest"
import { MemoryRouter } from "react-router-dom"

afterEach(() => {
  cleanup()
})


describe("Vendor Offer", () => {
    vi.mock("../src/components/ListingDetails", () => ({
        default: () => <div>ListingDetailsMock</div>,
    }))
    
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

    const approvedOffer = {
        offer_id: 1,
        listing,
        vendor: { username: "Bob" },
        allDays: "No",
        selectedDays: ["2025-06-19", "2025-06-20"],
        selectedCategories: ["Art & Crafts"],
        commission: 25,
        remarks: "",
        status: "approved",
    }

    const rejectedOffer = {
        offer_id: 2,
        listing,
        vendor: { username: "Charles" },
        allDays: "No",
        selectedDays: ["2025-06-19", "2025-06-20"],
        selectedCategories: ["Art & Crafts"],
        commission: 20,
        remarks: "",
        status: "rejected",
    }
    

    it("shows offer card, reveals button on hover, opens modal, see congratulations message", () => {
        const deleteOffer = vi.fn()

        render(
        <MemoryRouter>
            <VendorOffer offer={approvedOffer} deleteOffer={deleteOffer} />
        </MemoryRouter>
        )

        // listing name visible
        expect(screen.getByText("ListingDetailsMock")).toBeInTheDocument()

        // button hidden until hover
        expect(screen.queryByText("Check it out!")).not.toBeInTheDocument()

        // hover over component
        fireEvent.mouseEnter(screen.getByText("ListingDetailsMock").parentElement)

        expect(screen.getByText("Check it out!")).toBeInTheDocument()

        // open component
        fireEvent.click(screen.getByText("Check it out!"))
        expect(screen.getAllByText("ListingDetailsMock")).toHaveLength(2)

        // see congrats 
        expect(screen.getByText("Congratulations on the offer!")).toBeInTheDocument();
    })

    it("shows offer card, reveals button on hover, opens modal, see rejection message", () => {
        const deleteOffer = vi.fn()

        render(
        <MemoryRouter>
            <VendorOffer offer={rejectedOffer} deleteOffer={deleteOffer} />
        </MemoryRouter>
        )

        // listing name visible
        expect(screen.getByText("ListingDetailsMock")).toBeInTheDocument()

        // button hidden until hover
        expect(screen.queryByText("Check it out!")).not.toBeInTheDocument()

        // hover over component
        fireEvent.mouseEnter(screen.getByText("ListingDetailsMock").parentElement)

        expect(screen.getByText("Check it out!")).toBeInTheDocument()

        // open component
        fireEvent.click(screen.getByText("Check it out!"))
        expect(screen.getAllByText("ListingDetailsMock")).toHaveLength(2)

        // see congrats 
        expect(screen.getByText("Better luck next time!")).toBeInTheDocument();
    })
})