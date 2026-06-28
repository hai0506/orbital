import _setup  # noqa: F401
from fundraisers.models import VendorFundraiser, Product, Transaction, TransactionItem

# Only seed transactions for concluded/ongoing fundraisers to simulate realistic sales.
# Each entry: (vendor_username, post_title, list_of_transactions)
# Each transaction: {'name', 'phone', 'email', 'payment', 'items': [{'product_name', 'qty'}]}

TRANSACTIONS = {
    ('mamas_kitchen', 'NUS Environment Fair'): [
        {'name': 'Tan Wei Lin',   'phone': '91234567', 'email': 'weilin@email.com',  'payment': 'PayNow',
         'items': [{'product': 'Chicken Rice Set', 'qty': 2}, {'product': 'Bubble Tea (L)', 'qty': 2}]},
        {'name': 'Ahmad Faris',   'phone': '82345678', 'email': '',                  'payment': 'Cash',
         'items': [{'product': 'Spring Rolls (3pcs)', 'qty': 3}]},
        {'name': 'Priya Nair',    'phone': '',         'email': 'priya@email.com',   'payment': 'PayLah',
         'items': [{'product': 'Chicken Rice Set', 'qty': 1}, {'product': 'Kaya Toast Set', 'qty': 1}]},
        {'name': 'Chen Mei Ling', 'phone': '93456789', 'email': '',                  'payment': 'NETS',
         'items': [{'product': 'Bubble Tea (L)', 'qty': 4}, {'product': 'Kaya Toast Set', 'qty': 2}]},
        {'name': 'James Lim',     'phone': '84567890', 'email': 'james@email.com',   'payment': 'Card',
         'items': [{'product': 'Chicken Rice Set', 'qty': 3}]},
    ],
    ('craft_by_lydia', 'NUS Environment Fair'): [
        {'name': 'Sarah Goh',   'phone': '91111222', 'email': 'sarah@email.com', 'payment': 'PayNow',
         'items': [{'product': 'Watercolour Set (12)', 'qty': 1}, {'product': 'Handmade Greeting Card', 'qty': 3}]},
        {'name': 'Ravi Kumar',  'phone': '',         'email': '',               'payment': 'Cash',
         'items': [{'product': 'DIY Craft Kit', 'qty': 2}]},
        {'name': 'Nurul Ain',   'phone': '82223334', 'email': 'nurul@email.com', 'payment': 'PayLah',
         'items': [{'product': 'Handmade Greeting Card', 'qty': 5}, {'product': 'Watercolour Set (12)', 'qty': 1}]},
    ],

    ('belle_boutique', 'Charity Bazaar at Esplanade'): [
        {'name': 'Jessica Tan', 'phone': '90001111', 'email': 'jess@email.com', 'payment': 'Card',
         'items': [{'product': 'Floral Sundress', 'qty': 1}, {'product': 'Pearl Headband', 'qty': 1}]},
        {'name': 'Wang Fang',   'phone': '81112222', 'email': '',              'payment': 'PayNow',
         'items': [{'product': 'Canvas Tote Bag', 'qty': 2}]},
        {'name': 'Liyana Bte Aziz', 'phone': '', 'email': 'liyana@email.com', 'payment': 'PayLah',
         'items': [{'product': 'Linen Crop Top', 'qty': 1}, {'product': 'Woven Belt', 'qty': 1}, {'product': 'Canvas Tote Bag', 'qty': 1}]},
        {'name': 'Hannah Lee',  'phone': '92223333', 'email': 'hannah@email.com', 'payment': 'Cash',
         'items': [{'product': 'Floral Sundress', 'qty': 1}, {'product': 'Woven Belt', 'qty': 1}]},
        {'name': 'Celine Ong',  'phone': '83334444', 'email': '',              'payment': 'NETS',
         'items': [{'product': 'Pearl Headband', 'qty': 3}, {'product': 'Canvas Tote Bag', 'qty': 1}]},
    ],
    ('green_thumb', 'Charity Bazaar at Esplanade'): [
        {'name': 'David Koh',   'phone': '94445555', 'email': 'david@email.com',  'payment': 'PayNow',
         'items': [{'product': 'Succulent Trio Pack', 'qty': 2}, {'product': 'Garden Tool Set', 'qty': 1}]},
        {'name': 'Mei Xing',    'phone': '',         'email': 'mxing@email.com', 'payment': 'Cash',
         'items': [{'product': 'Herb Starter Kit', 'qty': 1}]},
        {'name': 'Ramesh S.',   'phone': '85556666', 'email': '',               'payment': 'PayLah',
         'items': [{'product': 'Monstera Cutting', 'qty': 2}, {'product': 'Succulent Trio Pack', 'qty': 1}]},
        {'name': 'Joanne Phua', 'phone': '96667777', 'email': 'joanne@email.com', 'payment': 'Card',
         'items': [{'product': 'Garden Tool Set', 'qty': 1}, {'product': 'Herb Starter Kit', 'qty': 1}]},
    ],

    # Ongoing — some sales already made
    ('mamas_kitchen', 'GreenWave Sustainability Market'): [
        {'name': 'Oliver Ng',  'phone': '97778888', 'email': 'oliver@email.com', 'payment': 'PayNow',
         'items': [{'product': 'Laksa (bowl)', 'qty': 2}, {'product': 'Milo Dinosaur', 'qty': 2}]},
        {'name': 'Sofia Ali',  'phone': '',         'email': '',               'payment': 'Cash',
         'items': [{'product': 'Chicken Rice Set', 'qty': 1}, {'product': 'Popiah (2pcs)', 'qty': 1}]},
    ],
    ('green_thumb', 'GreenWave Sustainability Market'): [
        {'name': 'Elaine Teo', 'phone': '88889999', 'email': 'elaine@email.com', 'payment': 'PayLah',
         'items': [{'product': 'Air Plant (Tillandsia)', 'qty': 3}]},
        {'name': 'Benny Chew', 'phone': '90009001', 'email': '',               'payment': 'Cash',
         'items': [{'product': 'Succulent Arrangement', 'qty': 1}, {'product': 'Air Plant (Tillandsia)', 'qty': 2}]},
    ],
}


def run():
    t_count = 0
    ti_count = 0

    for (vendor_username, post_title), transactions in TRANSACTIONS.items():
        try:
            vf = VendorFundraiser.objects.get(
                offer__vendor__username=vendor_username,
                offer__listing__title=post_title,
            )
        except VendorFundraiser.DoesNotExist:
            print(f"  Skipped (no VendorFundraiser): {vendor_username} @ {post_title!r}")
            continue

        if Transaction.objects.filter(vendor=vf).exists():
            print(f"  Skipped (transactions exist): {vendor_username} @ {post_title!r}")
            continue

        for tx_data in transactions:
            tx = Transaction.objects.create(
                vendor=vf,
                name=tx_data['name'],
                phone=tx_data['phone'] or None,
                email=tx_data['email'] or None,
                payment=tx_data['payment'],
            )
            for item in tx_data['items']:
                product = Product.objects.get(vendor=vf, name=item['product'])
                qty = item['qty']
                product.quantity = max(0, product.quantity - qty)
                product.save()
                TransactionItem.objects.create(transaction=tx, product=product, quantity=qty)
                ti_count += 1
            t_count += 1

        print(f"  Created {len(transactions)} transactions for {vendor_username} @ {post_title!r}")

    print(f"  → {t_count} transactions, {ti_count} transaction items created.")


if __name__ == '__main__':
    run()
