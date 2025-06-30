import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Layout from "../src/components/Layout";
import "@testing-library/jest-dom/vitest"

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("Layout", () => {
  beforeEach(() => {
    localStorage.setItem("username", "testuser")
  })

  it("renders a create listing page", () => {
    render(
      <MemoryRouter>
        <Layout heading="Create Listing" />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Create Listing', level: 1 })).toBeInTheDocument()
  })

  it("renders the offers page", () => {
    render(
      <MemoryRouter>
        <Layout heading="Offers" />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Offers', level: 1 })).toBeInTheDocument()
  })

  it("renders the fundraisers page", () => {
    render(
      <MemoryRouter>
        <Layout heading="Fundraisers" />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Fundraisers', level: 1 })).toBeInTheDocument()
  })

  it("renders the listings page", () => {
    render(
      <MemoryRouter>
        <Layout heading="Listings" />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Listings', level: 1 })).toBeInTheDocument()
  })
})

