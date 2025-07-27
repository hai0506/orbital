import React, { useState, useEffect } from 'react';
import api from '../api'
import { useParams } from 'react-router-dom';
import Layout from "@/components/Layout";
import ListingDetails from "@/components/ListingDetails";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs"
import { MoveLeft, MoveRight, MoveDown, MoveUp, X } from "lucide-react";
import CountdownClock from '@/components/CountdownClock';
import Dashboard from '@/components/Dashboard';
import Review from '@/components/Review';
import LeftReview from '@/components/LeftReview';
import Cart from '@/components/Cart';
import InventoryTab from '@/components/InventoryTab';
import TransactionsTab from '@/components/TransactionsTab';
import Receipt from '@/components/Receipt';

// comment this out to test api
// import transactions from '@/data/Transactions';
 
const VendorFundraiser = () => {
    const { id } = useParams();
    const [fundraiser, setFundraiser] = useState(null);
    const [fullInventory, setFullInventory] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [ongoing, setOngoing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [cart, setCart] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [buyerDetails, setBuyerDetails] = useState({});
    const [fullTransactions, setFullTransactions] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [receipt, setReceipt] = useState(null);
    const [searchItem, setSearchItem] = useState("");
    const [searchBuyer, setSearchBuyer] = useState("");
    const [errors, setErrors] = useState({});
    
    async function fetchFundraiser() {
        try {
            const fundraiserRes = await api.get(`core/fundraiser/${id}`);
            setFundraiser(fundraiserRes.data);
            setFullInventory(fundraiserRes.data.inventory);
            setInventory(fundraiserRes.data.inventory);
            setOngoing(fundraiserRes.data.status == "ongoing");
            console.log(fundraiserRes.data);
        } catch (error) {
            console.error('Failed to load fundraiser:', error);
        }
    }

    useEffect(() => {
        fetchFundraiser();
    }, []);

    useEffect(() => {
        const filtered = fullInventory.filter(item =>
            item.name.toLowerCase().includes(searchItem.toLowerCase())
        );
        setInventory(filtered);
    }, [searchItem, fullInventory]);

    const fetchTransactions = async () => {
        try {
            const transactionsRes = await api.get(`core/transactions/${id}`);
            setFullTransactions(transactionsRes.data);
            setTransactions(transactionsRes.data);
            console.log(transactionsRes.data);
        } catch (error) {
            console.error('Failed to load transactions:', error);
        }
    }

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        const filtered = fullTransactions.filter(txn =>
            txn.name?.toLowerCase().includes(searchBuyer.toLowerCase())
        );
        console.log("Filtered Transactions:", filtered);
        setTransactions(filtered);
    }, [searchBuyer, fullTransactions]);

    useEffect(() => {
        const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
        setTotalCost(total);
    }, [cart])
    

    // comment this out
    // const fundraiser = offers[0];

    const addToCart = item => {
        console.log(item);
        setCart(prevCart => {
            const exists = prevCart.find(i => i.item === item.name);
            if (exists) {
                return prevCart;
            } else {
                return [...prevCart, { product: item.product_id, item: item.name, price: item.price, quantity: 1, maxQuantity: item.quantity }];
            }
        })
        setInventory(prev =>
            prev.filter(product => product.name !== item.name)
        );
    }

    const removeItem = item => {
        setCart(cart.filter(i => i !== item));
        setInventory(prevInventory => [
            ...prevInventory,
            {
                name: item.item,
                price: item.price,
                quantity: item.maxQuantity,
            },
        ]);
    }

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const checkout = { 
                items: cart,
                name: buyerDetails.name,
                phone: buyerDetails.phone,
                email: buyerDetails.email,
                payment: buyerDetails.payment
            };
            console.log(checkout);
            const checkoutRes = await api.post(`core/create-transaction/${id}/`, checkout);
            cart.forEach(item => {
                setInventory(prevInventory => [
                    ...prevInventory,
                    {
                        name: item.item,
                        price: item.price,
                        quantity: item.maxQuantity - item.quantity,
                    },
                ]);
            })
            setCart([]);
            setBuyerDetails({});
            await fetchTransactions();
            await fetchFundraiser();
        } catch (error) {
            console.error('Failed to update inventory:', error);
            setErrors(error.response.data)
        } finally {
            setLoading(false);
        }
    }

    // if (loading || !fundraiser || !fundraiser.inventory) return <p>Loading...</p>;
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
                            fields={{...fundraiser?.offer.listing, 
                                        commission: fundraiser?.offer.listing.commission, 
                                        categories: fundraiser?.offer.selectedCategories
                                    }} 
                            days={fundraiser?.offer.selectedDays} 
                        />
                        <CountdownClock 
                            startTime={`${fundraiser?.listing?.start_date}T${fundraiser?.listing?.start_time}`}
                            endTime={`${fundraiser?.offer.listing.end_date}T${fundraiser?.offer.listing.end_time}`} 
                        />
                    </div>
                )}
                <div className={`transition-all duration-300 w-full md:w-[80%]`}>
                    <div className="flex flex-col">
                        {hidden && (
                            <button
                                onClick={() => setHidden(false)}
                                className="mb-2 self-start md:self-end text-gray-500 hover:text-black flex items-center gap-1"
                            >
                                <MoveDown className="md:hidden" />
                                <MoveRight className="hidden md:inline" />
                                <span className="text-sm">Show Info</span>
                            </button>
                        )}
                        <Tabs defaultValue="inventory" className="w-full">
                            <TabsList className="flex justify-start space-x-2 border-b">
                                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                                <TabsTrigger value="statistics">Statistics</TabsTrigger>
                                {fundraiser?.status == "concluded" && (
                                    <TabsTrigger value="review">Review</TabsTrigger>
                                )}
                            </TabsList>
                            <TabsContent value="inventory">
                                <>
                                    <InventoryTab
                                        inventory={inventory}
                                        searchItem={searchItem}
                                        setSearchItem={setSearchItem}
                                        addToCart={addToCart}
                                        ongoing={ongoing}
                                        isVendor={true}
                                    />

                                    {(cart.length > 0 && ongoing) && (
                                        <Cart
                                            cart={cart}
                                            ongoing={ongoing}
                                            setCart={setCart}
                                            setInventory={setInventory}
                                            removeItem={removeItem}
                                            buyerDetails={buyerDetails}
                                            setBuyerDetails={setBuyerDetails}
                                            errors={errors}
                                            handleCheckout={handleCheckout}
                                            totalCost={totalCost}
                                        />
                                    )}
                                </>
                            </TabsContent>
                            <TabsContent value="transactions">
                                <TransactionsTab
                                    transactions={transactions}
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
                                <Dashboard fundraiser={fundraiser} />
                            </TabsContent>
                            {fundraiser?.status == "concluded" && (
                                <TabsContent value="review">
                                    {!fundraiser?.review_sent && (
                                        <>
                                            <h5 className="text-2xl font-semibold mb-2">Review Organisation</h5>
                                            <Review fundraiser={fundraiser} isVendor={true} onSubmitReview={fetchFundraiser} />
                                        </>
                                    )}
                                    {fundraiser?.review_sent && (
                                        <>
                                            <h5 className="text-2xl font-semibold mb-2">Review from Organisation</h5>
                                            <LeftReview review={fundraiser?.review_received} isVendor={true} />
                                        </>
                                    )}
                                </TabsContent>
                            )}
                        </Tabs>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default VendorFundraiser;