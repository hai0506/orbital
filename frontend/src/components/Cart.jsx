import React from 'react';
import { Input } from "@/components/ui/input"
import { Button } from '@headlessui/react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react";

export default function Cart({ cart, ongoing, setCart, setInventory, removeItem, buyerDetails, setBuyerDetails, errors, handleCheckout, totalCost }) {
  const onQuantityChange = (e, row, idx) => {
    const max = row.maxQuantity;
    let newQuantity = parseInt(e.target.value);

    if (isNaN(newQuantity)) return;

    newQuantity = Math.max(1, Math.min(max, newQuantity));

    const updatedCart = [...cart];
    const oldQuantity = updatedCart[idx].quantity;
    const change = newQuantity - oldQuantity;

    if (change === 0) return;

    updatedCart[idx].quantity = newQuantity;
    setCart(updatedCart);

    setInventory(prevInventory =>
      prevInventory.map(product => {
        if (product.name === row.item) {
          return {
            ...product,
            quantity: product.quantity - change,
          };
        }
        return product;
      })
    );
  };

  return (
    <>
      <h5 className="text-2xl font-semibold mt-6 mb-2">Checkout</h5>
      <div className="max-h-[60vh] overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th className="p-2 text-left">Item</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Quantity</th>
              <th className="p-2 text-left">Qty Left</th>
              <th className="p-2 text-left">Total Cost</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {cart.map((row, idx) => (
              <tr key={row.item} className="border-b">
                <td className="p-2">{row.item}</td>
                <td className="p-2">${row.price.toFixed(2)}</td>
                <td className="p-2">
                  <Input
                    type="number"
                    className="w-16 border rounded px-2 py-1"
                    value={row.quantity}
                    min={1}
                    max={row.maxQuantity}
                    onChange={e => onQuantityChange(e, row, idx)}
                  />
                </td>
                <td className="p-2">{row.maxQuantity - row.quantity}</td>
                <td className="p-2">${(Number(row.price) * Number(row.quantity)).toFixed(2)}</td>
                <td className="p-2">
                  <button onClick={() => removeItem(row)} className="text-red-500 hover:text-red-700">
                    <X />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {cart.length > 0 && ongoing && (
        <>
          <p className="text-2xl font-semibold mt-6 mb-2">Total Price: ${totalCost.toFixed(2)}</p>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col">
              <Input
                onChange={e => setBuyerDetails(prev => ({ ...prev, name: e.target.value }))}
                type="text"
                placeholder="Name of Buyer"
                value={buyerDetails.name || ''}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <Input
              onChange={e => setBuyerDetails(prev => ({ ...prev, phone: e.target.value }))}
              type="text"
              placeholder="Phone Number (optional)"
              value={buyerDetails.phone || ''}
            />
            <Input
              onChange={e => setBuyerDetails(prev => ({ ...prev, email: e.target.value }))}
              type="email"
              placeholder="Email Address (optional)"
              value={buyerDetails.email || ''}
            />
            <div className="flex flex-col">
              <Select onValueChange={value => setBuyerDetails(prev => ({ ...prev, payment: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Payment Method" value={buyerDetails.payment} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="PayLah">PayLah</SelectItem>
                    <SelectItem value="PayNow">PayNow</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="NETS">NETS</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.payment && <p className="mt-1 text-sm text-red-600">{errors.payment}</p>}
            </div>
          </div>

          {errors && (
            <p className="mt-1 text-sm text-red-600">
              {typeof errors === 'string' ? errors : errors[0]}
            </p>
          )}

          <div className="flex gap-4 mt-4">
            <Button onClick={handleCheckout} className="self-start inline-flex items-center gap-2 rounded-md bg-green-700 px-3 py-1.5 text-sm font-semibold text-white shadow-inner shadow-white/10 hover:bg-green-600">
              Checkout Items
            </Button>
            <Button onClick={() => setCart([])} className="self-start inline-flex items-center gap-2 rounded-md bg-red-700 px-3 py-1.5 text-sm font-semibold text-white shadow-inner shadow-white/10 hover:bg-red-600">
              Clear Items
            </Button>
          </div>
        </>
      )}
    </>
  );
}
