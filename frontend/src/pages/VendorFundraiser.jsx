import React, { useState, useEffect } from 'react';
import api from '../api'
import { useParams } from 'react-router-dom';
import { Button } from '@headlessui/react'
import Layout from "@/components/Layout";
import ListingDetails from "@/components/ListingDetails";
import offers from "@/data/Offers";
import { MoveLeft, MoveRight, X } from "lucide-react";
 
const VendorFundraiser = () => {
    const { id } = useParams();
    // uncomment this
    const [fundraiser, setFundraiser] = useState(null);
    const [inventory, setInventory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [cart, setCart] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [errors, setErrors] = useState(null);

    // const localInventory = [
    //     { Item: "Socks", Price: 1.5, Quantity: 100, Remarks: "Best seller" },
    //     { Item: "T-Shirts", Price: 8.0, Quantity: 50, Remarks: "New arrival" },
    //     { Item: "Hats", Price: 5.5, Quantity: 25, Remarks: "Limited stock" },
    //     { Item: "Jeans", Price: 20.0, Quantity: 30, Remarks: "Popular" },
    //     { Item: "Jackets", Price: 40.0, Quantity: 10, Remarks: "" },
    //     { Item: "Gloves", Price: 3.0, Quantity: 80, Remarks: "Winter collection" },
    //     { Item: "Scarves", Price: 4.5, Quantity: 60, Remarks: "" },
    // ];

    // uncomment this section to test fundraiser
    
    useEffect(() => {
        async function fetchFundraiser() {
            // setLoading(true);
            try {
                const fundraiserRes = await api.get(`core/fundraiser/${id}`);
                setFundraiser(fundraiserRes.data);
                setInventory(fundraiserRes.data.inventory);
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
                return [...prevCart, { item: item.name, price: item.price, quantity: 1, maxQuantity: item.quantity }];
            }
        })
        setInventory(prev =>
            prev.filter(product => product.name !== item.name)
        );
    }

    const handleCheckout = async () => {
        setLoading(true);
        try {
            console.log(cart);
            const checkoutRes = await api.patch(`core/update-inventory/${id}/`, cart);
            setCart([]); 
        } catch (error) {
            console.error('Failed to update inventory:', error);
        } finally {
            setLoading(false);
        }
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

    // if (loading || !fundraiser || !fundraiser.inventory) return <p>Loading...</p>;
    return (
        <Layout heading="View Fundraiser">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex gap-4">
                {!hidden && (
                    <div className="relative w-[25%] p-4 border-r border-gray-300">
                        {/* <ListingDetails fields={{...fundraiser?.offer.listing, commission: fundraiser?.offer.listing.commission}} days={fundraiser?.offer.selectedDays} /> */}
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
                        <h5 className="text-2xl font-semibold mb-2">Inventory</h5>
                        <table className="w-full text-sm">
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
                                {inventory?.map((row, idx) => (
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
                                        <button onClick={() => addToCart(row)} className="text-blue-500 hover:text-blue-700">Add to cart</button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        {cart.length > 0 && (
                            <>
                                <h5 className="text-2xl font-semibold mt-6 mb-2">Checkout</h5>
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
                                                                const delta = newQuantity - oldQuantity;

                                                                if (delta === 0) return;

                                                                updatedCart[idx].quantity = newQuantity;
                                                                setCart(updatedCart);

                                                                setInventory(prevInventory =>
                                                                    prevInventory.map(product => {
                                                                        if (product.name === row.item) {
                                                                            return {
                                                                                ...product,
                                                                                quantity: product.quantity - delta,
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
                                {cart && (<p className="text-2xl font-semibold mt-6 mb-2">Total Price: ${totalCost.toFixed(2)}</p>)}
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
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default VendorFundraiser;