import { Star } from "lucide-react"
import { Field, Fieldset, Label } from '@headlessui/react'

const LeftReview = ({ review }) => {
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => {
            const starValue = i + 1;

            if (rating >= starValue) {
                return (
                    <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 stroke-yellow-600"
                    />
                );
            } else if (rating > i && rating < starValue) {
                return (
                    <StarHalf
                        key={i}
                        className="w-5 h-5 fill-yellow-400 stroke-yellow-600"
                    />
                );
            } else {
                return (
                    <Star
                        key={i}
                        className="w-5 h-5 fill-white stroke-gray-300"
                    />
                );
            }
        });
    };

    return (
        <>
            <Fieldset>
                <Field className={'mb-4'}>
                    <Label className="text-base/7 font-medium text-black">Rating</Label>
                    <div className="relative">
                        <div className="flex items-center mt-1">{renderStars(review.rating)}</div>
                    </div>
                </Field>
                <Field>
                    <Label className="text-base/7 font-medium text-black">Comment</Label>
                    <p className="mt-1 text-sm text-gray-700 break-words max-w-md">
                        {review.comment}
                    </p>
                </Field>
            </Fieldset>
        </>
    )
}

export default LeftReview;