import { useState } from 'react'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'

const Filter = ({ onApply }) => {
    const [status, setStatus] = useState("")
    const [sortby, setSortby] = useState("")

    const applyFilters = () => {
        const params = new URLSearchParams()
        if (status) params.append('status', status)
        if (sortby) params.append('sortby', sortby)

        onApply(params.toString())
    }

    return (
        <div className="flex justify-end max-w-[70%] mx-auto mt-3 -mb-4">
            <Popover className="relative">
                <PopoverButton className="flex items-center space-x-2 bg-white px-3 py-2 rounded-md hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                    </svg>
                    Filter
                </PopoverButton>
                <PopoverPanel anchor="bottom" className="flex flex-col border rounded-lg bg-white p-5">
                    <select value={status} onChange={e => setStatus(e.target.value)} className="border m-3 p-1 rounded-lg">
                        <option value="">Choose offer status...</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                
                    <select value={sortby} onChange={e => setSortby(e.target.value)} className="border m-3 p-1 rounded-lg">
                        <option value="">Sort by...</option>
                        <option value="start_date">Event start date</option>
                        <option value="time_created">Latest</option>
                    </select>

                    <button className="bg-gray-700 border p-2 rounded-lg text-white"onClick={applyFilters}>
                        Apply
                    </button>
                </PopoverPanel>
            </Popover>
        </div>
    )
}

export default Filter