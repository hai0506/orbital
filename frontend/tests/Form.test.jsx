import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Form from "../src/components/Form";
import "@testing-library/jest-dom/vitest"
import { waitFor } from "@testing-library/react";
import api from "../src/api";

afterEach(() => {
  cleanup()
})

vi.mock('../src/api', () => {
  const post = vi.fn()
  const get  = vi.fn()

  return {
    default: {
      post,
      get,
      defaults: { baseURL: 'http://127.0.0.1:8000/' },
    },
  }
})


describe("Login Page", () => {
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
});

describe("Register Page", () => {
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


describe('Login error', () => {
  it('shows Incorrect username and/or password! on 401 response', async () => {
    api.post.mockRejectedValueOnce({
      response: {
        status: 401,
        data: { detail: 'No active account' },
      },
    })

    render(
      <MemoryRouter>
        <Form method="login" route="api/token/" />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'wronguser' },
    })
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'badpass' },
    })

    fireEvent.click(screen.getByRole("button", { name: /Sign in/i }));

    expect(
      await screen.findByText(/Incorrect username and\/or password!/i)
    ).toBeInTheDocument()
  })
})

describe('Register errors', () => {
  it('shows errors for each field on 400 response', async () => {
    api.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: { 
                username: ['A user with that username already exists.'],
                password: ['This password is too short. It must contain at least 8 characters.'],
            },
      },
    })

    render(
      <MemoryRouter>
        <Form method="register" route="api/token/" />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'test' },
    })
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'test' },
    })

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    expect(
      await screen.findByText(/A user with that username already exists./i)
    ).toBeInTheDocument()

    expect(
      await screen.findByText(/This password is too short. It must contain at least 8 characters./i)
    ).toBeInTheDocument()
  })
})