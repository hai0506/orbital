import _setup  # noqa: F401
from datetime import date, time, timedelta
from core.models import User, JobPost, Category

# Reference point: today
TODAY = date.today()


def _cats(*names):
    return list(Category.objects.filter(value__in=names))


POSTS = [
    # ── Concluded (past) ─────────────────────────────────────────────────────
    {
        'author': 'nus_bizclub',
        'title': 'NUS Environment Fair',
        'location': 'NUS University Cultural Centre, Kent Ridge Drive',
        'start_date': TODAY - timedelta(days=30),
        'end_date':   TODAY - timedelta(days=28),
        'start_time': time(9, 0),
        'end_time':   time(18, 0),
        'commission': 20,
        'remarks': 'Annual sustainability fair. Vendors must use eco-friendly packaging.',
        'categories': ['Food & Beverages', 'Art & Crafts', 'Plants'],
        'is_closed': True,
    },
    {
        'author': 'sg_charity_fund',
        'title': 'Charity Bazaar at Esplanade',
        'location': 'Esplanade Outdoor Theatre, Marina Bay',
        'start_date': TODAY - timedelta(days=14),
        'end_date':   TODAY - timedelta(days=13),
        'start_time': time(10, 0),
        'end_time':   time(21, 0),
        'commission': 25,
        'remarks': 'All proceeds go to the Children\'s Cancer Foundation. High foot traffic expected.',
        'categories': ['Food & Beverages', 'Clothing', 'Accessories', 'Home Decor'],
        'is_closed': True,
    },
    # ── Ongoing ──────────────────────────────────────────────────────────────
    {
        'author': 'greenwave_sg',
        'title': 'GreenWave Sustainability Market',
        'location': 'Gardens by the Bay, Supertree Grove',
        'start_date': TODAY - timedelta(days=1),
        'end_date':   TODAY + timedelta(days=1),
        'start_time': time(10, 0),
        'end_time':   time(20, 0),
        'commission': 15,
        'remarks': 'Eco-focused market. Plastic-free zone. Bring your own bags.',
        'categories': ['Plants', 'Skincare & Beauty', 'Home Decor'],
        'is_closed': False,
    },
    # ── Upcoming ─────────────────────────────────────────────────────────────
    {
        'author': 'esplanade_events',
        'title': 'Tech & Lifestyle Expo',
        'location': 'Singapore Expo Hall 4, Changi',
        'start_date': TODAY + timedelta(days=20),
        'end_date':   TODAY + timedelta(days=22),
        'start_time': time(10, 0),
        'end_time':   time(19, 0),
        'commission': 30,
        'remarks': 'Showcase of the latest tech gadgets and lifestyle products. Expected 5,000 visitors.',
        'categories': ['Tech Gadgets', 'Accessories', 'Stationery'],
        'is_closed': False,
    },
    {
        'author': 'sg_charity_fund',
        'title': 'Art & Culture Showcase',
        'location': 'National Library Building, Victoria Street',
        'start_date': TODAY + timedelta(days=35),
        'end_date':   TODAY + timedelta(days=36),
        'start_time': time(11, 0),
        'end_time':   time(19, 0),
        'commission': 18,
        'remarks': 'Celebrating local artists and artisans. Family-friendly event.',
        'categories': ['Art & Crafts', 'Books', 'Stationery'],
        'is_closed': False,
    },
    {
        'author': 'nus_bizclub',
        'title': 'NUS Grad Celebration Market',
        'location': 'NUS Shaw Foundation Alumni House',
        'start_date': TODAY + timedelta(days=60),
        'end_date':   TODAY + timedelta(days=60),
        'start_time': time(14, 0),
        'end_time':   time(22, 0),
        'commission': 22,
        'remarks': 'Annual graduation celebration. Vendors catering to students and families.',
        'categories': ['Food & Beverages', 'Clothing', 'Accessories'],
        'is_closed': False,
    },
]


def run():
    created_count = 0
    for data in POSTS:
        author = User.objects.get(username=data['author'])
        post, created = JobPost.objects.get_or_create(
            title=data['title'],
            author=author,
            defaults={
                'location': data['location'],
                'start_date': data['start_date'],
                'end_date': data['end_date'],
                'start_time': data['start_time'],
                'end_time': data['end_time'],
                'commission': data['commission'],
                'remarks': data['remarks'],
                'is_closed': data['is_closed'],
            }
        )
        if created:
            post.categories.set(_cats(*data['categories']))
            created_count += 1
            print(f"  Created post: {post.title!r} by {author.username}")
        else:
            print(f"  Skipped (exists): {post.title!r}")
    print(f"  → {created_count} job posts created.")


if __name__ == '__main__':
    run()
