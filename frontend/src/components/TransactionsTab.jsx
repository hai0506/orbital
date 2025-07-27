import React from 'react';
import { Input } from "@/components/ui/input"

export default function TransactionsTab({ transactions, setSearchBuyer, setReceipt }) {
    return (
        <>
            <h5 className="text-2xl font-semibold mb-2">Transactions</h5>
            <Input
                type="search"
                data-testid="search-item-input"
                placeholder="Search by Buyer Name"
                onChange={e => setSearchBuyer(e.target.value)}
                className="w-full md:w-1/3 mb-2"
            />
            {transactions.length > 0 && (
                <div className="max-h-[60vh] overflow-auto">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-gray-100">
                            <tr>
                                <th key='name' className="p-2 text-left">Buyer Name</th>
                                <th key='phone' className="p-2 text-left">Phone Number</th>
                                <th key='email' className="p-2 text-left">Email Address</th>
                                <th key='payment' className="p-2 text-left">Payment Method</th>
                                <th key='receipt' className="p-2 text-left">Receipt</th>
                                <th key='datetime' className="p-2 text-left">Time of Transaction</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions?.map(row => (
                                <tr className="border-b">
                                    <td className="p-2">
                                        {row.name}
                                    </td>
                                    <td className="p-2">
                                        {row.phone}
                                    </td>
                                    <td className="p-2">
                                        {row.email}
                                    </td>
                                    <td className="p-2">
                                        {row.payment}
                                    </td>
                                    <td className="p-2">
                                        <button onClick={() => setReceipt(row)} className="text-blue-500 hover:text-blue-700">View Receipt</button>
                                    </td>
                                    <td className="p-2">
                                        {new Date(row.time_created).toLocaleString('en-SG', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {transactions.length <= 0 && (
                <p>No transactions yet.</p>
            )}
        </>
    )
}