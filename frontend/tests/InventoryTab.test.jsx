import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import InventoryTab from '@/components/InventoryTab';
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import "@testing-library/jest-dom/vitest"

afterEach(() => {
  cleanup()
})

describe('InventoryTab', () => {
    const sampleInventory = [
        { name: 'Apple', price: 1.25, quantity: 5, remarks: 'Fresh' },
        { name: 'Banana', price: 0.5, quantity: 0, remarks: 'Ripe' },
    ];

    const addToCartMock = vi.fn();
    const setSearchItemMock = vi.fn();

    beforeEach(() => {
        addToCartMock.mockClear();
        setSearchItemMock.mockClear();
    });

    it('renders inventory items', () => {
        render(
            <InventoryTab
                inventory={sampleInventory}
                searchItem=""
                setSearchItem={setSearchItemMock}
                addToCart={addToCartMock}
                ongoing={true}
                isVendor={true}
            />
        );

        expect(screen.getByText('Inventory')).toBeInTheDocument();

        // table headers
        expect(screen.getByText('Item')).toBeInTheDocument();
        expect(screen.getByText('Price')).toBeInTheDocument();
        expect(screen.getByText('Quantity')).toBeInTheDocument();
        expect(screen.getByText('Remarks')).toBeInTheDocument();

        // render apple
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('$1.25')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('Fresh')).toBeInTheDocument();

        // render banana
        expect(screen.getByText('Banana')).toBeInTheDocument();
        expect(screen.getByText('$0.50')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByText('Ripe')).toBeInTheDocument();
    });

    it('calls setSearchItem when typing in search input', () => {
        render(
            <InventoryTab
                inventory={sampleInventory}
                searchItem=""
                setSearchItem={setSearchItemMock}
                addToCart={addToCartMock}
                ongoing={true}
                isVendor={true}
            />
        );

        const input = screen.getByTestId('search-item-input');
        fireEvent.change(input, { target: { value: 'apple' } });
        expect(setSearchItemMock).toHaveBeenCalledWith('apple');
    });

    it('shows Add to cart button only if isVendor=true, quantity > 0 and ongoing=true', () => {
        const { rerender } = render(
            <InventoryTab
                inventory={sampleInventory}
                searchItem=""
                setSearchItem={setSearchItemMock}
                addToCart={addToCartMock}
                ongoing={true}
                isVendor={true}
            />
        );

        const addToCartButtons = screen.getAllByText('Add to cart');
        expect(addToCartButtons).toHaveLength(1);

        // test add to cart
        fireEvent.click(addToCartButtons[0]);
        expect(addToCartMock).toHaveBeenCalledWith(sampleInventory[0]);

        // cannot add banana to cart
        expect(screen.queryByText('Add to cart', { selector: 'button' })).toBeInTheDocument();

    
        rerender(
            <InventoryTab
                inventory={sampleInventory}
                searchItem=""
                setSearchItem={setSearchItemMock}
                addToCart={addToCartMock}
                ongoing={false}
                isVendor={true}
            />
        );
        expect(screen.queryByText('Add to cart')).not.toBeInTheDocument();

        // org view
        rerender(
            <InventoryTab
                inventory={sampleInventory}
                searchItem=""
                setSearchItem={setSearchItemMock}
                addToCart={addToCartMock}
                ongoing={true}
                isVendor={false}
            />
        );
        expect(screen.queryByText('Add to cart')).not.toBeInTheDocument();
    });
});
