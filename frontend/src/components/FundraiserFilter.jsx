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
          <PopoverButton className="pv-filter-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            Filter
          </PopoverButton>

          <PopoverPanel anchor="bottom start" className="pv-filter-panel">
            <label className="pv-filter-field-label mb-4">
              Fundraiser Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="pv-filter-select"
              >
                <option value="">All</option>
                <option value="yet to start">Yet to start</option>
                <option value="ongoing">Ongoing</option>
                <option value="concluded">Concluded</option>
              </select>
            </label>

            <button className="pv-btn" onClick={() => applyFilters(close)}>
              Apply
            </button>
          </PopoverPanel>
        </>
      )}
    </Popover>
  )
}

export default FundraiserFilter
