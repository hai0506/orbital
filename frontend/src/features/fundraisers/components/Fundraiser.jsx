import { useState } from 'react';
import { Field, Label, Description } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid'
import { X, CircleCheckBig, CircleX, Warehouse } from "lucide-react";
import { Button as ShadcnButton } from "@/shared/ui/button";
import api from '@/api';
import ListingDetails from "@/features/listings/components/ListingDetails";
import UploadInventory from '@/features/fundraisers/components/UploadInventory';
import { useNavigate } from "react-router-dom";

const Fundraiser = ({ fundraiser, role }) => {
    const [hovered, setHovered] = useState(false);
    const [open, setOpen] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [openInventory, setOpenInventory] = useState(false);
    const [excelSheet, setExcelSheet] = useState(null);
    const [inventory, setInventory] = useState(() => {
        if (role === 'vendor') {
            return fundraiser.inventory.map(({ name, price, quantity, remarks }) => ({
                Item: name,
                Price: price,
                Quantity: quantity,
                Remarks: remarks
            }));
        }
        return null;
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

            const route = `core/edit-inventory/${fundraiser.fundraiser_id}/`;
            await api.patch(route, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setOpen(false);
            navigate("/fundraisers");
        } catch (error) {
            setErrors(error.response?.data || { detail: "Unknown error" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="pv-card cursor-pointer"
            >
                {role === "vendor" && (
                    <ListingDetails fields={fundraiser.offer.listing} />
                )}
                {role === "organization" && (
                    <ListingDetails fields={fundraiser.listing} />
                )}

                {hovered && (
                    <button
                        onClick={role === "vendor" && fundraiser.status === "yet to start"
                            ? () => { setOpen(true); setHovered(false); }
                            : handleClick
                        }
                        style={{ marginTop: "10px" }}
                        className="pv-btn"
                    >
                        Check it out!
                    </button>
                )}
            </div>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="max-w-2xl w-full mx-4 rounded-xl relative max-h-[90vh] overflow-y-auto"
                        style={{
                            background: 'var(--pv-card-bg)',
                            border: '1px solid var(--pv-card-border)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                            padding: '1.5rem'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex flex-col md:flex-row h-full w-full">
                            {/* Left: listing details */}
                            <div className="w-full md:w-2/5 p-4">
                                {role === "vendor" && (
                                    <ListingDetails fields={{ ...fundraiser.offer.listing, commission: fundraiser.offer.commission }} days={fundraiser.offer.selectedDays} />
                                )}
                                {role === "organization" && (
                                    <ListingDetails fields={fundraiser.listing} />
                                )}
                            </div>

                            {/* Right: offer details */}
                            <div
                                className="w-full md:w-3/5 border-t md:border-t-0 md:border-l p-4"
                                style={{ borderColor: 'var(--pv-card-border)' }}
                            >
                                {/* Org view: vendor accordion cards */}
                                {role === "organization" &&
                                    fundraiser.vendors.map((offer, index) => {
                                        const isExpanded = expandedIndex === index;
                                        return (
                                            <div
                                                key={offer.offer_id || index}
                                                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                                                className="pv-card cursor-pointer mb-3"
                                                style={{ transform: 'none' }}
                                            >
                                                <h2 className="pv-heading text-lg font-semibold">
                                                    {offer.vendor.username}
                                                </h2>
                                                <p className="pv-muted text-sm">View vendor details</p>

                                                {isExpanded && (
                                                    <div className="pt-4 text-sm flex flex-col gap-3">
                                                        <Field>
                                                            <Label className="pv-form-label">Dates</Label>
                                                            {offer.allDays === "Yes" ? (
                                                                <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                                                                    <CircleCheckBig className="size-4" />
                                                                    <span>Able to make it on all days</span>
                                                                </div>
                                                            ) : (
                                                                <div className="text-sm text-red-600 mt-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <CircleX className="size-4" />
                                                                        <span>Unable to make it on these days:</span>
                                                                    </div>
                                                                    <ul className="pl-6 list-none space-y-1">
                                                                        {offer.selectedDays.map((day, i) => (
                                                                            <li key={i}>{new Intl.DateTimeFormat('en-GB').format(new Date(day))}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </Field>
                                                        <Field>
                                                            <Label className="pv-form-label">Products</Label>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                {(offer.selectedCategories ?? []).map((category) => (
                                                                    <span
                                                                        key={category}
                                                                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${offer.listing.categories.includes(category) ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}
                                                                    >
                                                                        {category}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </Field>
                                                        <Field>
                                                            <Label className="pv-form-label">Commission</Label>
                                                            {offer.commission >= offer.listing.commission
                                                                ? (
                                                                    <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                                                                        <CircleCheckBig className="size-4" />
                                                                        <span>{offer.commission}% of revenue</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
                                                                        <CircleX className="size-4" />
                                                                        <span>{offer.commission}% of revenue ({offer.listing.commission - offer.commission}% less)</span>
                                                                    </div>
                                                                )
                                                            }
                                                        </Field>
                                                        {offer.remarks && (
                                                            <Field>
                                                                <Label className="pv-form-label">Remarks</Label>
                                                                <div className="pv-body text-sm mt-1">{offer.remarks}</div>
                                                            </Field>
                                                        )}
                                                        <Field>
                                                            <Label className="pv-form-label">Terms and Conditions</Label>
                                                            <Description className="pv-form-desc">Do you agree to the Terms and Conditions on the left?</Description>
                                                            <label className="flex items-center gap-2 cursor-pointer mt-1">
                                                                <div
                                                                    className="size-5 rounded flex items-center justify-center flex-shrink-0"
                                                                    style={{ background: 'var(--pv-purple)', border: '1.5px solid var(--pv-purple)' }}
                                                                >
                                                                    <CheckIcon className="size-3.5 text-white" />
                                                                </div>
                                                                <span className="pv-body text-sm">I agree to the terms and conditions of the fundraiser.</span>
                                                            </label>
                                                        </Field>
                                                        <Field>
                                                            <Label className="pv-form-label">Inventory</Label>
                                                            <div className="mt-2">
                                                                <ShadcnButton type="button" onClick={() => setOpenInventory(true)} variant="outline" size="sm">
                                                                    <Warehouse />View Inventory
                                                                </ShadcnButton>
                                                            </div>
                                                        </Field>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                {/* Vendor view: own offer details */}
                                {role === "vendor" && (
                                    <div className="flex flex-col gap-3">
                                        <Field>
                                            <Label className="pv-form-label">Dates</Label>
                                            {fundraiser.offer.allDays === "Yes" ? (
                                                <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                                                    <CircleCheckBig className="size-4" />
                                                    <span>Able to make it on all days</span>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-red-600 mt-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <CircleX className="size-4" />
                                                        <span>Unable to make it on these days:</span>
                                                    </div>
                                                    <ul className="pl-6 list-none space-y-1">
                                                        {fundraiser.offer.selectedDays?.map((day, i) => (
                                                            <li key={i}>{new Intl.DateTimeFormat('en-GB').format(new Date(day))}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </Field>
                                        <Field>
                                            <Label className="pv-form-label">Products</Label>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {(fundraiser.offer.selectedCategories ?? []).map((category) => (
                                                    <span
                                                        key={category}
                                                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${fundraiser.offer.listing.categories.includes(category) ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}
                                                    >
                                                        {category}
                                                    </span>
                                                ))}
                                            </div>
                                        </Field>
                                        <Field>
                                            <Label className="pv-form-label">Commission</Label>
                                            {fundraiser.offer.commission >= fundraiser.offer.listing.commission
                                                ? (
                                                    <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                                                        <CircleCheckBig className="size-4" />
                                                        <span>{fundraiser.offer.commission}% of revenue</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
                                                        <CircleX className="size-4" />
                                                        <span>{fundraiser?.offer?.commission}% of revenue ({fundraiser?.offer?.listing?.commission - fundraiser?.offer?.commission}% less)</span>
                                                    </div>
                                                )
                                            }
                                        </Field>
                                        {fundraiser.offer.remarks && (
                                            <Field>
                                                <Label className="pv-form-label">Remarks</Label>
                                                <div className="pv-body text-sm mt-1">{fundraiser.remarks}</div>
                                            </Field>
                                        )}
                                        <Field>
                                            <Label className="pv-form-label">Terms and Conditions</Label>
                                            <Description className="pv-form-desc">Do you agree to the Terms and Conditions on the left?</Description>
                                            <label className="flex items-center gap-2 cursor-pointer mt-1">
                                                <div
                                                    className="size-5 rounded flex items-center justify-center flex-shrink-0"
                                                    style={{ background: 'var(--pv-purple)', border: '1.5px solid var(--pv-purple)' }}
                                                >
                                                    <CheckIcon className="size-3.5 text-white" />
                                                </div>
                                                <span className="pv-body text-sm">I agree to the terms and conditions of the fundraiser.</span>
                                            </label>
                                        </Field>
                                        <Field>
                                            <Label className="pv-form-label">Inventory</Label>
                                            <div className="w-fit mt-2">
                                                <ShadcnButton type="button" onClick={() => { setOpenInventory(true); setUpdated(true); }} variant="outline" size="sm">
                                                    <Warehouse />View Inventory
                                                </ShadcnButton>
                                            </div>
                                        </Field>

                                        <UploadInventory
                                            open={openInventory}
                                            onClose={() => setOpenInventory(false)}
                                            inventoryProps={{ inventory, setInventory, excelSheet, setExcelSheet }}
                                        />

                                        {updated && (
                                            <button
                                                onClick={handleUpdate}
                                                disabled={loading}
                                                className="pv-btn pv-btn--success w-fit"
                                            >
                                                {loading ? 'Saving…' : 'Update Inventory'}
                                            </button>
                                        )}

                                        {errors.detail && (
                                            <p className="text-sm text-red-500">{errors.detail}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-3 right-3 pv-icon-btn"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Fundraiser;
