import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import TransactionsTab from '@/components/TransactionsTab';
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import "@testing-library/jest-dom/vitest"

afterEach(() => {
  cleanup()
})

describe("transactions tab", () => {
    const transactions = [
        {
            name: "john",
            phone: "89438943",
            email: "test@test.com",
            payment: "Cash",
            time_created: "2025-07-24T14:17:42.706455Z",
        }
    ]

    const setSearchBuyerMock = vi.fn();
    const setReceiptMock = vi.fn();

    beforeEach(() => {
        setSearchBuyerMock.mockClear();
        setReceiptMock.mockClear();
    });

    it("renders transactions", () => {
        render(
            <TransactionsTab
                transactions={transactions}
                setSearchBuyer={setSearchBuyerMock}
                setReceipt={setReceiptMock}
            />
        )

        // heading
        expect(screen.getByText('Transactions')).toBeInTheDocument();

        // table headings
        expect(screen.getByText('Buyer Name')).toBeInTheDocument();
        expect(screen.getByText('Phone Number')).toBeInTheDocument();
        expect(screen.getByText('Email Address')).toBeInTheDocument();
        expect(screen.getByText('Payment Method')).toBeInTheDocument();
        expect(screen.getByText('Receipt')).toBeInTheDocument();
        expect(screen.getByText('Time of Transaction')).toBeInTheDocument();

        // render transaction
        expect(screen.getByText('john')).toBeInTheDocument();
        expect(screen.getByText('89438943')).toBeInTheDocument();
        expect(screen.getByText('test@test.com')).toBeInTheDocument();
        expect(screen.getByText('Cash')).toBeInTheDocument();
        expect(screen.getByText('24 Jul 2025, 10:17 pm')).toBeInTheDocument();

        const viewReceiptButtons = screen.getAllByText('View Receipt');
        expect(viewReceiptButtons).toHaveLength(1);
    }) 

    it('calls setSearchItem when typing in search input', () => {
        render(
            <TransactionsTab
                transactions={transactions}
                setSearchBuyer={setSearchBuyerMock}
                setReceipt={setReceiptMock}
            />
        );

        const input = screen.getByTestId('search-item-input');
        fireEvent.change(input, { target: { value: 'john' } });
        expect(setSearchBuyerMock).toHaveBeenCalledWith('john');
    });
})