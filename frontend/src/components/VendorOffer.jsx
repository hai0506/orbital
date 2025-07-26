import { useState } from "react";
import { X, CircleCheckBig, CircleX } from "lucide-react";
import { Field, Fieldset, Label, Button } from '@headlessui/react'
import api from "../api";
import ListingDetails from "./ListingDetails";
import ConfirmOffer from "./ConfirmOffer";

const VendorOffer = ({ offer, deleteOffer }) => {
    const [hovered, setHovered] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});


    const status = offer.status;
    const statusColours = {
        pending: "bg-yellow-300",
        approved: "bg-green-300",
        rejected: "bg-red-300",
        confirmed: "bg-green-500",
        cancelled: "bg-red-300",
    }

    const handleSubmit = async () => {
        setLoading(true);
        console.log("Deleting offer")

        try {
            const route = `core/delete-offer/${offer.offer_id}/`; 
            const res = await api.delete(route);
            deleteOffer(offer.offer_id);
            console.log("Deleted offer: ", offer.offer_id);
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
                className={`border border-gray-300 rounded-lg p-4 shadow-sm ${statusColours[status]} max-w-md`}
            >
                <ListingDetails fields={offer.listing} status={status} />

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
                        <div className="flex flex-col md:flex-row h-full w-full">
                            <div className="w-full md:w-2/5 p-4">
                                {status === "approved" 
                                    ? (
                                        <ListingDetails fields={{...offer.listing, commission: offer.commission, categories: offer.selectedCategories}} days={offer.selectedDays} />
                                    )
                                    : (
                                        <ListingDetails fields={offer.listing} />
                                    )
                                }
                            </div>
                            <div className="w-full md:w-3/5 border-t md:border-t-0 md:border-l border-gray-300 p-4">
                                <Fieldset className="w-full max-w-lg px-4">
                                    {status === "approved" && (
                                        <h3 className="text-lg font-semibold text-green-700 mb-3">Congratulations on the offer!</h3>
                                    )}
                                    {status === "rejected" && (
                                        <h3 className="text-lg font-semibold text-red-700 mb-3">Better luck next time!</h3>
                                    )}
                                    {status !== "approved" && (
                                        <>
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
                                        </>
                                    )}

                                    {status === "approved" && (
                                        <ConfirmOffer id={offer.offer_id} deleteOffer={deleteOffer} setOpen={setOpen} />
                                    )}
                                        
                                    {(status === "rejected" || status === "cancelled") && (
                                        <Button onClick={() => handleSubmit()} style={{ marginTop: "10px" }} className="inline-flex items-center gap-2 rounded-md bg-red-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-red-600 data-open:bg-red-700">
                                            Remove Offer
                                        </Button>
                                    )}
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