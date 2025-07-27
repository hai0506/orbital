import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { describe, it, expect, vi, afterEach } from "vitest"
import CountdownClock from "../src/components/CountdownClock"
import "@testing-library/jest-dom/vitest"
import { MemoryRouter } from "react-router-dom"

afterEach(() => {
  cleanup()
})


describe("countdown clock", () => {
    it("renders countdown to fundraiser when it is yet to start", async () => {
        render(
            <MemoryRouter>
                <CountdownClock 
                    startTime={`${"9999-07-26"}T18:27:00`}
                    endTime={`${"9999-07-27"}T18:27:00`} 
                />
            </MemoryRouter>
        )

        expect(await screen.findByText("Fundraiser starts in:")).toBeInTheDocument();
        expect(screen.queryByText("Fundraiser ends in:")).not.toBeInTheDocument();
    })

    it("renders countdown to fundraiser end when ongoing", async () => {
        render(
            <MemoryRouter>
                <CountdownClock 
                    startTime={`${"2004-07-26"}T18:27:00`}
                    endTime={`${"9999-07-27"}T18:27:00`} 
                />
            </MemoryRouter>
        )

        expect(await screen.findByText("Fundraiser ends in:")).toBeInTheDocument();
        expect(screen.queryByText("Fundraiser starts in:")).not.toBeInTheDocument();
    })

    it("renders countdown to fundraiser end when ongoing", async () => {
        render(
            <MemoryRouter>
                <CountdownClock 
                    startTime={`${"2004-07-26"}T18:27:00`}
                    endTime={`${"2004-07-27"}T18:27:00`} 
                />
            </MemoryRouter>
        )

        expect(await screen.findByText("Fundraiser ended")).toBeInTheDocument();
        expect(screen.queryByText("Fundraiser starts in:")).not.toBeInTheDocument();
        expect(screen.queryByText("Fundraiser ends in:")).not.toBeInTheDocument();
    })
})