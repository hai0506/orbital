import React from 'react';
import { Input } from "@/components/ui/input"

export default function InventoryTab({ inventory, searchItem, setSearchItem, addToCart, ongoing, isVendor }) {
  return (
    <>
      <h5 className="pv-heading text-2xl font-semibold mb-2">Inventory</h5>
      <Input
        type="search"
        data-testid="search-item-input"
        placeholder="Search by Item Name"
        onChange={e => setSearchItem(e.target.value)}
        className="w-full md:w-1/3 mb-2"
        value={searchItem}
      />
      <div className="max-h-[60vh] overflow-auto">
        <table className="pv-table">
          <thead className="sticky top-0">
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Remarks</th>
              {isVendor && <th />}
            </tr>
          </thead>
          <tbody>
            {inventory?.map(row => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>${row.price.toFixed(2)}</td>
                <td>{row.quantity}</td>
                <td>{row.remarks}</td>
                {isVendor && (
                  <td>
                    {row.quantity > 0 && ongoing && (
                      <button
                        onClick={() => addToCart(row)}
                        className="pv-btn"
                        style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem', boxShadow: 'none' }}
                      >
                        Add to cart
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
