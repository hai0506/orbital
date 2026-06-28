import { Star } from "lucide-react"
import { Field, Fieldset, Label } from '@headlessui/react'

const LeftReview = ({ review, isVendor }) => {
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => {
            const starValue = i + 1;

            if (rating >= starValue) {
                return (
                    <Star
                        key={i}
                        data-testid="filled-star"
                        className="w-5 h-5 fill-yellow-400 stroke-yellow-600"
                    />
                );
            } else if (rating > i && rating < starValue) {
                return (
                    <StarHalf
                        key={i}
                        data-testid="half-star"
                        className="w-5 h-5 fill-yellow-400 stroke-yellow-600"
                    />
                );
            } else {
                return (
                    <Star
                        key={i}
                        data-testid="unfilled-star"
                        className="w-5 h-5 fill-white stroke-gray-300"
                    />
                );
            }
        });
    };

    return (
        <>
            <Fieldset>
                {review != null && (
                    <>
                        <Field className={'mb-4'}>
                            <Label className="text-base/7 font-medium text-black">Rating</Label>
                            <div className="relative">
                                <div className="flex items-center mt-1">{renderStars(review.rating)}</div>
                            </div>
                        </Field>
                        <Field>
                            <Label className="text-base/7 font-medium text-black">Comment</Label>
                            <p className="mt-1 text-sm text-gray-700 break-words max-w-md">
                                {review.comment || "No comments."}
                            </p>
                        </Field>
                    </>
                )}
                {review == null && (
                    <p className="mt-1 text-sm text-gray-700 break-words max-w-md">
                        {`${isVendor ? "Organisation" : "Vendor"} is yet to leave you a review`}
                    </p>
                )}
            </Fieldset>
        </>
    )
}

export default LeftReview;