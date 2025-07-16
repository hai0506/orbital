import { useState } from "react";
import { useParams } from 'react-router-dom';
import { Button } from '@headlessui/react'
import Layout from "@/components/Layout";
import ListingDetails from "@/components/ListingDetails";
import offers from "@/data/Offers";
import { MoveLeft, MoveRight, X } from "lucide-react";
 
const Fundraiser = () => {
    const { id } = useParams();
    // uncomment this
    // const [fundraiser, setFundraiser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [cart, setCart] = useState([]);

    const localInventory = [
        { Item: "Socks", Price: 1.5, Quantity: 100, Remarks: "Best seller" },
        { Item: "T-Shirts", Price: 8.0, Quantity: 50, Remarks: "New arrival" },
        { Item: "Hats", Price: 5.5, Quantity: 25, Remarks: "Limited stock" },
        { Item: "Jeans", Price: 20.0, Quantity: 30, Remarks: "Popular" },
        { Item: "Jackets", Price: 40.0, Quantity: 10, Remarks: "" },
        { Item: "Gloves", Price: 3.0, Quantity: 80, Remarks: "Winter collection" },
        { Item: "Scarves", Price: 4.5, Quantity: 60, Remarks: "" },
    ];


    // uncomment this section to test fundraiser
    /*
    useEffect(() => {
        async function fetchFundraiser() {
            try {
                const fundraiserRes = await api.get(`core/fundraiser/${id}`);
                setFundraiser(fundraiser.data);
                console.log(fundraiser);
            } catch (error) {
                console.error('Failed to load fundraiser:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchFundraiser();
    }, []);
    */

    // comment this out
    const fundraiser = offers[0];

    const addToCart = item => {
        setCart(prevCart => {
            const exists = prevCart.find(i => i.Item === item.Item);
            if (exists) {
                return prevCart.map(i =>
                    i.Item === item.Item ? { ...i, Quantity: i.Quantity + 1 } : i
                );
            } else {
                return [...prevCart, { Item: item.Item, Price: item.Price, Quantity: 1, maxQuantity: item.Quantity }];
            }
        })
    }

    const removeItem = idx => setCart(cart.filter((_, i) => i !== idx));

    return (
        <Layout heading="View Fundraiser">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex gap-4">
                {!hidden && (
                    <div className="relative w-[25%] p-4 border-r border-gray-300">
                        <ListingDetails fields={{...fundraiser.listing, commission: fundraiser.commission}} days={fundraiser.selectedDays} />
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
                                    {Object.keys(localInventory?.[0] ?? { Item: '', Price: '', Qty: '', Remarks: '' }).map(h => (
                                    <th key={h} className="p-2 text-left">{h}</th>
                                    ))}
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {localInventory?.map((row, idx) => (
                                <tr key={idx} className="border-b">
                                    {Object.entries(row).map(([k, v]) => (
                                    <td key={k} className="p-2">
                                        {v}
                                    </td>
                                    ))}
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
                                            <th className="p-2 text-left">Total Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map((row, idx) => (
                                            <tr key={idx} className="border-b">
                                                <td className="p-2">{row.Item}</td>
                                                <td className="p-2">{row.Price}</td>
                                                <td className="p-2">
                                                    <input
                                                        type="number"
                                                        className="w-16 border rounded px-2 py-1"
                                                        value={row.Quantity}
                                                        min={1}
                                                        max={row.maxQuantity}
                                                        onChange={(e) => {
                                                            const updatedCart = [...cart];
                                                            updatedCart[idx].Quantity = parseInt(e.target.value) || 0;
                                                            setCart(updatedCart);
                                                        }}
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    {Number(row.Price) * Number(row.Quantity)}
                                                </td>
                                                <td className="p-2">
                                                    <button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700" >
                                                        <X />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex gap-4 mt-4">
                                    <Button  style={{ marginTop: "10px" }} className="self-start inline-flex items-center gap-2 rounded-md bg-green-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-green-600 data-open:bg-green-700">
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
}

export default Fundraiser;