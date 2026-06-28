import { useState } from 'react'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'

const OfferFilter = ({ onApply }) => {
    const [available, setAvailable] = useState(false);
    const [commission, setCommission] = useState(false);
    const [status, setStatus] = useState("");
    const [sortby, setSortby] = useState("");

    const applyFilters = (close) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (available) params.append('available', 1);
        if (commission) params.append('commission', 1);
        if (sortby) params.append('sortby', sortby);
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
                        <p className="pv-filter-section-title">Availability & Commission</p>
                        <div className="flex flex-col gap-1.5 mb-4">
                            <label className="pv-filter-check-label">
                                <input type="checkbox" checked={available} onChange={() => setAvailable(v => !v)} style={{ accentColor: 'var(--pv-purple)' }} />
                                <span>Available all days</span>
                            </label>
                            <label className="pv-filter-check-label">
                                <input type="checkbox" checked={commission} onChange={() => setCommission(v => !v)} style={{ accentColor: 'var(--pv-purple)' }} />
                                <span>Meet commission requirement only</span>
                            </label>
                        </div>

                        <label className="pv-filter-field-label mb-4">
                            Offer Status
                            <select value={status} onChange={e => setStatus(e.target.value)} className="pv-filter-select">
                                <option value="">All</option>
                                <option value="pending">Pending</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </label>

                        <label className="pv-filter-field-label mb-4">
                            Sort by
                            <select value={sortby} onChange={e => setSortby(e.target.value)} className="pv-filter-select">
                                <option value="">None</option>
                                <option value="start_date">Event start date</option>
                                <option value="time_created">Latest</option>
                            </select>
                        </label>

                        <button className="pv-btn" onClick={() => applyFilters(close)}>
                            Apply
                        </button>
                    </PopoverPanel>
                </>
            )}
        </Popover>
    );
};

export default OfferFilter;
