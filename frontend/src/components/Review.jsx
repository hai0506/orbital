import { useState } from 'react';
import api from '@/api';
import { Star } from "lucide-react"
import { Field, Fieldset, Input, Label, Button, Textarea, Description } from '@headlessui/react'
import clsx from 'clsx';

const Review = ({ fundraiser, isVendor, onSubmitReview }) => {
    const [rating, setRating] = useState(-1);
    const [comment, setComment] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [hoverValue, setHoverValue] = useState(null);
    const recipientId = isVendor ? fundraiser.org_fundraiser : fundraiser.offer.vendor.id;

    const handleClick = (val) => {
        setRating(val);
    };

    const handleMouseEnter = (val) => {
        setHoverValue(val);
    };

    const handleMouseLeave = () => {
        setHoverValue(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const info = {
                rating: rating,
                comment: comment,
            }
            const res = await api.post(`/core/reviews/${recipientId}`, info);
            if (onSubmitReview) await onSubmitReview();
        } catch(error) {
            console.log(error);
            setErrors(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Fieldset>
                    <Field className={'mb-4'}>
                        <Label className="text-base/7 font-medium text-black">Rating</Label>
                        <Description className="text-sm/6 text-black/50">How much did you like the {isVendor ? "fundraiser" : "vendor's services"}?</Description>
                        <div className="relative">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const isFilled = (hoverValue ?? rating) >= star;
                                    return (
                                        <Star
                                            key={star}
                                            className={`w-6 h-6 cursor-pointer transition-colors ${
                                            isFilled
                                                ? "fill-yellow-400 stroke-yellow-600"
                                                : "fill-white stroke-gray-300"
                                            }`}
                                            onClick={() => handleClick(star)}
                                            onMouseEnter={() => handleMouseEnter(star)}
                                            onMouseLeave={handleMouseLeave}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        {errors.rating && (
                            <p className="mt-1 text-sm text-red-600">{errors.rating[0]}</p>
                        )}
                    </Field>
                    <Field>
                        <Label className="text-base/7 font-medium text-black">Comments</Label>
                        <Description className="text-sm/6 text-black/50">Do you have any feedback about the {isVendor ? "fundraiser" : "vendor's services"}?</Description>
                        <Textarea
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            className={clsx(
                            'mt-3 block w-1/2 resize-none rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25'
                            )}
                            rows={5}
                        />
                        {errors.comment && (
                            <p className="mt-1 text-sm text-red-600">{errors.comment[0]}</p>
                        )}
                    </Field>
                    <Button type="submit" style={{ marginTop: "10px" }} className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700">
                        Submit Review
                    </Button>
                </Fieldset>
            </form>
        </>
    )
}

export default Review;