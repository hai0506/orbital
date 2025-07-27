import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Cart from '@/components/Cart';
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import "@testing-library/jest-dom/vitest"

afterEach(() => {
  cleanup()
})

describe('Cart Component', () => {
    const sampleCart = [
        {
        item: 'Apple',
        price: 1.5,
        quantity: 2,
        maxQuantity: 5
        }
    ];

    let setCart, setInventory, removeItem, setBuyerDetails, handleCheckout;

    beforeEach(() => {
        setCart = vi.fn();
        setInventory = vi.fn();
        removeItem = vi.fn();
        setBuyerDetails = vi.fn();
        handleCheckout = vi.fn();
    });

    it('renders cart table with correct values', () => {
        render(
        <Cart
            cart={sampleCart}
            ongoing={true}
            setCart={setCart}
            setInventory={setInventory}
            removeItem={removeItem}
            buyerDetails={{ name: '', phone: '', email: '', payment: '' }}
            setBuyerDetails={setBuyerDetails}
            errors={{}}
            handleCheckout={handleCheckout}
            totalCost={3.0}
        />
        );

        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('$1.50')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2')).toBeInTheDocument();
        expect(screen.getByText('Total Price: $3.00')).toBeInTheDocument();
    });

    it('calls setCart and setInventory when quantity changes', () => {
        render(
        <Cart
            cart={sampleCart}
            ongoing={true}
            setCart={setCart}
            setInventory={setInventory}
            removeItem={removeItem}
            buyerDetails={{ name: '', phone: '', email: '', payment: '' }}
            setBuyerDetails={setBuyerDetails}
            errors={{}}
            handleCheckout={handleCheckout}
            totalCost={3.0}
        />
        );

        const quantityInput = screen.getByDisplayValue('2');
        fireEvent.change(quantityInput, { target: { value: '3' } });

        expect(setCart).toHaveBeenCalled();
        expect(setInventory).toHaveBeenCalled();
    });

    it('calls handleCheckout on button click', () => {
        render(
        <Cart
            cart={sampleCart}
            ongoing={true}
            setCart={setCart}
            setInventory={setInventory}
            removeItem={removeItem}
            buyerDetails={{ name: 'John', phone: '', email: '', payment: 'Cash' }}
            setBuyerDetails={setBuyerDetails}
            errors={{}}
            handleCheckout={handleCheckout}
            totalCost={3.0}
        />
        );

        fireEvent.click(screen.getByText('Checkout Items'));
        expect(handleCheckout).toHaveBeenCalled();
    });
});