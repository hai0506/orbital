import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@headlessui/react";
import MakeOffer from "./MakeOffer";
import ListingDetails from "./ListingDetails";

const Listing = ({fields, role}) => {
    const dates = [];
    const start = new Date(fields.start_date);
    const end = new Date(fields.end_date);
    const current = new Date(start);

    while (current <= end) {
        dates.push(new Date(current)); 
        current.setDate(current.getDate() + 1);
    }

    const [hovered, setHovered] = useState(false);
    const [open, setOpen] = useState(false);

    return (
        <>
            <div onMouseEnter={() => setHovered(true)} 
                onMouseLeave={() => setHovered(false)} 
                className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white max-w-md"
            >
                <ListingDetails fields={fields} />

                {hovered && (
                    <Button onClick={() => {setOpen(true);setHovered(false);}} style={{ marginTop: "10px" }} className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700">
                        Check it out!
                    </Button>
                )}
            </div>
            {role === "vendor" && open && (
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
                                <ListingDetails fields={fields} />
                            </div>

                            <div className="w-[70%] border-l border-gray-300 p-4">
                                <MakeOffer dates={dates} listing={fields}  />
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
            {role === "organization" && open && (
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
                                <ListingDetails fields={fields} />
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

export default Listing;
