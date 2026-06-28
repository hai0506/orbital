import _setup  # noqa: F401
from listings.models import Category

CATEGORIES = [
    "Food & Beverages",
    "Accessories",
    "Stationery",
    "Clothing",
    "Toys",
    "Books",
    "Home Decor",
    "Art & Crafts",
    "Tech Gadgets",
    "Skincare & Beauty",
    "Plants",
    "Pet Supplies",
]


def run():
    created_count = 0
    for value in CATEGORIES:
        _, created = Category.objects.get_or_create(value=value)
        if created:
            created_count += 1
            print(f"  Created category: {value}")
        else:
            print(f"  Skipped (exists): {value}")
    print(f"  → {created_count} categories created.")


if __name__ == '__main__':
    run()
