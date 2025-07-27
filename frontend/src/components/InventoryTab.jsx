import React from 'react';
import { Input } from "@/components/ui/input"

export default function InventoryTab({ inventory, searchItem, setSearchItem, addToCart, ongoing, isVendor }) {
  return (
    <>
      <h5 className="text-2xl font-semibold mb-2">Inventory</h5>
      <Input
        type="search"
        data-testid="search-item-input"
        placeholder="Search by Item Name"
        onChange={e => setSearchItem(e.target.value)}
        className="w-full md:w-1/3 mb-2"
        value={searchItem}
      />
      <div className="max-h-[60vh] overflow-auto">
        <table className="w-full text-sm overflow-auto max-h-[60vh]">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th className="p-2 text-left">Item</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Quantity</th>
              <th className="p-2 text-left">Remarks</th>
              {isVendor && (<th />)}
            </tr>
          </thead>
          <tbody>
            {inventory?.map(row => (
              <tr key={row.name} className="border-b">
                <td className="p-2">{row.name}</td>
                <td className="p-2">${row.price.toFixed(2)}</td>
                <td className="p-2">{row.quantity}</td>
                <td className="p-2">{row.remarks}</td>
                <td className="p-2">
                    {isVendor && row.quantity > 0 && ongoing && (
                        <button onClick={() => addToCart(row)} className="text-blue-500 hover:text-blue-700">
                            Add to cart
                        </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
