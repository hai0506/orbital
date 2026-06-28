"""
Master seed script — runs all individual seed scripts in dependency order.

Usage:
    python seed_all.py            # seed everything (skips existing objects)
    python seed_all.py --clear    # wipe all seeded data first, then re-seed

The --clear flag deletes data in reverse dependency order to respect FK constraints.
"""

import sys
import _setup  # noqa: F401  (configures Django before any model imports)

import seed_users
import seed_categories
import seed_job_posts
import seed_job_offers
import seed_fundraisers
import seed_products
import seed_transactions
import seed_messages
import seed_reviews


STEPS = [
    ('Users',           seed_users),
    ('Categories',      seed_categories),
    ('Job Posts',       seed_job_posts),
    ('Job Offers',      seed_job_offers),
    ('Fundraisers',     seed_fundraisers),
    ('Products',        seed_products),
    ('Transactions',    seed_transactions),
    ('Messages',        seed_messages),
    ('Reviews',         seed_reviews),
]


def clear_all():
    from fundraisers.models import Review, TransactionItem, Transaction, Product, VendorFundraiser, Fundraiser
    from offers.models import JobOffer
    from listings.models import JobPost
    from chat.models import Message
    from django.contrib.auth import get_user_model
    User = get_user_model()

    print("Clearing existing data (reverse dependency order)...")
    Review.objects.all().delete()
    TransactionItem.objects.all().delete()
    Transaction.objects.all().delete()
    Product.objects.all().delete()
    VendorFundraiser.objects.all().delete()
    Fundraiser.objects.all().delete()
    JobOffer.objects.all().delete()
    JobPost.objects.all().delete()
    Message.objects.all().delete()
    # Only delete non-superuser accounts created by seed scripts
    User.objects.filter(is_superuser=False).delete()
    print("  Done.\n")


def main():
    if '--clear' in sys.argv:
        clear_all()

    for label, module in STEPS:
        print(f"[{label}]")
        module.run()
        print()

    print("Seeding complete.")


if __name__ == '__main__':
    main()
