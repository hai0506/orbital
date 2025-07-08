import { useState } from 'react'

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

const Filter = ({ onApply }) => {
    const [sortby, setSortby] = useState("")
    const [categories, setCategories] = useState([]);

    const applyFilters = () => {
        const params = new URLSearchParams()
        if (sortby) params.append('sortby', sortby)
        categories.forEach((category) => params.append('categories', category));
        onApply(params.toString())
    }

    return (
        <div className="mx-4">
            {categories_list.map((category) => (
                <label key={category}>
                    <input className="mx-4" type="checkbox" value={category}
                        checked={categories.includes(category)}
                        onChange={(e) => {
                            setCategories((all) =>
                                e.target.checked ? ([...all, category]) : all.filter((c) => c !== category)
                            );
                          }}
                        /> 
                    {category}
                </label>
              ))}
            <select value={sortby} onChange={e => setSortby(e.target.value)} className="border mx-4">
                <option value="">Sort by...</option>
                <option value="start_date">Event start date</option>
                <option value="time_created">Latest</option>
            </select>

            <button className="bg-blue-500 border mx-4 px-4"onClick={applyFilters}>
                Apply
            </button>
        </div>
    )
}

export default Filter