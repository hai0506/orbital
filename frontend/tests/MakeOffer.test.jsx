import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect, vi, beforeAll } from "vitest"
import MakeOffer from "../src/components/MakeOffer"
import "@testing-library/jest-dom/vitest"

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

// use only 2 categories
vi.mock("../src/components/AllCategories", () => ({
  default: ["Food", "Drinks"]
}))


vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return { ...actual, useNavigate: () => vi.fn() }
})

describe("MakeOffer", () => {
  const listing = { post_id: 42, categories: ["Food"] }
  const dates = [new Date("2025-06-20"), new Date("2025-06-21")]

  it("renders form and toggles category checkboxes", () => {
    render(
      <MemoryRouter>
        <MakeOffer listing={listing} dates={dates} />
      </MemoryRouter>
    )

    
    expect(screen.getByRole("button", { name: "Make Offer" })).toBeInTheDocument()
    expect(screen.getByText("Food")).toBeInTheDocument()
    expect(screen.getByText("Drinks")).toBeInTheDocument()

    // simulate clicking of categories
    fireEvent.click(screen.getByText("Food"))
    fireEvent.click(screen.getByText("Drinks"))

    // submit
    fireEvent.click(screen.getByRole("button", { name: "Make Offer" }))

    expect(screen.getByRole("button", { name: "Make Offer" })).toBeInTheDocument()
  })
})
