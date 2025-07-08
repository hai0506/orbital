import { useState } from 'react'

const Filter = ({ onApply }) => {
    const [available, setAvailable] = useState(false)
    const [commission, setCommission] = useState(false)
    const [sortby, setSortby] = useState("")

    const applyFilters = () => {
        const params = new URLSearchParams()
        if (available) params.append('available', 1)
        if (commission) params.append('commission', 1)
        if (sortby) params.append('sortby', sortby)

        onApply(params.toString())
    }

    return (
        <div className="mx-4">
            <label>
                <input className="mx-4" type="checkbox" checked={available} onChange={() => setAvailable(!available)} />
                Available all days
            </label>

            <label>
                <input className="mx-4" type="checkbox" checked={commission} onChange={() => setCommission(!commission)} />
                Meet commission requirement only
            </label>

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