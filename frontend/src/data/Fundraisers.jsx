import listings from "./Listings";

const organization = {
    id: 200,
    username: "Test Organization",
    email: "test@test.com"
}

const vendors = [
    {
        vendor: {
            id: 100,
            username: "Mark Lee",
            email: "test@test.com"
        },
        allDays: "No",
        selectedDays: [new Date("2025-06-19"), new Date("2025-06-20")],
        selectedCategories: ["Art & Crafts", "Accessories"],
        otherCategories: "",
        commission: 25,
        remarks: "",
        inventory: [
            { Item: "Socks", Price: 1.5, Quantity: 100, Remarks: "Best seller" },
            { Item: "T-Shirts", Price: 8.0, Quantity: 50, Remarks: "New arrival" },
            { Item: "Hats", Price: 5.5, Quantity: 25, Remarks: "Limited stock" },
            { Item: "Jeans", Price: 20.0, Quantity: 30, Remarks: "Popular" },
            { Item: "Jackets", Price: 40.0, Quantity: 10, Remarks: "" },
            { Item: "Gloves", Price: 3.0, Quantity: 80, Remarks: "Winter collection" },
            { Item: "Scarves", Price: 4.5, Quantity: 60, Remarks: "" },
        ]
    },
    {
        vendor: {
            id: 101,
            username: "Alice Tan",
            email: "alice@vendor.com"
        },
        allDays: "Yes",
        selectedDays: [],
        selectedCategories: ["Jewelry", "Handmade Goods"],
        otherCategories: "Eco-friendly Items",
        commission: 20,
        remarks: "Returning vendor",
        inventory: [
            { Item: "Necklace", Price: 15.0, Quantity: 40, Remarks: "Handmade" },
            { Item: "Bracelet", Price: 10.0, Quantity: 70, Remarks: "" },
            { Item: "Earrings", Price: 12.5, Quantity: 60, Remarks: "Best seller" },
            { Item: "Rings", Price: 8.0, Quantity: 100, Remarks: "" },
            { Item: "Keychains", Price: 5.0, Quantity: 150, Remarks: "Popular item" }
        ]
    },
    {
        vendor: {
            id: 102,
            username: "David Chen",
            email: "david@bazaar.com"
        },
        allDays: "No",
        selectedDays: [new Date("2025-06-21")],
        selectedCategories: ["Home Decor"],
        otherCategories: "",
        commission: 30,
        remarks: "First-time participant",
        inventory: [
            { Item: "Candles", Price: 6.0, Quantity: 40, Remarks: "Scented" },
            { Item: "Lamps", Price: 25.0, Quantity: 20, Remarks: "" },
            { Item: "Wall Art", Price: 30.0, Quantity: 15, Remarks: "Local artist" },
            { Item: "Cushions", Price: 12.0, Quantity: 50, Remarks: "" },
            { Item: "Vases", Price: 18.0, Quantity: 35, Remarks: "Glassware" }
        ]
    }
];


const Fundraisers = [
    {
        fundraiser_id: 100,
        vendors: vendors,
        listing: listings[0],
        status: "concluded",
    }
]

export default Fundraisers;