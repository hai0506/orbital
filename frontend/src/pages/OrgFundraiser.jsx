import { useState, useEffect } from "react";
import api from "../api"
import { useParams } from 'react-router-dom';
import { Input } from "@/components/ui/input"
import Layout from "@/components/Layout";
import ListingDetails from "@/components/ListingDetails";
// import Fundraisers from "@/data/Fundraisers";
import { MoveLeft, MoveRight, MoveDown, MoveUp, X } from "lucide-react";
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
import TransactionsTab from "@/components/TransactionsTab";
import InventoryTab from "@/components/InventoryTab";
import Receipt from "@/components/Receipt";
 
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

    useEffect(() => {
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
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-4">
                {!hidden && (
                    <div className="relative w-full md:w-[20%] p-4 pt-8 border-b md:border-b-0 md:border-r border-gray-300">
                        <button
                            onClick={() => setHidden(true)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-black flex items-center"
                        >
                            <MoveUp className="md:hidden" />
                            <MoveLeft className="hidden md:inline" />
                            <span className="text-sm ml-1">Hide Info</span>
                        </button>

                        <ListingDetails
                            fields={{
                                ...fundraiser?.listing,
                                commission: fundraiser?.listing?.commission
                            }}
                            days={fundraiser?.selectedDays}
                        />

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
                                <MoveDown className="md:hidden" />
                                <MoveRight className="hidden md:inline" />
                                <span className="text-sm">Show Info</span>
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
                                                {vendor.status == "concluded" && (
                                                    <TabsTrigger value="review">Review</TabsTrigger>
                                                )}
                                            </TabsList>
                                            <TabsContent value="inventory">
                                                <InventoryTab
                                                    inventory={filteredInventories[vendor.offer.vendor.username] || vendor.inventory}
                                                    searchItem={searchItem}
                                                    setSearchItem={setSearchItem}
                                                    ongoing={vendor.ongoing}
                                                    isVendor={false}
                                                />
                                            </TabsContent>
                                            <TabsContent value="transactions">
                                                <TransactionsTab
                                                    transactions={filteredTransactions[vendor.offer.vendor.username] || vendor.transactions}
                                                    setSearchBuyer={setSearchBuyer}
                                                    setReceipt={setReceipt}
                                                />
                                                {receipt?.items && (
                                                    <Receipt
                                                        receipt={receipt}
                                                        setReceipt={setReceipt}
                                                    />
                                                )}
                                            </TabsContent>
                                            <TabsContent value="statistics">
                                                <Dashboard fundraiser={vendor} />
                                            </TabsContent>
                                            {vendor.status == "concluded" && (
                                                <TabsContent value="review">
                                                    {!vendor.review_received && (
                                                        <>
                                                            <h5 className="text-2xl font-semibold mb-2">Review Vendor</h5>
                                                            <Review fundraiser={vendor} isVendor={false} onSubmitReview={fetchFundraiser} />
                                                        </>
                                                    )}
                                                    {vendor.review_received && (
                                                        <>
                                                            <h5 className="text-2xl font-semibold mb-2">Review from Vendor</h5>
                                                            <LeftReview review={vendor.review_sent} isVendor={false} />
                                                        </>
                                                    )}
                                                </TabsContent>
                                            )}
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