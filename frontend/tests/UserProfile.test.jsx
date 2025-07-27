import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { describe, it, expect, afterEach } from "vitest"
import UserProfile from "../src/components/UserProfile"
import "@testing-library/jest-dom/vitest"
import { MemoryRouter } from "react-router-dom"

afterEach(() => {
  cleanup()
})

describe("chat", () => {
    const vendor = {
        username: "bob",
        user_type: "Vendor"
    }

    const org = {
        username: "bob",
        user_type: "Organization"
    }

    it("renders button when hovering", () => {
        render(
            <MemoryRouter>
                <UserProfile profile={vendor} />
            </MemoryRouter>
        )

        expect(screen.queryByRole("button", { name: "Open profile" })).not.toBeInTheDocument();
        fireEvent.mouseEnter(screen.getByText(/bob/i));
        expect(screen.getByRole("button", { name: "Open profile" })).toBeInTheDocument();
    })

    it("renders vendor role", () => {
        render(
            <MemoryRouter>
                <UserProfile profile={vendor} />
            </MemoryRouter>
        )

        expect(screen.getByText("Vendor")).toBeInTheDocument();
        expect(screen.queryByText("Organization")).not.toBeInTheDocument();
    })

    it("renders org role", () => {
        render(
            <MemoryRouter>
                <UserProfile profile={org} />
            </MemoryRouter>
        )

        expect(screen.getByText("Organization")).toBeInTheDocument();
        expect(screen.queryByText("Vendor")).not.toBeInTheDocument();
    })
})