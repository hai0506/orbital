import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import Chat from "../src/components/Chat"
import "@testing-library/jest-dom/vitest"
import { MemoryRouter } from "react-router-dom"

describe("chat", () => {
    const chat = {
        "chat_history": [
            {
                "message_id": 41,
                "sender": {
                    "id": 9,
                    "username": "vendor5",
                    "email": "test@test.com",
                    "rating": 0
                },
                "receiver": {
                    "id": 8,
                    "username": "organization2",
                    "email": "test@test.com",
                    "rating": 4.0
                },
                "content": "Cool listing",
                "time_created": "2025-07-24T07:01:26.438039Z",
                "read": false
            }
        ],
        "me": {
            "id": 8,
            "username": "organization2",
            "email": "test@test.com",
            "rating": 4.0
        },
        "other": {
            "id": 9,
            "username": "vendor5",
            "email": "test@test.com",
            "rating": 0
        },
        "received": true,
        "preview": "Cool listing"
    }

    it("renders button when hovering", () => {
        render(
            <MemoryRouter>
                <Chat chat={chat} />
            </MemoryRouter>
        )

        expect(screen.queryByRole("button", { name: "Check it out!" })).not.toBeInTheDocument();
        fireEvent.mouseEnter(screen.getByText(/vendor5/i));
        expect(screen.getByRole("button", { name: "Check it out!" })).toBeInTheDocument();
    })
})