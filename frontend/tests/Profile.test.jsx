import { render, screen } from "@testing-library/react";
import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import Profile from "../src/pages/Profile";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import api from "../src/api";
import { useParams } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: () => vi.fn(),
  };
});

// Mock API
vi.mock("../src/api", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));
     

// Optional: mock ResizeObserver to avoid error
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("Profile Page", () => {
  beforeEach(() => {
    localStorage.setItem("username", "alice");
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renders editable profile for logged-in user (shows pencil icon)", async () => {
    useParams.mockReturnValue({}); // No id param => own profile

    api.get.mockResolvedValue({
      data: {
        username: "alice",
        pfp: null,
        description: "This is my bio",
        rating_count: 0,
        user: { rating: 5 },
      },
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // Wait for username to show up
    expect(await screen.findByText("alice")).toBeInTheDocument();

    // Check if the pencil icon for editing bio is visible
    expect(screen.getByRole("button", { name: /pencil/i })).toBeInTheDocument();
  });

  it("renders read-only profile for another user (no pencil icon)", async () => {
    useParams.mockReturnValue({ id: "123" }); // Visiting someone else's profile

    api.get.mockResolvedValue({
      data: {
        username: "bob",
        pfp: null,
        description: "Hello I'm Bob",
        user_type: "vendor",
        rating_count: 0,
        user: { rating: 4 },
      },
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // Wait for the profile to load
    expect(await screen.findByText("bob")).toBeInTheDocument();

    // Pencil icon should not be in the document
    expect(screen.queryByLabelText("button", { name: /pencil/i })).not.toBeInTheDocument();

    // "Contact vendor" button should appear
    expect(screen.getByText("Contact vendor")).toBeInTheDocument();
  });
});

