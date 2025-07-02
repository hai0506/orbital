const listing = {
    title: "Project 1",
    location: "National University of Singapore",
    start_date: new Date("2025-06-17"),
    end_date: new Date("2025-06-29"),
    start_time: new Date("2025-06-17T08:45:00"),
    end_time: new Date("2025-06-17T13:45:00"),
    commission: 30,
    category_list: ["Art & Crafts", "Accessories", "Books"]
  }

const offers = [
  {
    listing: listing,
    vendor: {
      username: "Bob",
      email: "test@test.com"
    },
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
    vendor: {
      username: "vendor",
      email: "test@test.com"
    },
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
    vendor: {
      username: "Charlie",
      email: "test@test.com"
    },
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
    vendor: {
      username: "Diana",
      email: "test@test.com"
    },
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
    vendor: {
      username: "Ethan",
      email: "test@test.com"
    },
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