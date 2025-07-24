import { useState } from "react";
import { X, BriefcaseBusiness, CircleCheckBig, CircleX } from "lucide-react";
import api from "../api";
import { Field, Fieldset, Label, Button } from '@headlessui/react'
import ListingDetails from "./ListingDetails";
import { useNavigate } from 'react-router-dom'


const Offer = ({ offer, onChangeStatus }) => {
    const [hovered, setHovered] = useState(false);
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (status) => {
        setLoading(true);
        console.log("Accepting/rejecting offer")

        try {
            const info = {
                status: status
            }

            console.log("Sending info:", info);
            const route = `core/edit-offer-status/${offer.offer_id}/`; // change this if needed
            const res = await api.patch(route, info);
            onChangeStatus(offer.offer_id);
            setOpen(false);
        } catch (error) {
            console.log(error)
            setErrors(error.response.data)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div onMouseEnter={() => setHovered(true)} 
                onMouseLeave={() => setHovered(false)} 
                className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white max-w-md"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{offer.vendor.username}</h3>
                <dl style={{ marginTop: "10px" }} className="space-y-2">
                    <div className="flex text-sm text-gray-700">
                        <BriefcaseBusiness className="mr-2" />
                        <dt className="font-medium">{offer.listing.title}</dt>
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
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${offer.listing.categories?.includes(category) ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}
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

                                    <Button onClick={() => handleSubmit("approved")} style={{ marginTop: "10px", marginRight: "10px" }} className="inline-flex items-center gap-2 rounded-md bg-green-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-green-600 data-open:bg-green-700">
                                        Approve Offer
                                    </Button>

                                    <Button onClick={() => handleSubmit("rejected")} style={{ marginTop: "10px" }} className="inline-flex items-center gap-2 rounded-md bg-red-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-red-600 data-open:bg-red-700">
                                        Reject Offer
                                    </Button>
                                    <Button type="button" style={{ marginTop: "10px" }} className="ml-8 inline-flex items-center gap-2 rounded-md bg-green-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                    onClick={() => navigate("/chat", {state:{receiverId: offer.vendor.userid}})} >
                                        Contact Vendor
                                    </Button>
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

export default Offer;