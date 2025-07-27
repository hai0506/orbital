import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { describe, it, expect, vi, afterEach } from "vitest"
import CountdownClock from "../src/components/CountdownClock"
import "@testing-library/jest-dom/vitest"
import { MemoryRouter } from "react-router-dom"

afterEach(() => {
  cleanup()
})


describe("countdown clock", () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); 

    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const start_time = `${yyyy}-${mm}-${dd}`;

    it("renders countdown to fundraiser when it is yet to start", () => {
        render(
            <MemoryRouter>
                <CountdownClock 
                    startTime={`${start_time}T18:27:00`}
                    endTime={`${fundraiser?.offer.listing.end_date}T18:27:00`} 
                />
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