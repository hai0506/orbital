import { useState } from 'react'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'

const categories_list = [
    "Food & Beverages", "Accessories", "Stationery", "Clothing",
    "Toys", "Books", "Home Decor", "Art & Crafts",
    "Tech Gadgets", "Skincare & Beauty", "Plants", "Pet Supplies",
];

const ListingFilter = ({ onApply }) => {
    const [sortby, setSortby] = useState("");
    const [categories, setCategories] = useState([]);

    const applyFilters = (close) => {
        const params = new URLSearchParams();
        if (sortby) params.append('sortby', sortby);
        categories.forEach(c => params.append('categories', c));
        onApply(params.toString());
        close();
    };

    return (
        <Popover className="relative">
            {({ close }) => (
                <>
                    <PopoverButton className="pv-filter-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                        </svg>
                        Filter
                    </PopoverButton>

                    <PopoverPanel anchor="bottom start" className="pv-filter-panel">
                        <div className="mb-4">
                            <p className="pv-filter-section-title">Categories</p>
                            <div className="flex flex-col gap-1.5">
                                {categories_list.map(category => (
                                    <label key={category} className="pv-filter-check-label">
                                        <input
                                            type="checkbox"
                                            value={category}
                                            checked={categories.includes(category)}
                                            onChange={(e) =>
                                                setCategories(all =>
                                                    e.target.checked ? [...all, category] : all.filter(c => c !== category)
                                                )
                                            }
                                            style={{ accentColor: 'var(--pv-purple)' }}
                                        />
                                        <span>{category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <label className="pv-filter-field-label mt-2">
                            Sort by
                            <select value={sortby} onChange={e => setSortby(e.target.value)} className="pv-filter-select">
                                <option value="">None</option>
                                <option value="start_date">Event start date</option>
                                <option value="time_created">Latest</option>
                            </select>
                        </label>

                        <button className="pv-btn mt-4" onClick={() => applyFilters(close)}>
                            Apply
                        </button>
                    </PopoverPanel>
                </>
            )}
        </Popover>
    );
};

export default ListingFilter;
