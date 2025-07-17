import { useState, useEffect } from "react";
import api from "../api"
import { useParams } from 'react-router-dom';
import { Button } from '@headlessui/react'
import Layout from "@/components/Layout";
import ListingDetails from "@/components/ListingDetails";
// import Fundraisers from "@/data/Fundraisers";
import { MoveLeft, MoveRight, X } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs"
 
const OrgFundraiser = () => {
    const { id } = useParams();
    // const [fundraiser, setFundraiser] = useState(Fundraisers[0]);
    const [fundraiser, setFundraiser] = useState({});
    const [loading, setLoading] = useState(false);
    const [hidden, setHidden] = useState(false);
    // const [vendor, setVendor] = useState(fundraiser.vendors[0]);
    // uncomment this section to test fundraiser
    useEffect(() => {
        async function fetchFundraiser() {
            setLoading(true);
            try {
                const fundraiserRes = await api.get(`core/fundraiser/${id}`);
                setFundraiser(fundraiserRes.data);
                console.log(fundraiserRes);
            } catch (error) {
                console.error('Failed to load fundraiser:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchFundraiser();
    }, []);

    if (loading || !fundraiser.listing || !fundraiser.vendors) return <p>Loading...</p>;
    return (
        <Layout heading="View Fundraiser">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex gap-4">
                {!hidden && (
                    <div className="relative w-[25%] p-4 border-r border-gray-300">
                        <ListingDetails fields={{...fundraiser.listing, commission: fundraiser.listing.commission}} days={fundraiser.selectedDays} />
                        <button
                            onClick={() => setHidden(true)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-black"
                        >
                            <MoveLeft/>
                        </button>
                    </div>
                )}
                <div className={`relative ${hidden ? 'w-full' : 'w-[75%]'} flex flex-col`}>
                    <div className="flex flex-col">
                        {hidden && (
                            <button
                                onClick={() => setHidden(false)}
                                className="mb-2 self-start text-gray-500 hover:text-black"
                            >
                                <MoveRight/>
                            </button>
                        )}
                        <Tabs defaultValue={fundraiser.vendors[0].vendor.username} className="w-full">
                            <TabsList className="flex justify-start space-x-2 border-b">
                                {fundraiser.vendors.map(vendor => (
                                    <TabsTrigger value={vendor.vendor.username}>{vendor.vendor.username}</TabsTrigger>
                                ))}
                            </TabsList>
                            {fundraiser.vendors.map(vendor => (
                                <TabsContent value={vendor.vendor.username}>
                                    <>
                                        <h5 className="text-3xl font-semibold mb-2">{vendor.vendor.username}</h5>
                                        <table className="w-full text-sm">
                                            <thead className="sticky top-0 bg-gray-100">
                                                <tr>
                                                    {Object.keys(vendor.inventory?.[0] ?? { Item: '', Price: '', Quantity: '', Remarks: '' }).map(h => (
                                                    <th key={h} className="p-2 text-left">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {vendor.inventory?.map((row, idx) => (
                                                <tr key={idx} className="border-b">
                                                    <td key={row.Item} className="p-2">
                                                        {row.Item}
                                                    </td>
                                                    <td key={row.Price} className="p-2">
                                                        ${row.Price.toFixed(2)}
                                                    </td>
                                                    <td key={row.Quantity} className="p-2">
                                                        {row.Quantity}
                                                    </td>
                                                    <td key={row.Remarks} className="p-2">
                                                        {row.Remarks}
                                                    </td>
                                                </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                </div>
            </div>
        </Layout>
    )

}

export default OrgFundraiser;