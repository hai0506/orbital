import { MapPinned, Calendar1, Clock, HandCoins } from "lucide-react";

const Listing = ({fields}) => {

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-GB");

    const formatTime = (timeStr) =>
        new Date(`1970-01-01T${timeStr}Z`).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

    return (
        <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white max-w-md">
            {/*<h3 className="text-lg font-semibold text-gray-900 mb-3">{details.title}</h3>*/}
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{fields["title"]}</h3>
            <dl className="space-y-2">
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
                    <dt className="font-medium">{fields.commission + "% Commision"}</dt>
                </div>
            </dl>
        </div>
    );
};

export default Listing;
