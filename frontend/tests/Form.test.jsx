import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Form from "../src/components/Form";
import "@testing-library/jest-dom/vitest"

describe("Login", () => {
  it("renders a login page", () => {
    render(
      <MemoryRouter>
        <Form method="login" route="/api/login/" />
      </MemoryRouter>
    );
    
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
  });

  it("renders a register page", () => {
    render(
      <MemoryRouter>
        <Form method="register" route="/api/register/" />
      </MemoryRouter>
    );
    
    expect(screen.getByText("Register your account")).toBeInTheDocument();
  });
});
