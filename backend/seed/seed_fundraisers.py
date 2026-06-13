import _setup  # noqa: F401
from core.models import JobOffer, Fundraiser, VendorFundraiser


def run():
    confirmed_offers = JobOffer.objects.filter(status='confirmed').select_related('listing')
    created_f = 0
    created_vf = 0

    for offer in confirmed_offers:
        fundraiser, f_created = Fundraiser.objects.get_or_create(listing=offer.listing)
        if f_created:
            fundraiser.refresh_status()
            created_f += 1
            print(f"  Created fundraiser: {offer.listing.title!r}")

        _, vf_created = VendorFundraiser.objects.get_or_create(
            offer=offer,
            defaults={'org_fundraiser': fundraiser},
        )
        if vf_created:
            created_vf += 1
            print(f"    └─ VendorFundraiser: {offer.vendor.username}")
        else:
            print(f"    └─ Skipped VendorFundraiser (exists): {offer.vendor.username}")

    print(f"  → {created_f} fundraisers, {created_vf} vendor fundraisers created.")


if __name__ == '__main__':
    run()
