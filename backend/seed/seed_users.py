import _setup  # noqa: F401 — configures Django before any imports
from accounts.models import User

ORGANIZATIONS = [
    {
        'username': 'sg_charity_fund',
        'email': 'charity@sgfund.org',
        'password': 'Seeding123!',
        'description': 'A non-profit organising community fundraisers across Singapore since 2010.',
    },
    {
        'username': 'nus_bizclub',
        'email': 'bizclub@nus.edu.sg',
        'password': 'Seeding123!',
        'description': 'NUS Business Club — hosting campus events, bazaars, and career fairs.',
    },
    {
        'username': 'greenwave_sg',
        'email': 'hello@greenwave.sg',
        'password': 'Seeding123!',
        'description': 'Sustainability-focused events promoting eco-friendly living in Singapore.',
    },
    {
        'username': 'esplanade_events',
        'email': 'events@esplanade.com',
        'password': 'Seeding123!',
        'description': 'Professional event management at Esplanade and Marina Bay venues.',
    },
]

VENDORS = [
    {
        'username': 'mamas_kitchen',
        'email': 'mama@kitchen.sg',
        'password': 'Seeding123!',
        'description': 'Home-cooked Singaporean dishes — chicken rice, laksa, and local favourites.',
    },
    {
        'username': 'craft_by_lydia',
        'email': 'lydia@crafts.sg',
        'password': 'Seeding123!',
        'description': 'Handmade watercolour art, craft kits, and stationery. Based in Tiong Bahru.',
    },
    {
        'username': 'techgadgets_sg',
        'email': 'hello@techgadgets.sg',
        'password': 'Seeding123!',
        'description': 'Curated tech accessories and gadgets at affordable prices.',
    },
    {
        'username': 'belle_boutique',
        'email': 'belle@boutique.sg',
        'password': 'Seeding123!',
        'description': 'Trendy women\'s clothing and accessories. Fast fashion done sustainably.',
    },
    {
        'username': 'green_thumb',
        'email': 'plants@greenthumb.sg',
        'password': 'Seeding123!',
        'description': 'Succulents, herbs, and indoor plants for your home or office.',
    },
]


def run():
    created_count = 0

    for data in ORGANIZATIONS:
        user, created = User.objects.get_or_create(
            username=data['username'],
            defaults={
                'email': data['email'],
                'role': 'organization',
                'description': data['description'],
            }
        )
        if created:
            user.set_password(data['password'])
            user.save()
            created_count += 1
            print(f"  Created org: {user.username}")
        else:
            print(f"  Skipped (exists): {user.username}")

    for data in VENDORS:
        user, created = User.objects.get_or_create(
            username=data['username'],
            defaults={
                'email': data['email'],
                'role': 'vendor',
                'description': data['description'],
            }
        )
        if created:
            user.set_password(data['password'])
            user.save()
            created_count += 1
            print(f"  Created vendor: {user.username}")
        else:
            print(f"  Skipped (exists): {user.username}")

    print(f"  → {created_count} users created.")


if __name__ == '__main__':
    run()
