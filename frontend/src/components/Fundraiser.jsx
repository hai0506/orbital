import { useState } from 'react';
import { Field, Fieldset, Label, Button, Description, Checkbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid'
import { X, CircleCheckBig, CircleX, Warehouse } from "lucide-react";
import { Button as ShadcnButton } from "./ui/button";
import api from '@/api';
import ListingDetails from "./ListingDetails";
import UploadInventory from './UploadInventory';
import { useNavigate } from "react-router-dom";

const Fundraiser = ({ fundraiser, role }) => {
    const [hovered, setHovered] = useState(false);
    const [open, setOpen] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [openInventory, setOpenInventory] = useState(false);
    const [excelSheet, setExcelSheet] = useState(null);
    // const [inventory, setInventory] = useState(
    //     fundraiser.inventory.map(({ name, price, quantity, remarks }) => ({
    //         Item: name,
    //         Price: price,
    //         Quantity: quantity,
    //         Remarks: remarks
    //     }))
    // );
    const [inventory, setInventory] = useState(() => {
        if (role === 'vendor') {
            return fundraiser.inventory.map(({ name, price, quantity, remarks }) => ({
                Item: name,
                Price: price,
                Quantity: quantity,
                Remarks: remarks
            }));
        } else if (role === 'organization') {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleClick = () => {
        setHovered(false);
        if (role === 'vendor') {
            navigate(`/vfundraiser/${fundraiser.fundraiser_id}`);
        } else if (role === 'organization') {
            navigate(`/ofundraiser/${fundraiser.fundraiser_id}`);
        }
    }

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('status', "confirmed");
            formData.append('agreement', true);
            formData.append('inventory', JSON.stringify(inventory));
            // if (excelSheet) {
            //     formData.append('inventory_file', excelSheet);  
            // }

            console.log("Sending formData:", formData);

            const route = `core/edit-inventory/${fundraiser.fundraiser_id}/`;

            const res = await api.patch(route, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            });
            setOpen(false);
            navigate("/fundraisers");
        } catch (error) {
            console.error(error);
            setErrors(error.response?.data || {detail: "Unknown error"});
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div onMouseEnter={() => setHovered(true)} 
                onMouseLeave={() => setHovered(false)} 
                className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white max-w-md"
            >
                {role === "vendor" && (
                    <ListingDetails fields={fundraiser.offer.listing} />
                )}
                {role === "organization" && (
                    <ListingDetails fields={fundraiser.listing} />
                )}

                {hovered && (
                    <Button 
                        onClick={role === "vendor" && fundraiser.status === "yet to start"
                                    ? () => {setOpen(true);setHovered(false);}
                                    : handleClick
                                } 
                        style={{ marginTop: "10px" }} 
                        className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                    >
                        Check it out!
                    </Button>
                )}
            </div>

            {open && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm overflow-y-auto"
                    onClick={() => setOpen(false)}
                >
                    <div 
                        className="max-w-2xl w-full rounded-lg bg-white p-6 shadow-lg relative max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex flex-col md:flex-row h-full w-full">
                            <div className="w-full md:w-2/5 p-4">
                                {role === "vendor" && (
                                    <ListingDetails fields={{...fundraiser.offer.listing, commission: fundraiser.offer.commission}} days={fundraiser.offer.selectedDays} />
                                )}
                                {role === "organization" && (
                                    <ListingDetails fields={fundraiser.listing} />
                                )}
                            </div>

                            <div className="w-full md:w-3/5 border-t md:border-t-0 md:border-l border-gray-300 p-4">
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
                                                {fundraiser.offer.allDays === "Yes" ? (
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
                                                                {fundraiser.offer.selectedDays?.map((day, index) => (
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
                                                    {(fundraiser.offer.selectedCategories ?? []).map((category) => (
                                                        <span
                                                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${fundraiser.offer.listing.categories.includes(category) ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}
                                                        >
                                                            {category}
                                                        </span>
                                                    ))}
                                                </div>
                                            </Field>
                                            <Field>
                                                <Label className="text-base/7 font-medium text-black">Commission</Label>
                                                {fundraiser.offer.commission >= fundraiser.offer.listing.commission 
                                                    ?   ( 
                                                            <div className="flex items-center gap-2 text-sm text-green-600">
                                                                <CircleCheckBig className="size-4" />
                                                                <span>{fundraiser.offer.commission}% of revenue</span>
                                                            </div>
                                                        )
                                                    :   ( 
                                                            <div className="flex items-center gap-2 text-sm text-red-600">
                                                                <CircleX className="size-4" />
                                                                <span>{fundraiser?.offer?.commission}% of revenue ({fundraiser?.offer?.listing?.commission - fundraiser?.offer?.commission}% less)</span>
                                                            </div>
                                                        )
                                                }
                                            </Field>
                                            <Field>
                                                {fundraiser.offer.remarks && (
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
                                                <div className="flex flex-col gap-2">
                                                    <Label className="text-base/7 font-medium text-black">Inventory</Label>
                                                    <div className="w-fit">
                                                        <ShadcnButton type="button" onClick={() => {setOpenInventory(true); setUpdated(true)}} variant="outline" size="sm">
                                                            <Warehouse />View Inventory
                                                        </ShadcnButton>
                                                    </div>
                                                </div>
                                            </Field>

                                            <UploadInventory
                                                open={openInventory}
                                                onClose={() => setOpenInventory(false)}
                                                inventoryProps={{
                                                    inventory,
                                                    setInventory,
                                                    excelSheet,
                                                    setExcelSheet
                                                }}
                                            />
                                            {updated && (
                                                <Button onClick={handleUpdate} style={{ marginTop: "10px" }} className="inline-flex items-center gap-2 rounded-md bg-green-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-green-600 data-open:bg-green-700">
                                                    Update Inventory
                                                </Button>
                                            )}
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