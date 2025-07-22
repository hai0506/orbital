import { useState } from 'react'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'

const categories_list=["Food & Beverages",
    "Accessories",
    "Stationery",
    "Clothing",
    "Toys",
    "Books",
    "Home Decor",
    "Art & Crafts",
    "Tech Gadgets",
    "Skincare & Beauty",
    "Plants",
    "Pet Supplies",]

const ListingFilter = ({ onApply }) => {
    const [sortby, setSortby] = useState("")
    const [categories, setCategories] = useState([]);

    const applyFilters = (close) => {
        const params = new URLSearchParams()
        if (sortby) params.append('sortby', sortby)
        categories.forEach((category) => params.append('categories', category));
        onApply(params.toString());
        close();
    }

    return (
        <Popover className="relative">
            {({close}) => (
                <>
                    <PopoverButton className="flex items-center space-x-2 bg-white px-3 py-2 rounded-md border border-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                        </svg>
                        Filter
                    </PopoverButton>
                    <PopoverPanel
                        anchor="bottom start"
                        className="absolute left-0 mt-2 z-10 w-64 flex flex-col border rounded-lg bg-white p-5 shadow-lg"
                    >
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2 text-sm text-gray-700">Filter by Categories</h3>
                            <div className="flex flex-col space-y-2">
                                {categories_list.map((category) => (
                                <label key={category} className="inline-flex items-center space-x-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        value={category}
                                        checked={categories.includes(category)}
                                        onChange={(e) =>
                                            setCategories((all) =>
                                            e.target.checked ? [...all, category] : all.filter((c) => c !== category)
                                            )
                                        }
                                        className="accent-gray-700"
                                    />
                                    <span>{category}</span>
                                </label>
                                ))}
                            </div>
                        </div>

                        
                        <label className="mt-1 text-sm font-medium text-gray-700 flex flex-col">
                            Sort by
                            <select value={sortby} onChange={e => setSortby(e.target.value)} className="border mt-1 p-2 rounded-lg">
                                <option value="">None</option>
                                <option value="start_date">Event start date</option>
                                <option value="time_created">Latest</option>
                            </select>
                        </label>
                        
                        <button className="mt-2 w-fit inline-block bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors" onClick={() => applyFilters(close)}>
                            Apply
                        </button>
                    </PopoverPanel>
                </>
            )}
            
        </Popover>
    )
}

export default ListingFilter;