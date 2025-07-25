import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Description, Field, Fieldset, Input, Label, Button, Select, Textarea, Checkbox } from '@headlessui/react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid'
import Layout from '../components/Layout'
import clsx from 'clsx'
import api from '../api'

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
    const [currentTime, setCurrentTime] = useState(() => new Date().toTimeString().slice(0, 5)); 
    
    // const todayDate = new Date().toISOString().split("T")[0];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toTimeString().slice(0, 5));
        }, 60000); 

        return () => clearInterval(interval); 
    }, []);

    // const minTime = startDate === todayDate ? currentTime : undefined;

    const toggle = (target, arr, setArr) => {
        arr.includes(target) ? setArr(arr.filter(item => item !== target)) : setArr([...arr, target]);
    }

    const allCategories = [
        "Food & Beverages",
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
        "Pet Supplies",
    ];

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        console.log("submitting")

        try {
            const info = {
                title, 
                location,
                start_date: startDate,
                end_date: endDate,
                start_time: startTime,
                end_time: endTime,
                remarks,
                commission,
                category_list: categories,
            }

            console.log("Sending info:", info);
            const route = "core/create-post/";
            const res = await api.post(route, info)
            navigate("/")
        } catch (error) {
            console.log(error)
            setErrors(error.response.data)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout heading="Create Listing">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <form
                    onSubmit={handleSubmit}
                    className="w-[1000px] py-6 grid grid-cols-3 gap-4"
                >
                    <Fieldset className="space-y-6">
                        <Field>
                            <Label className="text-base/7 font-medium text-black">Title</Label>
                            <Description className="text-sm/6 text-black/50">What do you want to call your fundraiser?</Description>
                            <div className="relative">
                                <Input 
                                    type="text" 
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className={clsx(
                                            'mt-3 block w-full appearance-none rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                                            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25',
                                            '*:text-black'
                                        )}
                                />
                            </div>
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>
                            )}
                        </Field>
                        <Field>
                            <Label className="text-base/7 font-medium text-black">Location</Label>
                            <Description className="text-sm/6 text-black/50">Where will the fundraiser be held?</Description>
                            <div className="relative">
                                <Input 
                                    type="text" 
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    className={clsx(
                                            'mt-3 block w-full appearance-none rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                                            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25',
                                            '*:text-black'
                                        )}
                                />
                            </div>
                            {errors.location && (
                                <p className="mt-1 text-sm text-red-600">{errors.location[0]}</p>
                            )}
                        </Field>
                        <Field>
                            <Label className="text-base/7 font-medium text-black">Dates</Label>
                            <Description className="text-sm/6 text-black/50">Start date of the fundraiser</Description>
                            <div className="relative">
                                <Input 
                                    type="date" 
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    // min={new Date().toISOString().split("T")[0]}
                                    className={clsx(
                                            'mt-3 block w-full appearance-none rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                                            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25',
                                            '*:text-black'
                                        )}
                                />
                            </div>
                            {errors.start_date && (
                                <p className="mt-1 text-sm text-red-600">{errors.start_date[0]}</p>
                            )}
                            <Description className="text-sm/6 text-black/50 mt-2">End date of the fundraiser</Description>
                            <div className="relative">
                                <Input 
                                    type="date" 
                                    value={endDate}
                                    // min={startDate}
                                    disabled={!startDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className={clsx(
                                            'mt-3 block w-full appearance-none rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                                            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25',
                                            '*:text-black'
                                        )}
                                />
                            </div>
                            {errors.end_date && (
                                <p className="mt-1 text-sm text-red-600">{errors.end_date[0]}</p>
                            )}
                        </Field>
                        <Field>
                            <Label className="text-base/7 font-medium text-black">Timing</Label>
                            <Description className="text-sm/6 text-black/50">Start time of the fundraiser</Description>
                            <div className="relative">
                                <Input 
                                    type="time" 
                                    value={startTime}
                                    // min={minTime}
                                    disabled={!startDate}
                                    onChange={e => setStartTime(e.target.value)}
                                    className={clsx(
                                        'mt-3 block w-full appearance-none rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25',
                                        '*:text-black'
                                    )}
                                />
                            </div>
                            {errors.start_time && (
                                <p className="mt-1 text-sm text-red-600">{errors.start_time[0]}</p>
                            )}
                            <Description className="text-sm/6 text-black/50 mt-2">End time of the fundraiser</Description>
                            <div className="relative">
                                <Input 
                                    type="time" 
                                    value={endTime}
                                    // min={startTime}
                                    disabled={!startTime}
                                    onChange={e => setEndTime(e.target.value)}
                                    className={clsx(
                                            'mt-3 block w-full appearance-none rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                                            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25',
                                            '*:text-black'
                                        )}
                                />
                            </div>
                            {errors.end_time && (
                                <p className="mt-1 text-sm text-red-600">{errors.end_time[0]}</p>
                            )}
                        </Field>
                        <Field>
                            <Label className="text-base/7 font-medium text-black">Vendors</Label>
                            <Description className="text-sm/6 text-black/50">What vendor types do you prefer?</Description>
                            <div className="grid grid-cols-2 gap-1 mt-2 max-h-35 overflow-y-auto">
                                {allCategories.map(category => {
                                        return (<label key={category} className="flex items-center space-x-2 cursor-pointer mt-2">
                                            <Checkbox
                                                className="group size-6 rounded-md bg-white/10 p-1 ring-1 ring-gray-300 ring-inset focus:outline-none data-checked:bg-indigo-600"
                                                checked={categories.includes(category)}
                                                onChange={() => toggle(category, categories, setCategories)}
                                            >
                                            <CheckIcon className="hidden size-4 fill-black group-data-checked:block" />
                                            </Checkbox>
                                            <span className="text-sm text-gray-700">{category}</span>
                                        </label>)
                                })}
                            </div>
                        </Field>
                        <Field>
                            <Label className="text-base/7 font-medium text-black">Commission</Label>
                            <Description className="text-sm/6 text-black/50">
                                What % of revenue do you want as commission?
                            </Description>
                            <Input 
                                type="number" 
                                value={commission}
                                // min={0}
                                // max={100}
                                onChange={e => setCommission(e.target.value)}
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
                                Anything you might want your vendors to know
                            </Description>
                            <Textarea
                                value={remarks}
                                onChange={(e) => {
                                    setRemarks(e.target.value);
                                    e.target.style.height = 'auto'; 
                                    e.target.style.height = `${e.target.scrollHeight}px`; 
                                }}
                                className={clsx(
                                'mt-3 block w-full resize-none rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                                'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25'
                                )}
                                rows={3}
                            />
                            {errors.remarks && (
                                <p className="mt-1 text-sm text-red-600">{errors.remarks[0]}</p>
                            )}
                        </Field>
                        <Button type="submit" style={{ marginTop: "10px" }} className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700">
                            Post Listing
                        </Button>
                    </Fieldset>
                </form>
            </div>
        </Layout>
    )
}

export default CreateListing