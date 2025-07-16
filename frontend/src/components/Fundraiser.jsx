import { useState } from "react";
import { Field, Fieldset, Label, Button, Description, Checkbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid'
import { X, CircleCheckBig, CircleX, Warehouse } from "lucide-react";
import { Button as ShadcnButton } from "./ui/button";

import ListingDetails from "./ListingDetails";
import { useNavigate } from "react-router-dom";

const Fundraiser = ({ fundraiser, role }) => {
    const [hovered, setHovered] = useState(false);
    const [open, setOpen] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const navigate = useNavigate();

    const handleClick = () => {
        setHovered(false);
        navigate(`/fundraiser/${fundraiser.id}`);
    }

    return (
        <>
            <div onMouseEnter={() => setHovered(true)} 
                onMouseLeave={() => setHovered(false)} 
                className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white max-w-md"
            >
                <ListingDetails fields={fundraiser.listing} />

                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                >
                    <X/>
                </button>

                {hovered && (
                    <Button onClick={
                        /*
                        () => {setOpen(true);setHovered(false);}
                        */
                       handleClick} style={{ marginTop: "10px" }} className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700">
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
                                {role === "vendor" && (
                                    <ListingDetails fields={{...fundraiser.listing, commission: fundraiser.commission}} days={fundraiser.selectedDays} />
                                )}
                                {role === "organization" && (
                                    <ListingDetails fields={fundraiser.listing} />
                                )}
                            </div>

                            <div className="w-[70%] border-l border-gray-300 p-4">
                                {role === "organization" &&
                                    fundraiser.vendors.map((offer, index) => {
                                        const isExpanded = expandedIndex === index;

                                        return (
                                            <div
                                                key={offer.offer_id || index}
                                                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                                                className={`
                                                cursor-pointer rounded-2xl border p-4 shadow-md bg-white
                                                transition-all duration-300 overflow-hidden
                                                hover:shadow-lg
                                                ${isExpanded ? 'pb-6' : ''}
                                                `}
                                            >
                                                
                                                <h2 className="text-lg font-semibold">
                                                    {offer.vendor.username}
                                                </h2>
                                                <p className="text-sm text-gray-500">View vendor details</p>

                                                {isExpanded && (
                                                    <div className="pt-4 text-sm text-gray-700">
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
                                                                                <span>{new Intl.DateTimeFormat('en-GB').format(new Date(day))}</span>
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
                                                        <Field>
                                                            <Label className="mb-2 text-base/7 font-medium text-black">Terms and Conditions</Label>
                                                            <Description className="text-sm/6 text-black/50">Do you agree to the Terms and Conditions on the left?</Description>
                                                            <label key="Agreement" className="flex items-center space-x-2 cursor-pointer mt-2">
                                                                <Checkbox
                                                                    disabled
                                                                    checked={true}
                                                                    onChange={() => {setAgreement(!agreement);console.log(agreement)}}
                                                                    className="group size-6 rounded-md bg-black/10 p-1 ring-1 ring-gray-300 ring-inset focus:outline-none data-checked:bg-white-600"
                                                                >
                                                                <CheckIcon className="hidden size-4 fill-black group-data-checked:block" />
                                                                </Checkbox>
                                                                <span className="text-sm text-gray-700">I agree to the terms and conditions of the fundraiser.</span>
                                                            </label>
                                                        </Field>
                                                        <Field style={{ marginTop: "10px"}}>
                                                            <Label className="mb-2 text-base/7 font-medium text-black">Inventory</Label>
                                                            <ShadcnButton type="button" onClick={() => setOpenInventory(true)} variant="outline" size="sm">
                                                                <Warehouse />View Inventory
                                                            </ShadcnButton>
                                                        </Field>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                })}
                                {role === "vendor" && (
                                    <>
                                            <Field>
                                                <Label className="text-base/7 font-medium text-black">Dates</Label>
                                                {fundraiser.allDays === "Yes" ? (
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
                                                                {fundraiser.selectedDays?.map((day, index) => (
                                                                    <li key={index} className="flex items-center gap-2">
                                                                    <span>{new Intl.DateTimeFormat('en-GB').format(new Date(day))}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                    </div>
                                                )}
                                            </Field>
                                            <Field>
                                                <Label className="text-base/7 font-medium text-black">Products</Label>
                                                <div className="flex flex-wrap gap-3">
                                                    {(fundraiser.selectedCategories ?? []).map((category) => (
                                                        <span
                                                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${fundraiser.listing.categories.includes(category) ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}
                                                        >
                                                            {category}
                                                        </span>
                                                    ))}
                                                </div>
                                            </Field>
                                            <Field>
                                                <Label className="text-base/7 font-medium text-black">Commission</Label>
                                                {fundraiser.commission >= fundraiser.listing.commission 
                                                    ?   ( 
                                                            <div className="flex items-center gap-2 text-sm text-green-600">
                                                                <CircleCheckBig className="size-4" />
                                                                <span>{fundraiser.commission}% of revenue</span>
                                                            </div>
                                                        )
                                                    :   ( 
                                                            <div className="flex items-center gap-2 text-sm text-red-600">
                                                                <CircleX className="size-4" />
                                                                <span>{fundraiser.commission}% of revenue ({fundraiser.listing.commission - fundraiser.commission}% less)</span>
                                                            </div>
                                                        )
                                                }
                                            </Field>
                                            <Field>
                                                {fundraiser.remarks && (
                                                    <>
                                                        <Label className="text-base/7 font-medium text-black">Remarks</Label>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            {fundraiser.remarks}
                                                        </div>
                                                    </>
                                                )}
                                            </Field>
                                            <Field>
                                                <Label className="mb-2 text-base/7 font-medium text-black">Terms and Conditions</Label>
                                                <Description className="text-sm/6 text-black/50">Do you agree to the Terms and Conditions on the left?</Description>
                                                <label key="Agreement" className="flex items-center space-x-2 cursor-pointer mt-2">
                                                    <Checkbox
                                                        disabled
                                                        checked={true}
                                                        onChange={() => {setAgreement(!agreement);console.log(agreement)}}
                                                        className="group size-6 rounded-md bg-black/10 p-1 ring-1 ring-gray-300 ring-inset focus:outline-none data-checked:bg-white-600"
                                                    >
                                                    <CheckIcon className="hidden size-4 fill-black group-data-checked:block" />
                                                    </Checkbox>
                                                    <span className="text-sm text-gray-700">I agree to the terms and conditions of the fundraiser.</span>
                                                </label>
                                            </Field>
                                            
                                            <Field style={{ marginTop: "10px"}}>
                                                <Label className="mb-2 text-base/7 font-medium text-black">Inventory</Label>
                                                <ShadcnButton type="button" onClick={() => setOpenInventory(true)} variant="outline" size="sm">
                                                    <Warehouse />View Inventory
                                                </ShadcnButton>
                                            </Field>
                                    </>
                                )} 
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

export default Fundraiser;