import { useState } from 'react'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'

const FundraiserFilter = ({ onApply }) => {
  const [status, setStatus] = useState("")

  const applyFilters = (close) => {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    onApply(params.toString())
    close()
  }

  return (
    <Popover className="relative">
      {({ close }) => (
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
            <label className="mb-2 text-sm font-medium text-gray-700">
                Filter by Fundraiser Status
                <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border mb-4 p-2 rounded-lg"
                >
                <option value="">All</option>
                <option value="yet to start">Yet to start</option>
                <option value="ongoing">Ongoing</option>
                <option value="concluded">Concluded</option>
                </select>
            </label>

            <button
              className="bg-gray-700 border p-2 rounded-lg text-white"
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

export default FundraiserFilter

