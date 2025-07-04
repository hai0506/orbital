import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Form from "../src/components/Form";
import "@testing-library/jest-dom/vitest"

describe("Login and Register Form", () => {
  it("renders a login page", () => {
    render(
      <MemoryRouter>
        <Form method="login" route="/api/login/" />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Sign in/i })).toBeInTheDocument()
    expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument()
  });

  it("renders a register page", () => {
    render(
      <MemoryRouter>
        <Form method="register" route="/api/register/" />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Register your account/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByText(/Are you an organization or vendor/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument()
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument()
  });
});