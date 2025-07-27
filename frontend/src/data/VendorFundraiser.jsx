import VendorFundraiser from "@/pages/VendorFundraiser"

const vendorFundraiser = {
    "fundraiser_id": 6,
    "offer": {
        "offer_id": 11,
        "vendor": {
            "username": "vendor4",
            "email": "test@test.com",
            "id": 7
        },
        "listing": {
            "post_id": 8,
            "title": "Test Dashboard",
            "location": "NUS",
            "start_date": "2025-07-24",
            "end_date": "2025-07-26",
            "start_time": "18:27:00",
            "end_time": "20:25:00",
            "remarks": "",
            "commission": 30,
            "attachment": null,
            "author": {
                "id": 8,
                "username": "organization2",
                "email": "test@test.com"
            },
            "categories": [
                "Clothing"
            ],
            "is_closed": true
        },
        "allDays": "Yes",
        "selectedDays": [],
        "selectedCategories": [
            "Clothing"
        ],
        "remarks": "",
        "commission": 30,
        "time_created": "2025-07-24T10:27:17.602444Z"
    },
    "revenue": 95.0,
    "inventory": [
        {
            "product_id": 16,
            "name": "Socks",
            "quantity": 44,
            "price": 1.5,
            "image": null,
            "vendor": 6,
            "remarks": "test"
        }
    ],
    "org_fundraiser": 5,
    "transactions": [],
    "status": "concluded",
    "review_sent": null,
    "review_received": null
}

export default VendorFundraiser;