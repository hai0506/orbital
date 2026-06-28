import { useState } from "react";
import { X } from "lucide-react";
import MakeOffer from "@/features/offers/components/MakeOffer";
import ListingDetails from "@/features/listings/components/ListingDetails";
import { useNavigate } from "react-router-dom";
import api from "@/api";

const Listing = ({ fields, role, onCloseListing }) => {
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
    const [loading, setLoading] = useState(false);
    const username = localStorage.getItem("username");
    const navigate = useNavigate();

    const handleClose = async () => {
        setLoading(true);
        try {
            await api.patch(`core/close-post/${fields.post_id}/`, { is_closed: true });
            setHovered(false);
            if (onCloseListing) await onCloseListing();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="pv-card max-w-md"
            >
                <ListingDetails fields={fields} />

                {role === "vendor" && hovered && (
                    <button onClick={() => { setOpen(true); setHovered(false); }} style={{ marginTop: '12px' }} className="pv-btn">
                        Check it out!
                    </button>
                )}

                {role === "organization" && hovered && username !== fields.author.username && (
                    <button onClick={() => navigate("/chat", { state: { receiverId: fields.author.id } })} style={{ marginTop: '12px' }} className="pv-btn">
                        Contact Organization
                    </button>
                )}

                {role === "organization" && hovered && username === fields.author.username && (
                    <button onClick={handleClose} disabled={loading} style={{ marginTop: '12px' }} className="pv-btn pv-btn--danger">
                        Close Listing
                    </button>
                )}
            </div>

            {role === "vendor" && open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="pv-card max-w-2xl w-full relative max-h-[90vh] overflow-y-auto m-4"
                        onClick={e => e.stopPropagation()}
                        style={{ padding: '1.5rem' }}
                    >
                        <div className="flex flex-col md:flex-row h-full w-full">
                            <div className="w-full md:w-2/5 pr-0 md:pr-4 mb-4 md:mb-0">
                                <ListingDetails fields={fields} />
                            </div>
                            <div className="w-full md:w-3/5 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4" style={{ borderColor: 'var(--pv-card-border)' }}>
                                <MakeOffer dates={dates} listing={fields} />
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)} className="absolute top-3 right-3 pv-muted hover:opacity-70 transition-opacity">
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Listing;
