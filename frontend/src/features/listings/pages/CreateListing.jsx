import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Checkbox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import Layout from '@/shared/Layout'
import api from '@/api'

const allCategories = [
    "Food & Beverages", "Accessories", "Stationery", "Clothing",
    "Toys", "Books", "Home Decor", "Art & Crafts",
    "Tech Gadgets", "Skincare & Beauty", "Plants", "Pet Supplies",
];

const CreateListing = () => {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [categories, setCategories] = useState([]);
    const [commission, setCommission] = useState(0);
    const [remarks, setRemarks] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const toggle = (target) => {
        setCategories(prev =>
            prev.includes(target) ? prev.filter(c => c !== target) : [...prev, target]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("core/create-post/", {
                title, location,
                start_date: startDate, end_date: endDate,
                start_time: startTime, end_time: endTime,
                remarks, commission,
                category_list: categories,
            });
            navigate("/");
        } catch (error) {
            setErrors(error.response?.data ?? {});
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout heading="Create Listing">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">

                    {/* Title */}
                    <div>
                        <label className="pv-form-label">Title</label>
                        <span className="pv-form-desc">What do you want to call your fundraiser?</span>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. NUS Charity Bazaar 2025" className="pv-form-control" />
                        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title[0]}</p>}
                    </div>

                    {/* Location */}
                    <div>
                        <label className="pv-form-label">Location</label>
                        <span className="pv-form-desc">Where will the fundraiser be held?</span>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                            placeholder="e.g. University Cultural Centre" className="pv-form-control" />
                        {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location[0]}</p>}
                    </div>

                    {/* Dates */}
                    <div>
                        <label className="pv-form-label">Dates</label>
                        <span className="pv-form-desc">Start date</span>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="pv-form-control" />
                        {errors.start_date && <p className="mt-1 text-sm text-red-500">{errors.start_date[0]}</p>}
                        <span className="pv-form-desc mt-3">End date</span>
                        <input type="date" value={endDate} disabled={!startDate} onChange={e => setEndDate(e.target.value)} className="pv-form-control" />
                        {errors.end_date && <p className="mt-1 text-sm text-red-500">{errors.end_date[0]}</p>}
                    </div>

                    {/* Times */}
                    <div>
                        <label className="pv-form-label">Timing</label>
                        <span className="pv-form-desc">Start time</span>
                        <input type="time" value={startTime} disabled={!startDate} onChange={e => setStartTime(e.target.value)} className="pv-form-control" />
                        {errors.start_time && <p className="mt-1 text-sm text-red-500">{errors.start_time[0]}</p>}
                        <span className="pv-form-desc mt-3">End time</span>
                        <input type="time" value={endTime} disabled={!startTime} onChange={e => setEndTime(e.target.value)} className="pv-form-control" />
                        {errors.end_time && <p className="mt-1 text-sm text-red-500">{errors.end_time[0]}</p>}
                    </div>

                    {/* Categories */}
                    <div>
                        <label className="pv-form-label">Vendor Categories</label>
                        <span className="pv-form-desc">What vendor types do you prefer?</span>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                            {allCategories.map(category => (
                                <label key={category} className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox
                                        checked={categories.includes(category)}
                                        onChange={() => toggle(category)}
                                        className="size-5 rounded flex items-center justify-center flex-shrink-0 transition-colors"
                                        style={{
                                            background: categories.includes(category) ? 'var(--pv-purple)' : 'var(--pv-input-bg)',
                                            border: `1.5px solid ${categories.includes(category) ? 'var(--pv-purple)' : 'var(--pv-input-border)'}`,
                                        }}
                                    >
                                        <CheckIcon className="size-3.5 text-white" style={{ display: categories.includes(category) ? 'block' : 'none' }} />
                                    </Checkbox>
                                    <span className="pv-body text-sm">{category}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Commission */}
                    <div>
                        <label className="pv-form-label">Commission</label>
                        <span className="pv-form-desc">What % of revenue do you want as commission?</span>
                        <input type="number" value={commission} min={0} max={100}
                            onChange={e => setCommission(e.target.value)} className="pv-form-control" style={{ maxWidth: '140px' }} />
                        {errors.commission && <p className="mt-1 text-sm text-red-500">{errors.commission[0]}</p>}
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="pv-form-label">Remarks</label>
                        <span className="pv-form-desc">Anything you want vendors to know</span>
                        <textarea value={remarks} rows={3}
                            onChange={(e) => {
                                setRemarks(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            className="pv-form-control" style={{ resize: 'none', minHeight: '80px' }}
                        />
                        {errors.remarks && <p className="mt-1 text-sm text-red-500">{errors.remarks[0]}</p>}
                    </div>

                    <div>
                        <button type="submit" disabled={loading} className="pv-btn">
                            {loading ? 'Posting…' : 'Post Listing'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default CreateListing;
