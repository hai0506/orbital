import { useState } from 'react'
import { Description, Field, Fieldset, Input, Label, Button, Select, Textarea, Checkbox } from '@headlessui/react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid'
import allCategories from './AllCategories'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import clsx from 'clsx'

export default function MakeOffer({ dates, listing }) {
    const [categories, setCategories] = useState(allCategories);  
    const [allDays, setAllDays] = useState("Yes");
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [commission, setCommission] = useState(30);
    const [remarks, setRemarks] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [editingOther, setEditingOther] = useState(false);
    const [otherDraft, setOtherDraft] = useState("");                

    const navigate = useNavigate();
    const toggle = (target, arr, setArr) => {
        arr.includes(target) ? setArr(arr.filter(item => item !== target)) : setArr([...arr, target]);
    }

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        console.log("Making offer")

        const selectedDaysFormatted = selectedDays.map(d =>
            d instanceof Date ? d.toISOString().split('T')[0] : d
        );

        try {
            const info = {
                listing: listing.post_id,
                allDays, 
                selectedDays: selectedDaysFormatted,
                category_list: selectedCategories,
                commission,
                remarks,
                status: "pending"
            }

            console.log("Sending info:", info);
            const route = "core/create-offer/"; // change this if needed
            const res = await api.post(route, info)
            navigate("/offers")
        } catch (error) {
            console.log(error)
            setErrors(error.response.data)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg px-4">
            <Fieldset>
                <Field>
                    <Label className="text-base/7 font-medium text-black">Dates</Label>
                    <Description className="text-sm/6 text-black/50">Will you be available on all days?</Description>
                    <div className="relative">
                        <Select
                            className={clsx(
                                'mt-3 block w-full appearance-none rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                                'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25',
                                '*:text-black'
                            )}
                            onChange={e => setAllDays(e.target.value)}
                            
                        >
                            <option>Yes</option>
                            <option>No</option>
                        </Select>
                        <ChevronDownIcon
                            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black/60"
                            aria-hidden="true"
                        />
                        {errors.allDays && (
                            <p className="mt-1 text-sm text-red-600">{errors.allDays[0]}</p>
                        )}
                    </div>
                </Field>
                {allDays === "No" && (
                    <Field>
                        <Description style={{ marginTop: "10px" }} className="text-sm/6 text-black/50">Which days are you unable to make it?</Description>
                        <div className="grid grid-cols-2 gap-1 mt-2 max-h-25 overflow-y-auto">
                            {dates.map(date => (
                                <label key={date} className="flex items-center space-x-2 cursor-pointer mt-2">
                                    <Checkbox
                                        checked={selectedDays.includes(date)}
                                        onChange={() => toggle(date, selectedDays, setSelectedDays)}
                                        className="group size-6 rounded-md bg-white/10 p-1 ring-1 ring-gray-300 ring-inset focus:outline-none data-checked:bg-indigo-600"
                                    >
                                    <CheckIcon className="hidden size-4 fill-black group-data-checked:block" />
                                    </Checkbox>
                                    <span className="text-sm text-gray-700">{date.toLocaleDateString("en-GB")}</span>
                                </label>
                            ))}
                        </div>
                        {errors.selectedDays && (
                            <p className="mt-1 text-sm text-red-600">{errors.selectedDays[0]}</p>
                        )}
                    </Field>
                )}
                <Field>
                    <Label className="text-base/7 font-medium text-black">Products</Label>
                    <Description className="text-sm/6 text-black/50">What will you be selling?</Description>
                    <div className="grid grid-cols-2 gap-1 mt-2 max-h-25 overflow-y-auto">
                        {categories.map(category => (
                            <label key={category} className="flex items-center space-x-2 cursor-pointer mt-2">
                                <Checkbox
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => toggle(category, selectedCategories, setSelectedCategories)}
                                    className="group size-6 rounded-md bg-white/10 p-1 ring-1 ring-gray-300 ring-inset focus:outline-none data-checked:bg-indigo-600"
                                >
                                <CheckIcon className="hidden size-4 fill-black group-data-checked:block" />
                                </Checkbox>
                                <span className="text-sm text-gray-700">{category}</span>
                            </label>
                        ))}
                        <label className="flex items-center space-x-2 cursor-pointer mt-2">
                            <Checkbox
                                checked={
                                    editingOther
                                        ? true
                                        : otherDraft.trim()
                                        ? selectedCategories.includes(otherDraft.trim())
                                        : false
                                }
                                onChange={() => {
                                    if (editingOther) return; 
                                    setEditingOther(true);    
                                }}
                                className="group size-6 rounded-md bg-white/10 p-1 ring-1 ring-gray-300 ring-inset focus:outline-none data-checked:bg-indigo-600"
                            >
                                <CheckIcon className="hidden size-4 fill-black group-data-checked:block" />
                            </Checkbox>

                            {editingOther ? (
                                <Input
                                    type="text"
                                    placeholder="Enter custom category"
                                    className="text-sm text-gray-700 border rounded px-2 py-1"
                                    value={otherDraft}
                                    autoFocus
                                    onChange={e => setOtherDraft(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === "Enter") e.target.blur();
                                    }}
                                    onBlur={() => {
                                        const value = otherDraft.trim();

                                        if (value) {
                                            if (!categories.includes(value)) {
                                                setCategories(prev => [...prev, value]);
                                            }
                                            setSelectedCategories(prev =>
                                                prev.includes(value) ? prev : [...prev, value]
                                            );
                                        }

                                        setOtherDraft("");
                                        setEditingOther(false);
                                    }}
                                />
                            ) : (
                                <span
                                    className="text-sm text-gray-700"
                                    onClick={() => setEditingOther(true)}
                                    >
                                    {otherDraft.trim() || "Others"}
                                </span>
                            )}
                        </label>

                    </div>
                    {errors.category_list && (
                        <p className="mt-1 text-sm text-red-600">{errors.category_list[0]}</p>
                    )}
                </Field>
                <Field>
                    <Label className="text-base/7 font-medium text-black">Commission</Label>
                    <Description className="text-sm/6 text-black/50">
                        What % of revenue are you willing to donate?
                    </Description>
                    <Input 
                        value={commission}
                        onChange={e => setCommission(e.target.value)}
                        type="number" 
                        className={clsx(
                                'mt-3 block w-full appearance-none rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                                'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25',
                                '*:text-black'
                            )}
                    />
                    {errors.commission && (
                        <p className="mt-1 text-sm text-red-600">{errors.commission[0]}</p>
                    )}
                </Field>
                <Field>
                    <Label className="text-base/7 font-medium text-black">Remarks</Label>
                    <Description className="text-sm/6 text-black/50">
                        Anything else we might need to know
                    </Description>
                    <Textarea
                        value={remarks}
                        onChange={e => setRemarks(e.target.value)}
                        className={clsx(
                        'mt-3 block w-full resize-none rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25'
                        )}
                        rows={3}
                    />
                </Field>
                <Button type="submit" style={{ marginTop: "10px" }} className="inline-flex items-center gap-2 rounded-md bg-green-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-green-600 data-open:bg-green-700">
                    Make Offer
                </Button>
                <Button type="button" style={{ marginTop: "10px" }} className="ml-8 inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                 onClick={() => navigate("/chat", {state:{receiverId: listing.author.userid}})} >
                    Contact Organisation
                </Button>
            </Fieldset>
        </form>
    )
}
