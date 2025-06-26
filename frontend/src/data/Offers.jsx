const listing = {
    title: "Project 1",
    location: "National University of Singapore",
    start_date: "2025-06-17",
    end_date: "2025-06-29",
    start_time: "08:45:00",
    end_time: "13:45:00",
    commission: "30",
    category_list: ["Art & Crafts", "Accessories", "Books"]
}

const offers = [
  {
    listing: listing,
    vendor: "Bob",
    allDays: "No",
    selectedDays: [new Date("2025-06-19"), new Date("2025-06-20")],
    selectedCategories: ["Art & Crafts", "Accessories"],
    otherCategories: "",
    commission: 25,
    remarks: "",
    status: "pending"
  },
  {
    listing: listing,
    vendor: "Alice",
    allDays: "Yes",
    selectedDays: [],
    selectedCategories: ["Food & Beverages", "Tech Gadgets"],
    otherCategories: "",
    commission: 20,
    remarks: "Can bring additional supplies.",
    status: "approved"
  },
  {
    listing: listing,
    vendor: "Charlie",
    allDays: "No",
    selectedDays: [new Date("2025-06-21")],
    selectedCategories: ["Clothing", "Books"],
    otherCategories: "",
    commission: 30,
    remarks: "Unavailable on weekends.",
    status: "rejected"
  },
  {
    listing: listing,
    vendor: "Diana",
    allDays: "Yes",
    selectedDays: [],
    selectedCategories: ["Plants", "Home Decor"],
    otherCategories: "",
    commission: 18,
    remarks: "",
    status: "pending"
  },
  {
    listing: listing,
    vendor: "Ethan",
    allDays: "No",
    selectedDays: [new Date("2025-06-22"), new Date("2025-06-23")],
    selectedCategories: ["Skincare & Beauty", "Stationery"],
    otherCategories: "",
    commission: 22,
    remarks: "Flexible on timings.",
    status: "approved"
  }
];


export default offers;