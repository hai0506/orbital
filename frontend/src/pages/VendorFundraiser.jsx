import React, { useState, useEffect } from 'react';
import api from '../api'
import { useParams } from 'react-router-dom';
import { Button } from '@headlessui/react'
import Layout from "@/components/Layout";
import ListingDetails from "@/components/ListingDetails";
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs"
import { MoveLeft, MoveRight, X } from "lucide-react";
import CountdownClock from '@/components/CountdownClock';
import Dashboard from '@/components/Dashboard';
import Review from '@/components/Review';
import LeftReview from '@/components/LeftReview';

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
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex gap-4">
                {!hidden && (
                    <div className="relative w-[25%] p-4 border-r border-gray-300">
                        <ListingDetails 
                            fields={{...fundraiser?.offer.listing, 
                                        commission: fundraiser?.offer.listing.commission, 
                                        categories: fundraiser?.offer.selectedCategories
                                    }} 
                            days={fundraiser?.offer.selectedDays} 
                        />
                        <button
                            onClick={() => setHidden(true)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-black"
                        >
                            <MoveLeft/>
                        </button>
                        <CountdownClock endTime={`${fundraiser?.offer.listing.end_date}T${fundraiser?.offer.listing.end_time}`} />
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
                        <Tabs defaultValue="inventory" className="w-full">
                            <TabsList className="flex justify-start space-x-2 border-b">
                                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                                <TabsTrigger value="statistics">Statistics</TabsTrigger>
                                {fundraiser.status == "concluded" && (
                                    <TabsTrigger value="review">Review</TabsTrigger>
                                )}
                            </TabsList>
                            <TabsContent value="inventory">
                                <>
                                    <h5 className="text-2xl font-semibold mb-2">Inventory</h5>
                                    <Input
                                        type="search"
                                        placeholder="Search by Item Name"
                                        onChange={e => setSearchItem(e.target.value)}
                                        className="w-full md:w-1/3 mb-2"
                                    />
                                    <div className="max-h-[60vh] overflow-auto">
                                        <table className="w-full text-sm overflow-auto max-h-[60vh]">
                                            <thead className="sticky top-0 bg-gray-100">
                                                <tr>
                                                    <th key='name' className="p-2 text-left">Item</th>
                                                    <th key='price' className="p-2 text-left">Price</th>
                                                    <th key='quantity' className="p-2 text-left">Quantity</th>
                                                    <th key='remarks' className="p-2 text-left">Remarks</th>
                                                    <th />
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inventory?.map(row => (
                                                    <tr className="border-b">
                                                        <td className="p-2">
                                                            {row.name}
                                                        </td>
                                                        <td className="p-2">
                                                            ${row.price.toFixed(2)}
                                                        </td>
                                                        <td className="p-2">
                                                            {row.quantity}
                                                        </td>
                                                        <td className="p-2">
                                                            {row.remarks}
                                                        </td>
                                                        <td className="p-2">
                                                        {(row.quantity > 0 && ongoing) && (
                                                            <button onClick={() => addToCart(row)} className="text-blue-500 hover:text-blue-700">Add to cart</button>
                                                        )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    {(cart.length > 0 && ongoing) && (
                                        <>
                                            <h5 className="text-2xl font-semibold mt-6 mb-2">Checkout</h5>
                                            <div className="max-h-[60vh] overflow-auto">
                                                <table className="w-full text-sm">
                                                    <thead className="sticky top-0 bg-gray-100">
                                                        <tr>
                                                            <th className="p-2 text-left">Item</th>
                                                            <th className="p-2 text-left">Price</th>
                                                            <th className="p-2 text-left">Quantity</th>
                                                            <th className="p-2 text-left">Qty Left</th>
                                                            <th className="p-2 text-left">Total Cost</th>
                                                            <th />
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {cart.map((row, idx) => (
                                                            <>
                                                                <tr className="border-b">
                                                                    <td className="p-2">{row.item}</td>
                                                                    <td className="p-2">${row.price.toFixed(2)}</td>
                                                                    <td className="p-2">
                                                                        <input
                                                                            type="number"
                                                                            className="w-16 border rounded px-2 py-1"
                                                                            value={row.quantity}
                                                                            min={1}
                                                                            max={row.maxQuantity}
                                                                            onChange={(e) => {
                                                                                const max = row.maxQuantity; 
                                                                                let newQuantity = parseInt(e.target.value);

                                                                                if (isNaN(newQuantity)) return;

                                                                                newQuantity = Math.max(1, Math.min(max, newQuantity));

                                                                                const updatedCart = [...cart];
                                                                                const oldQuantity = updatedCart[idx].quantity;
                                                                                const change = newQuantity - oldQuantity;

                                                                                if (change === 0) return;

                                                                                updatedCart[idx].quantity = newQuantity;
                                                                                setCart(updatedCart);

                                                                                setInventory(prevInventory =>
                                                                                    prevInventory.map(product => {
                                                                                        if (product.name === row.item) {
                                                                                            return {
                                                                                                ...product,
                                                                                                quantity: product.quantity - change,
                                                                                            };
                                                                                        }
                                                                                        return product;
                                                                                    })
                                                                                );
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td className="p-2">
                                                                        {row.maxQuantity - row.quantity}
                                                                    </td>
                                                                    <td className="p-2">
                                                                        ${(Number(row.price) * Number(row.quantity)).toFixed(2)}
                                                                    </td>
                                                                    <td className="p-2">
                                                                        <button onClick={() => removeItem(row)} className="text-red-500 hover:text-red-700" >
                                                                            <X />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            
                                            {(cart && ongoing) && (
                                                <>
                                                    <p className="text-2xl font-semibold mt-6 mb-2">Total Price: ${totalCost.toFixed(2)}</p>
                                                    <div className='grid grid-cols-4 gap-4'>
                                                        <div className="flex flex-col">
                                                            <Input
                                                                onChange={e =>
                                                                    setBuyerDetails(prev => ({
                                                                        ...prev,
                                                                        name: e.target.value
                                                                    }))
                                                                }
                                                                type="text"
                                                                placeholder="Name of Buyer"
                                                            />
                                                            {errors.name && (
                                                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                                            )}
                                                        </div>
                                                        <Input
                                                            onChange={e =>
                                                                setBuyerDetails(prev => ({
                                                                    ...prev,
                                                                    phone: e.target.value
                                                                }))
                                                            }
                                                            type="text"
                                                            placeholder="Phone Number (optional)"
                                                        />
                                                        
                                                        <Input
                                                            onChange={e =>
                                                                setBuyerDetails(prev => ({
                                                                    ...prev,
                                                                    email: e.target.value
                                                                }))
                                                            }
                                                            type="email" 
                                                            placeholder="Email Address (optional)"
                                                        />
                                                        <div className="flex flex-col">
                                                        <Select
                                                            onValueChange={value =>
                                                                setBuyerDetails(prev => ({
                                                                    ...prev,
                                                                    payment: value
                                                                }))
                                                            }
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Payment Method" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectItem value="PayLah">PayLah</SelectItem>
                                                                    <SelectItem value="PayNow">PayNow</SelectItem>
                                                                    <SelectItem value="Cash">Cash</SelectItem>
                                                                    <SelectItem value="Card">Card</SelectItem>
                                                                    <SelectItem value="NETS">NETS</SelectItem>
                                                                    <SelectItem value="Others">Others</SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.payment && (
                                                            <p className="mt-1 text-sm text-red-600">{errors.payment}</p>
                                                        )}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {errors && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors[0]}
                                                </p>
                                            )}
                                            <div className="flex gap-4 mt-4">
                                                <Button onClick={handleCheckout} style={{ marginTop: "10px" }} className="self-start inline-flex items-center gap-2 rounded-md bg-green-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-green-600 data-open:bg-green-700">
                                                    Checkout Items
                                                </Button>
                                                <Button onClick={() => setCart([])} style={{ marginTop: "10px" }} className="self-start inline-flex items-center gap-2 rounded-md bg-red-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-red-600 data-open:bg-red-700">
                                                    Clear Items
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </>
                            </TabsContent>
                            <TabsContent value="transactions">
                                <h5 className="text-2xl font-semibold mb-2">Transactions</h5>
                                <Input
                                    type="search"
                                    placeholder="Search by Buyer Name"
                                    onChange={e => setSearchBuyer(e.target.value)}
                                    className="w-full md:w-1/3 mb-2"
                                />
                                {transactions.length > 0 && (
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
                                                {transactions?.map(row => (
                                                    <tr className="border-b">
                                                        <td className="p-2">
                                                            {row.name}
                                                        </td>
                                                        <td className="p-2">
                                                            {row.phone}
                                                        </td>
                                                        <td className="p-2">
                                                            {row.email}
                                                        </td>
                                                        <td className="p-2">
                                                            {row.payment}
                                                        </td>
                                                        <td className="p-2">
                                                            <button onClick={() => setReceipt(row)} className="text-blue-500 hover:text-blue-700">View Receipt</button>
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
                                )}
                                {transactions.length <= 0 && (
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
                                <Dashboard fundraiser={fundraiser} />
                            </TabsContent>
                            {fundraiser.status == "concluded" && (
                                <TabsContent value="review">
                                    {!fundraiser.has_reviewed && (
                                        <>
                                            <h5 className="text-2xl font-semibold mb-2">Review Organisation</h5>
                                            <Review fundraiser={fundraiser} isVendor={true} />
                                        </>
                                    )}
                                    {fundraiser.has_reviewed && (
                                        <>
                                            <h5 className="text-2xl font-semibold mb-2">Review from Organisation</h5>
                                            <LeftReview review={fundraiser.review} isVendor={true} />
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