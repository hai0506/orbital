# Seed Scripts

Populates the database with realistic sample data for local development.

## Running the scripts

All scripts must be run from **inside** the `backend/seed/` directory so that `_setup.py` is importable.

```bash
cd backend/seed
```

### Seed everything (idempotent)

```bash
python seed_all.py
```

Re-running is safe — each script uses `get_or_create` / existence checks and skips objects that already exist.

### Wipe and re-seed from scratch

```bash
python seed_all.py --clear
```

Deletes all non-superuser accounts and all seeded objects in reverse FK order, then re-seeds.

### Run a single script

```bash
python seed_users.py
python seed_categories.py
# etc.
```

Each script can be run individually in the order listed below.

---

## Dependency order

| # | Script | Model(s) | Depends on |
|---|--------|----------|------------|
| 1 | `seed_users.py` | `User` | — |
| 2 | `seed_categories.py` | `Category` | — |
| 3 | `seed_job_posts.py` | `JobPost` | Users (org), Categories |
| 4 | `seed_job_offers.py` | `JobOffer` | Users (vendor), JobPosts, Categories |
| 5 | `seed_fundraisers.py` | `Fundraiser`, `VendorFundraiser` | JobOffers (confirmed) |
| 6 | `seed_products.py` | `Product` | VendorFundraisers |
| 7 | `seed_transactions.py` | `Transaction`, `TransactionItem` | Products, VendorFundraisers |
| 8 | `seed_messages.py` | `Message` | Users |
| 9 | `seed_reviews.py` | `Review` | VendorFundraisers (concluded events) |

---

## What gets created

### Users (`seed_users.py`)
All passwords are `Seeding123!`.

| Username | Role | Description |
|----------|------|-------------|
| `nus_bizclub` | Organization | NUS Business Club |
| `sg_charity_fund` | Organization | Singapore Charity Fund |
| `greenwave_sg` | Organization | GreenWave Sustainability Network |
| `esplanade_events` | Organization | Esplanade Events |
| `mamas_kitchen` | Vendor | Hawker food stall |
| `craft_by_lydia` | Vendor | Handmade crafts & art |
| `belle_boutique` | Vendor | Fashion boutique |
| `green_thumb` | Vendor | Indoor plants & gardening |
| `techgadgets_sg` | Vendor | Consumer tech accessories |

### Job Posts (`seed_job_posts.py`)

| Title | Organiser | Dates | Status |
|-------|-----------|-------|--------|
| NUS Environment Fair | nus_bizclub | ~30 days ago | Concluded |
| Charity Bazaar at Esplanade | sg_charity_fund | ~14 days ago | Concluded |
| GreenWave Sustainability Market | greenwave_sg | Yesterday → +6 days | **Ongoing** |
| Tech & Lifestyle Expo | esplanade_events | +20 → +22 days | Upcoming |
| Art & Culture Showcase | sg_charity_fund | +35 → +36 days | Upcoming |
| NUS Grad Celebration Market | nus_bizclub | +50 days | Upcoming |

### Job Offers (`seed_job_offers.py`)
15 offers across 6 posts with varied statuses: `confirmed`, `rejected`, `cancelled`, `approved`, `pending`.

### Fundraisers (`seed_fundraisers.py`)
One `Fundraiser` per confirmed job post. `VendorFundraiser` rows for each confirmed offer.

Active fundraisers (with vendor fundraisers):
- NUS Environment Fair — `mamas_kitchen`, `craft_by_lydia`
- Charity Bazaar at Esplanade — `belle_boutique`, `green_thumb`
- GreenWave Sustainability Market — `mamas_kitchen`, `green_thumb`

### Products (`seed_products.py`)
Product inventory for each `VendorFundraiser` in concluded/ongoing events. Quantities are decremented by the transaction script.

### Transactions (`seed_transactions.py`)
Purchase records for concluded events (NUS Environment Fair, Charity Bazaar) and partial sales for the ongoing GreenWave Market. Each transaction has buyer details and one or more `TransactionItem` rows.

### Messages (`seed_messages.py`)
25 direct messages across 8 user pairs, simulating vendor–organiser coordination chats (booth setup, load-in times, logistics questions).

### Reviews (`seed_reviews.py`)
Bidirectional reviews (org→vendor and vendor→org) for both concluded events. Ratings range from 4–5 stars with detailed comments.
