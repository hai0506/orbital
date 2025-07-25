import { useState, useEffect } from "react";
import api from "../api"
import { useParams } from 'react-router-dom';
import { Input } from "@/components/ui/input"
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
import CountdownClock from '@/components/CountdownClock';
import Review from "@/components/Review";
import LeftReview from "@/components/LeftReview";
import Dashboard from "@/components/Dashboard";
import OrgDashboard from "@/components/OrgDashboard";
 
const OrgFundraiser = () => {
    const { id } = useParams();
    // const [fundraiser, setFundraiser] = useState(Fundraisers[0]);
    const [fundraiser, setFundraiser] = useState({});
    const [loading, setLoading] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [selectedTab, setSelectedTab] = useState("");
    const [receipt, setReceipt] = useState(null);
    const [searchItem, setSearchItem] = useState("");
    const [searchBuyer, setSearchBuyer] = useState("");
    const [filteredInventories, setFilteredInventories] = useState({});
    const [filteredTransactions, setFilteredTransactions] = useState({});
    // const [vendor, setVendor] = useState(fundraiser.vendors[0]);
    // uncomment this section to test fundraiser
    useEffect(() => {
        async function fetchFundraiser() {
            // setLoading(true);
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

    useEffect(() => {
        if (fundraiser?.vendors?.length) {
            setSelectedTab(fundraiser.vendors[0].offer.vendor.username);
        }
    }, [fundraiser]);

    useEffect(() => {
        if (!fundraiser?.vendors) return;

        const newFiltered = {};
        fundraiser.vendors.forEach(vendor => {
            newFiltered[vendor.offer.vendor.username] = vendor.inventory.filter(item =>
                item.name.toLowerCase().includes(searchItem.toLowerCase())
            );
        });

        setFilteredInventories(newFiltered);
    }, [searchItem, fundraiser]);

    useEffect(() => {
        if (!fundraiser?.vendors) return;

        const newFiltered = {};
        fundraiser.vendors.forEach(vendor => {
            newFiltered[vendor.offer.vendor.username] = vendor.transactions.filter(txn =>
                txn.name?.toLowerCase().includes(searchBuyer.toLowerCase())
            );
        });

        setFilteredTransactions(newFiltered);
    }, [searchBuyer, fundraiser]);


    // if (loading || !fundraiser.listing || !fundraiser.vendors) return <p>Loading...</p>;
    return (
        <Layout heading="View Fundraiser">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex gap-4">
                {!hidden && (
                    <div className="relative w-[25%] p-4 border-r border-gray-300">
                        <ListingDetails fields={{...fundraiser?.listing, commission: fundraiser?.listing?.commission}} days={fundraiser?.selectedDays} />
                        <button
                            onClick={() => setHidden(true)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-black"
                        >
                            <MoveLeft/>
                        </button>
                        <CountdownClock 
                            startTime={`${fundraiser?.listing?.start_date}T${fundraiser?.listing?.start_time}`}
                            endTime={`${fundraiser?.listing?.end_date}T${fundraiser?.listing?.end_time}`} 
                        />
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
                        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                            <TabsList className="flex justify-start space-x-2 border-b mb-2">
                                <TabsTrigger key="overall" value="overall">
                                    Overall
                                </TabsTrigger>
                                {fundraiser?.vendors?.map(vendor => (
                                    <TabsTrigger key={vendor.offer.vendor.username} value={vendor.offer.vendor.username}>
                                        {vendor.offer.vendor.username}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            <TabsContent value="overall">
                                <OrgDashboard fundraiser={fundraiser} />
                            </TabsContent>
                            {fundraiser?.vendors?.map(vendor => (
                                <TabsContent value={vendor.offer.vendor.username}>
                                    <>
                                        <h5 className="text-3xl font-semibold mb-2">{vendor.offer.vendor.username}</h5>
                                        <Tabs defaultValue="inventory" className="w-full mb-2">
                                            <TabsList className="flex justify-start space-x-2 border-b mb-4">
                                                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                                                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                                                <TabsTrigger value="statistics">Statistics</TabsTrigger>
                                                <TabsTrigger value="review">Review</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="inventory">
                                                <>
                                                    <h5 className="text-2xl font-semibold mb-2">Transactions</h5>
                                                    <Input
                                                        type="search"
                                                        placeholder="Search by Item Name"
                                                        onChange={e => setSearchItem(e.target.value)}
                                                        className="w-full md:w-1/3 mb-3"
                                                    />
                                                    <div className="max-h-[60vh] overflow-auto">
                                                        <table className="w-full text-sm">
                                                            <thead className="sticky top-0 bg-gray-100">
                                                                <tr>
                                                                    <th key='name' className="p-2 text-left">Item</th>
                                                                    <th key='price' className="p-2 text-left">Price</th>
                                                                    <th key='quantity' className="p-2 text-left">Quantity</th>
                                                                    <th key='remarks' className="p-2 text-left">Remarks</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {(filteredInventories[vendor.offer.vendor.username] || vendor.inventory)?.map((row, idx) => (
                                                                    <tr key={idx} className="border-b">
                                                                    <td className="p-2">{row.name}</td>
                                                                    <td className="p-2">${row.price.toFixed(2)}</td>
                                                                    <td className="p-2">{row.quantity}</td>
                                                                    <td className="p-2">{row.remarks}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>
                                            </TabsContent>
                                            <TabsContent value="transactions">
                                                {vendor.transactions.length > 0 && (
                                                    <>
                                                        <h5 className="text-2xl font-semibold mb-2">Transactions</h5>
                                                        <Input
                                                            type="search"
                                                            placeholder="Search by Buyer Name"
                                                            onChange={e => setSearchBuyer(e.target.value)}
                                                            className="w-full md:w-1/3 mb-3"
                                                        />
                                                        <div className="max-h-[60vh] overflow-auto">
                                                            <table className="w-full text-sm">
                                                                <thead className="sticky top-0 bg-gray-100">
                                                                    <tr>
                                                                        <th key='name' className="p-2 text-left">Buyer Name</th>
                                                                        <th key='phone' className="p-2 text-left">Phone Number</th>
                                                                        <th key='email' className="p-2 text-left">Email Address</th>
                                                                        <th key='payment' className="p-2 text-left">Payment Method</th>
                                                                        <th key='receipt' className="p-2 text-left">Receipt</th>
                                                                        <th key='datetime' className="p-2 text-left">Time of Transaction</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {(filteredTransactions[vendor.offer.vendor.username] || vendor.transactions)?.map((row, idx) => (
                                                                        <tr key={idx} className="border-b">
                                                                        <td className="p-2">{row.name}</td>
                                                                        <td className="p-2">{row.phone}</td>
                                                                        <td className="p-2">{row.email}</td>
                                                                        <td className="p-2">{row.payment}</td>
                                                                        <td className="p-2">
                                                                            <button onClick={() => setReceipt(row)} className="text-blue-500 hover:text-blue-700">
                                                                            View Receipt
                                                                            </button>
                                                                        </td>
                                                                        <td className="p-2">
                                                                            {new Date(row.time_created).toLocaleString('en-SG', {
                                                                                dateStyle: 'medium',
                                                                                timeStyle: 'short',
                                                                            })}
                                                                        </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </>
                                                )}
                                                
                                                {vendor.transactions.length <= 0 && (
                                                    <p>No transactions yet.</p>
                                                )}

                                                {receipt?.items && (
                                                    <div 
                                                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                                                        onClick={() => setReceipt(null)}
                                                    >
                                                        <div 
                                                            className="max-w-2xl w-full rounded-lg bg-white p-6 shadow-lg relative"
                                                            onClick={e => e.stopPropagation()}
                                                        >
                                                            <div className="flex flex-col h-full w-full">
                                                                <h5 className="text-2xl font-semibold mb-2">Receipt</h5>
                                                                <div className="max-h-[60vh] overflow-auto">
                                                                    <table className="w-full text-sm">
                                                                        <thead className="sticky top-0 bg-gray-100">
                                                                            <tr>
                                                                                <th key='receipt-item' className="p-2 text-left">Item</th>
                                                                                <th key='receipt-price' className="p-2 text-left">Unit Price</th>
                                                                                <th key='receipt-quantity' className="p-2 text-left">Quantity</th>
                                                                                <th key='receipt-cost' className="p-2 text-left">Total Cost</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {receipt?.items?.map(item => (
                                                                                <tr className="border-b">
                                                                                    <td className="p-2">
                                                                                        {item.product.name}
                                                                                    </td>
                                                                                    <td className="p-2">
                                                                                        ${item.product.price.toFixed(2)}
                                                                                    </td>
                                                                                    <td className="p-2">
                                                                                        {item.quantity}
                                                                                    </td>
                                                                                    <td className="p-2">
                                                                                        ${item.total_price.toFixed(2)}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                                <p className="text-2xl font-semibold mt-6 mb-2">Total Price: ${receipt.total_price.toFixed(2)}</p>
                                                            </div>
                
                                                            <button
                                                                onClick={() => setReceipt(null)}
                                                                className="absolute top-2 right-2 text-gray-500 hover:text-black"
                                                            >
                                                                <X/>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </TabsContent>
                                            <TabsContent value="statistics">
                                                <Dashboard fundraiser={vendor} />
                                            </TabsContent>
                                            <TabsContent value="review">
                                                {/* 
                                                    <h5 className="text-2xl font-semibold mb-2">Review Vendor</h5>
                                                    <Review fundraiser={vendor} isVendor={false} />
                                                */}
                                                <h5 className="text-2xl font-semibold mb-2">Review from Vendor</h5>
                                                <LeftReview review={{rating: 4, comment: "Great planning!"}} isVendor={false} />
                                            </TabsContent>
                                        </Tabs>
                                        
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