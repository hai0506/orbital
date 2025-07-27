import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { describe, it, expect, vi, afterEach } from "vitest"
import Review from "../src/components/Review"
import "@testing-library/jest-dom/vitest"
import { MemoryRouter } from "react-router-dom"
import VendorFundraiser from "@/data/VendorFundraiser"

afterEach(() => {
  cleanup()
})


describe("Vendor Offer", () => {
    vi.mock("../src/components/ListingDetails", () => ({
        default: () => <div>ListingDetailsMock</div>,
    }))
    
    it("shows review form for vendor", () => {
        render(
            <MemoryRouter>
                <Review fundraiser={VendorFundraiser} isVendor={true} />
            </MemoryRouter>
        )

        // rating
        expect(screen.getByText("Rating")).toBeInTheDocument();
        expect(screen.getByText("How much did you like the fundraiser?")).toBeInTheDocument();

        // comment
        expect(screen.getByText("Comments")).toBeInTheDocument();
        expect(screen.getByText("Do you have any feedback about the fundraiser?")).toBeInTheDocument();

        // submit button
        expect(screen.getByText("Submit Review")).toBeInTheDocument()
    })

    it("shows review form for vendor", () => {
        render(
            <MemoryRouter>
                <Review fundraiser={VendorFundraiser} isVendor={false} />
            </MemoryRouter>
        )

        // rating
        expect(screen.getByText("Rating")).toBeInTheDocument();
        expect(screen.getByText("How much did you like the vendor's services?")).toBeInTheDocument();

        // comment
        expect(screen.getByText("Comments")).toBeInTheDocument();
        expect(screen.getByText("Do you have any feedback about the vendor's services?")).toBeInTheDocument();

        // submit button
        expect(screen.getByText("Submit Review")).toBeInTheDocument()
    })
})