import { useState } from "react";
import { X, BriefcaseBusiness, CircleCheckBig, CircleX } from "lucide-react";
import { Description, Field, Fieldset, Input, Label, Button, Select, Textarea, Checkbox } from '@headlessui/react'
import MakeOffer from "./MakeOffer";
import ListingDetails from "./ListingDetails";

const VendorOffer = ({offer}) => {
    const [hovered, setHovered] = useState(false);
    const [open, setOpen] = useState(false);
    const status = offer.status;
    const statusColours = {
        pending: "bg-yellow-300",
        approved: "bg-green-300",
        rejected: "bg-red-300",
    }

    return (
        <>
            <div onMouseEnter={() => setHovered(true)} 
                onMouseLeave={() => setHovered(false)} 
                className={`border border-gray-300 rounded-lg p-4 shadow-sm ${statusColours[status]} max-w-md`}
            >
                <ListingDetails fields={offer.listing} status={status} />


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
                                <ListingDetails fields={offer.listing} />
                            </div>

                            <div className="w-[70%] border-l border-gray-300 p-4">
                                <Fieldset className="w-full max-w-lg px-4">
                                    <Field>
                                        <Label className="text-base/7 font-medium text-black">Dates</Label>
                                        {offer.allDays === "Yes" ? (
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
                                                        {offer.selectedDays.map((day, index) => (
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
                                            {(offer.selectedCategories ?? []).map((category) => (
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${offer.listing.categories.includes(category) ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                        </div>
                                    </Field>
                                    <Field>
                                        <Label className="text-base/7 font-medium text-black">Commission</Label>
                                        {offer.commission >= offer.listing.commission 
                                            ?   ( 
                                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                                        <CircleCheckBig className="size-4" />
                                                        <span>{offer.commission}% of revenue</span>
                                                    </div>
                                                )
                                            :   ( 
                                                    <div className="flex items-center gap-2 text-sm text-red-600">
                                                        <CircleX className="size-4" />
                                                        <span>{offer.commission}% of revenue ({offer.listing.commission - offer.commission}% less)</span>
                                                    </div>
                                                )
                                        }
                                    </Field>
                                    <Field>
                                        {offer.remarks && (
                                            <>
                                                <Label className="text-base/7 font-medium text-black">Remarks</Label>
                                                <div className="flex items-center gap-2 text-sm">
                                                    {offer.remarks}
                                                </div>
                                            </>
                                        )}
                                    </Field>
                                </Fieldset>
                            </div>
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

export default VendorOffer;