import { Building2, MapPinned, Calendar1, Clock, HandCoins, Activity } from "lucide-react";
import CategoryTags from "./CategoryTags";
import { Link } from "react-router-dom";

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-GB");

const formatTime = (timeStr) =>
    new Date(`1970-01-01T${timeStr}`).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

const ListingDetails = ({ fields, status, days }) => {
    return (
        <>
            <h3 className="pv-heading font-semibold text-base leading-snug mb-2">{fields["title"]}</h3>
            <CategoryTags categories={fields.categories} />
            <dl style={{ marginTop: "10px" }} className="space-y-2">
                <Link
                    to={`/profiles/${fields.author?.id}`}
                    className="pv-detail-row font-medium hover:opacity-80 transition-opacity"
                >
                    <Building2 size={15} />
                    <dt>{fields.author?.username}</dt>
                </Link>
                <div className="pv-detail-row">
                    <MapPinned size={15} />
                    <dt className="font-medium">{fields["location"]}</dt>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="pv-detail-row">
                        <Calendar1 size={15} />
                        <dt className="font-medium">
                            {formatDate(fields.start_date)} — {formatDate(fields.end_date)}
                        </dt>
                    </div>
                    {days && days.length > 0 && (
                        <div className="ml-5 space-y-0.5">
                            <p className="pv-muted text-xs font-medium">Except:</p>
                            {days.map((day, i) => (
                                <p key={i} className="pv-muted text-xs">{formatDate(day)}</p>
                            ))}
                        </div>
                    )}
                </div>
                <div className="pv-detail-row">
                    <Clock size={15} />
                    <dt className="font-medium">{formatTime(fields.start_time)} — {formatTime(fields.end_time)}</dt>
                </div>
                <div className="pv-detail-row">
                    <HandCoins size={15} />
                    <dt className="font-medium">{fields.commission}% of Total Revenue</dt>
                </div>
                {status && (
                    <div className="pv-detail-row">
                        <Activity size={15} />
                        <dt className="font-medium">{status.charAt(0).toUpperCase() + status.slice(1)}</dt>
                    </div>
                )}
            </dl>
        </>
    );
};

export default ListingDetails;
