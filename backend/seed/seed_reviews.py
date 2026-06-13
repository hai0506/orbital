import _setup  # noqa: F401
from core.models import VendorFundraiser, Review

# Reviews for concluded fundraisers only (both directions: org→vendor and vendor→org).
# Each entry: (vendor_username, post_title, list_of_reviews)
# Each review dict: {'reviewer': 'vendor'|'org', 'rating': 1-5, 'comment': str}

REVIEWS = {
    # ── NUS Environment Fair ─────────────────────────────────────────────────
    ('mamas_kitchen', 'NUS Environment Fair'): [
        {
            'reviewer': 'org',
            'rating': 5,
            'comment': "Mama's Kitchen was an absolute hit! Food was gone within the first two hours. "
                       "Super professional setup and zero mess left behind. Will invite them again without hesitation.",
        },
        {
            'reviewer': 'vendor',
            'rating': 4,
            'comment': "Great event, well-organised with clear communication beforehand. "
                       "The briefing pack was very helpful. Would have given 5 stars if load-in access started earlier.",
        },
    ],
    ('craft_by_lydia', 'NUS Environment Fair'): [
        {
            'reviewer': 'org',
            'rating': 5,
            'comment': "Lydia's craft booth drew a huge crowd! Her live demonstration was a bonus we didn't even plan for. "
                       "Very talented and approachable vendor — students loved the interactive element.",
        },
        {
            'reviewer': 'vendor',
            'rating': 5,
            'comment': "Loved the vibe of this fair. The student energy was amazing and foot traffic was very high. "
                       "Staff were friendly and responsive. Definitely worth joining again!",
        },
    ],

    # ── Charity Bazaar at Esplanade ───────────────────────────────────────────
    ('belle_boutique', 'Charity Bazaar at Esplanade'): [
        {
            'reviewer': 'org',
            'rating': 4,
            'comment': "Belle Boutique contributed generously and maintained a beautiful booth display. "
                       "The extra donation pledge was a wonderful surprise. Slight delay in setup but nothing major.",
        },
        {
            'reviewer': 'vendor',
            'rating': 5,
            'comment': "Organising team was incredibly supportive throughout. The cause resonated with our brand. "
                       "Venue at Esplanade was stunning. Our best charity event to date.",
        },
    ],
    ('green_thumb', 'Charity Bazaar at Esplanade'): [
        {
            'reviewer': 'org',
            'rating': 5,
            'comment': "Green Thumb was a standout at the bazaar. Their charity-themed plant bundles sold out fast! "
                       "Booth was beautifully arranged and they drew continuous crowds all day.",
        },
        {
            'reviewer': 'vendor',
            'rating': 4,
            'comment': "Great cause and great atmosphere. Would have appreciated slightly more booth space for our displays, "
                       "but overall a very positive experience. Happy to participate in future editions.",
        },
    ],
}


def run():
    created_count = 0

    for (vendor_username, post_title), reviews in REVIEWS.items():
        try:
            vf = VendorFundraiser.objects.select_related(
                'offer__vendor',
                'org_fundraiser__listing__author',
            ).get(
                offer__vendor__username=vendor_username,
                offer__listing__title=post_title,
            )
        except VendorFundraiser.DoesNotExist:
            print(f"  Skipped (no VendorFundraiser): {vendor_username} @ {post_title!r}")
            continue

        vendor_user = vf.offer.vendor
        org_user = vf.org_fundraiser.listing.author

        for r in reviews:
            if r['reviewer'] == 'vendor':
                reviewer = vendor_user
                reviewee = org_user
            else:
                reviewer = org_user
                reviewee = vendor_user

            if Review.objects.filter(vendor_fundraiser=vf, reviewer=reviewer).exists():
                print(f"  Skipped (review exists): {reviewer.username} → {reviewee.username} @ {post_title!r}")
                continue

            Review.objects.create(
                vendor_fundraiser=vf,
                reviewer=reviewer,
                reviewee=reviewee,
                rating=r['rating'],
                comment=r['comment'],
            )
            created_count += 1
            print(f"  Created review: {reviewer.username} → {reviewee.username} [{r['rating']}★]")

    print(f"  → {created_count} reviews created.")


if __name__ == '__main__':
    run()
