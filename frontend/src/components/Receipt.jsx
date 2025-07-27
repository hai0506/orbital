import { X } from "lucide-react";

export default function Receipt({ receipt, setReceipt }) {
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setReceipt(null)}
        >
            <div 
                className="max-w-2xl w-full rounded-lg bg-white p-6 shadow-lg relative"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex flex-col h-full w-full">
                    <h5 className="text-2xl font-semibold mb-2">Receipt</h5>
                    <div className="max-h-[60vh] overflow-auto">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-gray-100">
                                <tr>
                                    <th key='receipt-item' className="p-2 text-left">Item</th>
                                    <th key='receipt-price' className="p-2 text-left">Unit Price</th>
                                    <th key='receipt-quantity' className="p-2 text-left">Quantity</th>
                                    <th key='receipt-cost' className="p-2 text-left">Total Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {receipt?.items?.map(item => (
                                    <tr className="border-b">
                                        <td className="p-2">
                                            {item.product.name}
                                        </td>
                                        <td className="p-2">
                                            ${item.product.price.toFixed(2)}
                                        </td>
                                        <td className="p-2">
                                            {item.quantity}
                                        </td>
                                        <td className="p-2">
                                            ${item.total_price.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-2xl font-semibold mt-6 mb-2">Total Price: ${receipt.total_price.toFixed(2)}</p>
                </div>

                <button
                    onClick={() => setReceipt(null)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                >
                    <X/>
                </button>
            </div>
        </div>
    )
}