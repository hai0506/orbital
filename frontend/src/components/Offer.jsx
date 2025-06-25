import { useState } from "react";
import { X, BriefcaseBusiness, CircleCheckBig, CircleX } from "lucide-react";
import { Description, Field, Fieldset, Input, Label, Button, Select, Textarea, Checkbox } from '@headlessui/react'
import MakeOffer from "./MakeOffer";
import ListingDetails from "./ListingDetails";

const Offer = ({fields}) => {
    const [hovered, setHovered] = useState(false);
    const [open, setOpen] = useState(false);

    return (
        <>
            <div onMouseEnter={() => setHovered(true)} 
                onMouseLeave={() => setHovered(false)} 
                className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white max-w-md"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{fields.vendor}</h3>
                <dl style={{ marginTop: "10px" }} className="space-y-2">
                    <div className="flex text-sm text-gray-700">
                        <BriefcaseBusiness className="mr-2" />
                        <dt className="font-medium">{fields.listing.title}</dt>
                    </div>
                </dl>

                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                >
                    <X/>
                </button>

                {hovered && (
                    <Button onClick={() => {setOpen(true);setHovered(false);}} style={{ marginTop: "10px" }} className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700">
                        Check it out!
                    </Button>
                )}
            </div>

            {open && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                >
                    <div 
                        className="max-w-2xl w-full rounded-lg bg-white p-6 shadow-lg relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex h-full w-full">
                            <div className="w-[50%] p-4">
                                <ListingDetails fields={fields.listing} />
                            </div>

                            <form className="w-[70%] border-l border-gray-300 p-4">
                                <Fieldset className="w-full max-w-lg px-4">
                                    <Field>
                                        <Label className="text-base/7 font-medium text-black">Dates</Label>
                                        {fields.allDays === "Yes" ? (
                                            <div className="flex items-center gap-2 text-sm text-green-600">
                                                <CircleCheckBig className="size-4" />
                                                <span>Able to make it on all days</span>
                                            </div>
                                            ) : (
                                            <div className="text-sm text-red-600">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <CircleX className="size-4" />
                                                    <span>Unable to make it on these days:</span>
                                                </div>
                                                    <ul className="pl-6 list-none space-y-1">
                                                        {fields.selectedDays.map((day, index) => (
                                                            <li key={index} className="flex items-center gap-2">
                                                            <span>{new Intl.DateTimeFormat('en-GB').format(day)}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                            </div>
                                        )}
                                    </Field>
                                    <Field>
                                        <Label className="text-base/7 font-medium text-black">Products</Label>
                                        <div className="flex flex-wrap gap-3">
                                            {(fields.selectedCategories ?? []).map((category) => (
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${fields.listing.category_list.includes(category) ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                        </div>
                                    </Field>
                                    <Field>
                                        <Label className="text-base/7 font-medium text-black">Commission</Label>
                                        {fields.commission >= fields.listing.commission 
                                            ?   ( 
                                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                                        <CircleCheckBig className="size-4" />
                                                        <span>{fields.commission}% of revenue</span>
                                                    </div>
                                                )
                                            :   ( 
                                                    <div className="flex items-center gap-2 text-sm text-red-600">
                                                        <CircleX className="size-4" />
                                                        <span>{fields.commission}% of revenue ({fields.listing.commission - fields.commission}% less)</span>
                                                    </div>
                                                )
                                        }
                                    </Field>
                                    <Field>
                                        {fields.remarks && (
                                            <>
                                                <Label className="text-base/7 font-medium text-black">Remarks</Label>
                                                <div className="flex items-center gap-2 text-sm">
                                                    {fields.remarks}
                                                </div>
                                            </>
                                        )}
                                    </Field>

                                    <Button style={{ marginTop: "10px", marginRight: "10px" }} className="inline-flex items-center gap-2 rounded-md bg-green-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-green-600 data-open:bg-green-700">
                                        Accept Offer
                                    </Button>

                                    <Button style={{ marginTop: "10px" }} className="inline-flex items-center gap-2 rounded-md bg-red-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-red-600 data-open:bg-red-700">
                                        Reject Offer
                                    </Button>
                                </Fieldset>
                            </form>
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-black"
                        >
                            <X/>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Offer;