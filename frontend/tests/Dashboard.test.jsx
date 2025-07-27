import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '@/components/Dashboard';
import "@testing-library/jest-dom/vitest"

vi.mock('./MostSold', () => ({
    default: ({ data, total }) => (
        <div data-testid="most-sold">Most Sold - Total: {total}</div>
    )
}));

vi.mock('./MostValuable', () => ({
    default: ({ data, total }) => (
        <div data-testid="most-valuable">Most Valuable - Total: {total}</div>
    )
}));

vi.mock('./RevenueSharing', () => ({
    default: ({ data, total }) => (
        <div data-testid="revenue-sharing">Revenue - Total: {total}</div>
    )
}));

describe('Dashboard Component', () => {
    const mockFundraiser = {
        offer: { commission: 20 },
        revenue: 1000,
        transactions: [
            {
                items: [
                    { product: { name: 'Apples' }, quantity: 5, total_price: 50 },
                    { product: { name: 'Bananas' }, quantity: 3, total_price: 30 },
                ],
            },
            {
                items: [
                    { product: { name: 'Apples' }, quantity: 2, total_price: 20 },
                    { product: { name: 'Carrots' }, quantity: 10, total_price: 100 },
                ],
            },
        ],
    };

    it('renders all stats when transactions exist', () => {
        render(<Dashboard fundraiser={mockFundraiser} />);

        // heading
        expect(screen.getByText('Statistics')).toBeInTheDocument();

        // stats
        expect(screen.getByTestId('most-sold')).toBeInTheDocument();
        expect(screen.getByTestId('most-valuable')).toBeInTheDocument();
        expect(screen.getByTestId('revenue-sharing')).toBeInTheDocument();

        expect(screen.queryByText('No statistics available.')).not.toBeInTheDocument();
    });

    it('shows empty state when no transactions', () => {
        const noTxnFundraiser = { ...mockFundraiser, transactions: [] };

        render(<Dashboard fundraiser={noTxnFundraiser} />);
        expect(screen.getByText('No statistics available.')).toBeInTheDocument();
    });
});
