import _setup  # noqa: F401
from datetime import date, timedelta
from accounts.models import User
from listings.models import JobPost, Category
from offers.models import JobOffer

TODAY = date.today()


def _cats(*names):
    return list(Category.objects.filter(value__in=names))


# Each entry: (vendor_username, post_title, offer_data)
OFFERS = [
    # ── NUS Environment Fair (concluded) ─────────────────────────────────────
    (
        'mamas_kitchen',
        'NUS Environment Fair',
        {
            'allDays': True,
            'selectedDays': [],
            'commission': 22,
            'remarks': 'Will bring reusable packaging. Can cater up to 300 pax per day.',
            'status': 'confirmed',
            'categories': ['Food & Beverages'],
        },
    ),
    (
        'craft_by_lydia',
        'NUS Environment Fair',
        {
            'allDays': False,
            'selectedDays': [TODAY - timedelta(days=28)],
            'commission': 20,
            'remarks': 'Available day 1 only. Will bring full watercolour and craft kit range.',
            'status': 'confirmed',
            'categories': ['Art & Crafts'],
        },
    ),
    (
        'techgadgets_sg',
        'NUS Environment Fair',
        {
            'allDays': True,
            'selectedDays': [],
            'commission': 15,
            'remarks': 'Offering eco-themed tech accessories.',
            'status': 'rejected',
            'categories': ['Tech Gadgets', 'Accessories'],
        },
    ),

    # ── Charity Bazaar at Esplanade (concluded) ───────────────────────────────
    (
        'belle_boutique',
        'Charity Bazaar at Esplanade',
        {
            'allDays': True,
            'selectedDays': [],
            'commission': 28,
            'remarks': 'Will donate an extra 5% of profits to the cause.',
            'status': 'confirmed',
            'categories': ['Clothing', 'Accessories'],
        },
    ),
    (
        'green_thumb',
        'Charity Bazaar at Esplanade',
        {
            'allDays': True,
            'selectedDays': [],
            'commission': 25,
            'remarks': 'Charity-themed plant bundles with care guides.',
            'status': 'confirmed',
            'categories': ['Plants', 'Home Decor'],
        },
    ),
    (
        'mamas_kitchen',
        'Charity Bazaar at Esplanade',
        {
            'allDays': False,
            'selectedDays': [TODAY - timedelta(days=13)],
            'commission': 25,
            'remarks': '',
            'status': 'cancelled',
            'categories': ['Food & Beverages'],
        },
    ),

    # ── GreenWave Sustainability Market (ongoing) ─────────────────────────────
    (
        'mamas_kitchen',
        'GreenWave Sustainability Market',
        {
            'allDays': True,
            'selectedDays': [],
            'commission': 15,
            'remarks': 'Zero-waste food stall. All containers compostable.',
            'status': 'confirmed',
            'categories': ['Food & Beverages'],
        },
    ),
    (
        'green_thumb',
        'GreenWave Sustainability Market',
        {
            'allDays': True,
            'selectedDays': [],
            'commission': 15,
            'remarks': 'Sustainability workshops alongside plant sales.',
            'status': 'confirmed',
            'categories': ['Plants', 'Home Decor'],
        },
    ),
    (
        'craft_by_lydia',
        'GreenWave Sustainability Market',
        {
            'allDays': True,
            'selectedDays': [],
            'commission': 18,
            'remarks': 'Upcycled art and eco craft kits.',
            'status': 'approved',
            'categories': ['Art & Crafts'],
        },
    ),

    # ── Tech & Lifestyle Expo (upcoming) ─────────────────────────────────────
    (
        'techgadgets_sg',
        'Tech & Lifestyle Expo',
        {
            'allDays': True,
            'selectedDays': [],
            'commission': 32,
            'remarks': 'Will showcase our new wireless charging line.',
            'status': 'approved',
            'categories': ['Tech Gadgets', 'Accessories'],
        },
    ),
    (
        'belle_boutique',
        'Tech & Lifestyle Expo',
        {
            'allDays': False,
            'selectedDays': [TODAY + timedelta(days=22)],
            'commission': 28,
            'remarks': 'Unable to attend the last day due to another event.',
            'status': 'pending',
            'categories': ['Accessories'],
        },
    ),
    (
        'green_thumb',
        'Tech & Lifestyle Expo',
        {
            'allDays': True,
            'selectedDays': [],
            'commission': 30,
            'remarks': 'Desk plants and office greenery.',
            'status': 'pending',
            'categories': ['Plants'],
        },
    ),

    # ── Art & Culture Showcase (upcoming) ────────────────────────────────────
    (
        'craft_by_lydia',
        'Art & Culture Showcase',
        {
            'allDays': True,
            'selectedDays': [],
            'commission': 18,
            'remarks': 'Will run a live painting demo on day 1.',
            'status': 'pending',
            'categories': ['Art & Crafts', 'Stationery'],
        },
    ),
    (
        'mamas_kitchen',
        'Art & Culture Showcase',
        {
            'allDays': True,
            'selectedDays': [],
            'commission': 20,
            'remarks': 'Traditional local snacks to complement the cultural theme.',
            'status': 'pending',
            'categories': ['Food & Beverages'],
        },
    ),

    # ── NUS Grad Celebration Market (upcoming) ────────────────────────────────
    (
        'belle_boutique',
        'NUS Grad Celebration Market',
        {
            'allDays': True,
            'selectedDays': [],
            'commission': 22,
            'remarks': 'Grad merchandise and clothing.',
            'status': 'pending',
            'categories': ['Clothing', 'Accessories'],
        },
    ),
]


def run():
    created_count = 0
    for vendor_username, post_title, data in OFFERS:
        vendor = User.objects.get(username=vendor_username)
        post = JobPost.objects.get(title=post_title)

        # Skip if this vendor already has an offer for this post
        if JobOffer.objects.filter(vendor=vendor, listing=post).exists():
            print(f"  Skipped (exists): {vendor_username} → {post_title!r}")
            continue

        offer = JobOffer.objects.create(
            vendor=vendor,
            listing=post,
            allDays=data['allDays'],
            selectedDays=data['selectedDays'],
            commission=data['commission'],
            remarks=data['remarks'],
            status=data['status'],
        )
        offer.selectedCategories.set(_cats(*data['categories']))
        created_count += 1
        print(f"  Created offer: {vendor_username} → {post_title!r} [{data['status']}]")

    print(f"  → {created_count} job offers created.")


if __name__ == '__main__':
    run()
