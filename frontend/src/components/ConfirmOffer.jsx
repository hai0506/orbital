import { Radio, RadioGroup, Label, Description, Field, Checkbox, Button } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

const options = [
  {
    label: 'Yes, I will be a vendor for the fundraiser!',
    value: true,
  },
  {
    label: 'No, I will not be a vendor for the fundraiser!',
    value: false,
  },
]

const ConfirmOffer = () => {
  const [going, setGoing] = useState(null);
  const [agreement, setAgreement] = useState(false);
  const [inventory, setInventory] = useState(null);

  return (
    <>
        <Field>
            <Label className="mb-2 text-base/7 font-medium text-black">Confirm Availability</Label>
            <Description className="text-sm/6 text-black/50">Kindly confirm your participation in the fundraiser.</Description>
            <RadioGroup value={going} onChange={setGoing} aria-label="Confirm Availability" className="space-y-2">
                {options.map((option) => (
                    <Radio
                    key={option.label}
                    value={option.value}
                    className="group relative flex cursor-pointer rounded-lg bg-white px-5 py-4 text-black shadow-md transition data-checked:bg-blue-100 data-focus:outline data-focus:outline-blue-500"
                    >
                    <div className="flex w-full items-center justify-between">
                        <div className="text-sm font-medium">{option.label}</div>
                        <CheckCircleIcon className="h-5 w-5 text-blue-600 opacity-0 transition group-data-checked:opacity-100" />
                    </div>
                    </Radio>
                ))}
            </RadioGroup>
        </Field>
        {going === true && (
            <>
                <Field style={{ marginTop: "10px"}}>
                    <Label className="mb-2 text-base/7 font-medium text-black">Terms and Conditions</Label>
                    <Description className="text-sm/6 text-black/50">Do you agree to the Terms and Conditions on the left?</Description>
                    <label key="Agreement" className="flex items-center space-x-2 cursor-pointer mt-2">
                        <Checkbox
                            checked={agreement}
                            onChange={() => {setAgreement(!agreement);console.log(agreement)}}
                            className="group size-6 rounded-md bg-white/10 p-1 ring-1 ring-gray-300 ring-inset focus:outline-none data-checked:bg-indigo-600"
                        >
                        <CheckIcon className="hidden size-4 fill-black group-data-checked:block" />
                        </Checkbox>
                        <span className="text-sm text-gray-700">I agree to the terms and conditions of the fundraiser.</span>
                    </label>
                </Field>
                <Field style={{ marginTop: "10px"}}>
                    <Label className="mb-2 text-base/7 font-medium text-black">Inventory</Label>
                    <Description className="text-sm/6 text-black/50">Upload your Excel sheet here</Description>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                            setInventory(file); // save to state or handle file
                            }
                        }}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        style={{ marginTop: "10px" }}
                    />
                </Field>
                {(agreement === true && inventory !== null) && (
                    <Button type="submit" style={{ marginTop: "10px" }} className="inline-flex items-center gap-2 rounded-md bg-green-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-green-600 data-open:bg-green-700">
                        Confirm Offer
                    </Button>
                )}
            </>
        )}
        {going === false && (
            <Button type="submit" style={{ marginTop: "10px" }} className="inline-flex items-center gap-2 rounded-md bg-red-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-green-600 data-open:bg-green-700">
                Reject Offer
            </Button>
        )}
    </>
  )
}

export default ConfirmOffer
