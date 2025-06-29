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
    }
]

const Fundraisers = [
    {
        organization: organization,
        vendors: vendors,
        title: "Test Fundraiser",
        location: "National University of Singapore",
        start_date: new Date("2025-06-17"),
        end_date: new Date("2025-06-29"),
        start_time: "08:45:00",
        end_time: "13:45:00",
    }
]

export default Fundraisers;