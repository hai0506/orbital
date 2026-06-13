import _setup  # noqa: F401
from core.models import VendorFundraiser, Product

# Keyed by (vendor_username, post_title)
INVENTORY = {
    ('mamas_kitchen', 'NUS Environment Fair'): [
        {'name': 'Chicken Rice Set',    'quantity': 80,  'price': 5.50,  'remarks': 'Includes soup and side dish.'},
        {'name': 'Bubble Tea (L)',      'quantity': 120, 'price': 3.50,  'remarks': 'Choice of 4 flavours.'},
        {'name': 'Spring Rolls (3pcs)', 'quantity': 60,  'price': 2.00,  'remarks': 'Fried fresh on site.'},
        {'name': 'Kaya Toast Set',      'quantity': 50,  'price': 4.00,  'remarks': 'With soft-boiled egg and Milo.'},
    ],
    ('craft_by_lydia', 'NUS Environment Fair'): [
        {'name': 'Watercolour Set (12)', 'quantity': 30, 'price': 18.00, 'remarks': 'Student-grade, great for beginners.'},
        {'name': 'Handmade Greeting Card', 'quantity': 60, 'price': 3.50, 'remarks': 'Various designs, individually packed.'},
        {'name': 'DIY Craft Kit',        'quantity': 25, 'price': 12.00, 'remarks': 'Includes all materials and instructions.'},
    ],

    ('belle_boutique', 'Charity Bazaar at Esplanade'): [
        {'name': 'Floral Sundress',      'quantity': 20, 'price': 35.00, 'remarks': 'Sizes S, M, L available.'},
        {'name': 'Canvas Tote Bag',      'quantity': 40, 'price': 15.00, 'remarks': 'Charity-edition print, proceeds donated.'},
        {'name': 'Pearl Headband',       'quantity': 35, 'price': 8.00,  'remarks': ''},
        {'name': 'Linen Crop Top',       'quantity': 18, 'price': 22.00, 'remarks': 'Sizes XS, S, M.'},
        {'name': 'Woven Belt',           'quantity': 25, 'price': 12.00, 'remarks': 'One size fits most.'},
    ],
    ('green_thumb', 'Charity Bazaar at Esplanade'): [
        {'name': 'Succulent Trio Pack',  'quantity': 30, 'price': 12.00, 'remarks': 'Comes in a terracotta pot.'},
        {'name': 'Herb Starter Kit',     'quantity': 20, 'price': 18.00, 'remarks': 'Basil, mint, and coriander seeds included.'},
        {'name': 'Monstera Cutting',     'quantity': 15, 'price': 8.00,  'remarks': 'Ready to propagate in water or soil.'},
        {'name': 'Garden Tool Set',      'quantity': 12, 'price': 22.00, 'remarks': 'Trowel, rake, and gloves.'},
    ],

    ('mamas_kitchen', 'GreenWave Sustainability Market'): [
        {'name': 'Chicken Rice Set',     'quantity': 100, 'price': 5.50, 'remarks': 'Biodegradable container.'},
        {'name': 'Laksa (bowl)',         'quantity': 80,  'price': 6.00, 'remarks': 'Signature recipe. Spicy available.'},
        {'name': 'Milo Dinosaur',        'quantity': 100, 'price': 2.50, 'remarks': 'Cold.'},
        {'name': 'Popiah (2pcs)',        'quantity': 60,  'price': 3.50, 'remarks': 'Fresh-rolled on site.'},
    ],
    ('green_thumb', 'GreenWave Sustainability Market'): [
        {'name': 'Succulent Arrangement', 'quantity': 25, 'price': 20.00, 'remarks': 'In upcycled tin can.'},
        {'name': 'Air Plant (Tillandsia)', 'quantity': 40, 'price': 6.00, 'remarks': 'No soil required.'},
        {'name': 'Beeswax Candle + Plant Bundle', 'quantity': 15, 'price': 28.00, 'remarks': 'Gift-ready set.'},
    ],
}


def run():
    created_count = 0
    for (vendor_username, post_title), items in INVENTORY.items():
        try:
            vf = VendorFundraiser.objects.get(
                offer__vendor__username=vendor_username,
                offer__listing__title=post_title,
            )
        except VendorFundraiser.DoesNotExist:
            print(f"  Skipped (no VendorFundraiser): {vendor_username} @ {post_title!r}")
            continue

        if Product.objects.filter(vendor=vf).exists():
            print(f"  Skipped (products exist): {vendor_username} @ {post_title!r}")
            continue

        for item in items:
            Product.objects.create(vendor=vf, **item)
            created_count += 1

        print(f"  Created {len(items)} products for {vendor_username} @ {post_title!r}")

    print(f"  → {created_count} products created.")


if __name__ == '__main__':
    run()
