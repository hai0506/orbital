import { useState } from 'react'
import { Description, Field, Fieldset, Input, Label, Button, Select, Textarea, Checkbox } from '@headlessui/react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

export default function Helper2({ dates }) {
    const [allDays, setAllDays] = useState("Yes");
    const [selectedDays, setSelectedDays] = useState([]);
    const [commission, setCommission] = useState(30);

    const toggle = date => {
        selectedDays.includes(date) ?  setSelectedDays(selectedDays.filter(item => item !== date)) : setSelectedDays([...selectedDays, date]);
    }

    return (
        <form className="w-full max-w-lg px-4">
            <Fieldset>
                <Field>
                    <Label className="text-base/7 font-medium text-black">Dates</Label>
                    <Description className="text-sm/6 text-black/50">Will you be available on all days?</Description>
                    <div className="relative">
                        <Select
                            className={clsx(
                                'mt-3 block w-full appearance-none rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                                'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25',
                                '*:text-black'
                            )}
                            onChange={e => setAllDays(e.target.value)}
                        >
                            <option>Yes</option>
                            <option>No</option>
                        </Select>
                        <ChevronDownIcon
                            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black/60"
                            aria-hidden="true"
                        />
                    </div>
                </Field>
                    {allDays === "No" && (
                        <Field>
                            <Description className="text-sm/6 text-black/50">Which days are you unable to make it?</Description>
                            <div className="relative">
                                {dates.map(date => (
                                    <label key={date} className="flex items-center space-x-2 cursor-pointer mt-2">
                                        <Checkbox
                                        checked={selectedDays.includes(date)}
                                        onChange={() => toggle(date)}
                                        className="group size-6 rounded-md bg-white/10 p-1 ring-1 ring-gray-300 ring-inset focus:outline focus:outline-offset-2 focus:outline-indigo-500 data-checked:bg-indigo-600"
                                        >
                                        <CheckIcon className="hidden size-4 fill-black group-data-checked:block" />
                                        </Checkbox>
                                        <span className="text-gray-700">{date.toLocaleDateString("en-GB")}</span>
                                    </label>
                                ))}
                            </div>
                        </Field>
                    )}
                <Field>
                    <Label className="text-base/7 font-medium text-black">Commission</Label>
                    <Description className="text-sm/6 text-black/50">
                        What % of revenue are you willing to donate?
                    </Description>
                    <Input 
                        value={commission}
                        onChange={e => setCommission(e.target.value)}
                        type="number" 
                        className={clsx(
                                'mt-3 block w-full appearance-none rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                                'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25',
                                '*:text-black'
                            )}
                    />
                </Field>
                <Field>
                    <Label className="text-base/7 font-medium text-black">Remarks</Label>
                    <Description className="text-sm/6 text-black/50">
                        Anything else we might need to know
                    </Description>
                    <Textarea
                        className={clsx(
                        'mt-3 block w-full resize-none rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25'
                        )}
                        rows={3}
                    />
                </Field>
            </Fieldset>
            <Button style={{ marginTop: "10px" }} className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700">
                Make Offer
            </Button>
        </form>
    )
}
