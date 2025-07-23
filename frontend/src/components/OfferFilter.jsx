import { useState } from 'react'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'

const OfferFilter = ({ onApply }) => {
    const [available, setAvailable] = useState(false);
    const [commission, setCommission] = useState(false);
    const [sortby, setSortby] = useState("");

    const applyFilters = (close) => {
        const params = new URLSearchParams()
        if (available) params.append('available', 1)
        if (commission) params.append('commission', 1)
        if (sortby) params.append('sortby', sortby)

        onApply(params.toString());
        close();
    }

    return (
            <Popover className="relative">
                {({close}) => (
                    <>
                        <PopoverButton className="flex items-center space-x-2 bg-white px-3 py-2 rounded-md border border-gray-300">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                            />
                            </svg>
                            <span>Filter</span>
                        </PopoverButton>
                        <PopoverPanel
                            anchor="bottom start"
                            className="absolute left-0 mt-2 z-10 w-64 flex flex-col border rounded-lg bg-white p-5 shadow-lg"
                        >
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2 text-sm text-gray-700">Filter by Availability/Commission</h3>
                                <div className="flex flex-col space-y-2">
                                    <label key="availability" className="inline-flex items-center space-x-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={available}
                                            onChange={() => setAvailable(!available)}
                                            className="accent-gray-700"
                                        />
                                        <span>Available all days</span>
                                    </label>
                                    <label key="commission" className="inline-flex items-center space-x-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={commission}
                                            onChange={() => setCommission(!commission)}
                                            className="accent-gray-700"
                                        />
                                        <span>Meet commission requirement only</span>
                                    </label>
                                </div>
                            </div>
                            <button
                                className="w-fit inline-block bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                                onClick={() => applyFilters(close)}
                            >
                                Apply
                            </button>
                        </PopoverPanel>
                    </>
                )}
            </Popover>
    )
}

export default OfferFilter;