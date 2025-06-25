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
        selectedCategories: ["Art & Crafts", "Accessories", 'sdsdd'],
        otherCategories: "",
        commission: 25,
        remarks: "",
        status: "pending"
    }
]

export default offers;