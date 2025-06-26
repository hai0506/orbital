import { MapPinned, Calendar1, Clock, HandCoins, Activity } from "lucide-react";
import CategoryTags from "./CategoryTags";

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-GB");

const formatTime = (timeStr) =>
    new Date(`1970-01-01T${timeStr}Z`).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

const ListingDetails = ({ fields, status }) => {
    return (
        <>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{fields["title"]}</h3>
            <CategoryTags categories={fields.category_list}/>
            <dl style={{ marginTop: "10px" }} className="space-y-2">
                <div className="flex text-sm text-gray-700">
                    <MapPinned className="mr-2" />
                    <dt className="font-medium">{fields["location"]}</dt>
                </div>
                <div className="flex text-sm text-gray-700">
                    <Calendar1 className="mr-2" />
                    <dt className="font-medium">{formatDate(fields.start_date)} - {formatDate(fields.end_date)}</dt>
                </div>
                <div className="flex text-sm text-gray-700">
                    <Clock className="mr-2" />
                    <dt className="font-medium">{formatTime(fields.start_time)} - {formatTime(fields.end_time)}</dt>
                </div>
                <div className="flex text-sm text-gray-700">
                    <HandCoins className="mr-2" />
                    <dt className="font-medium">{fields.commission + "% of Total Revenue"}</dt>
                </div>
                {status && (
                    <div className="flex text-sm text-gray-700">
                        <Activity className="mr-2" />
                        <dt className="font-medium">{status.charAt(0).toUpperCase() + status.slice(1)}</dt>
                    </div>
                )}
            </dl>
        </>
    )
}

export default ListingDetails;