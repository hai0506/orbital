import _setup  # noqa: F401
from core.models import User, Message

# (sender_username, receiver_username, content)
CONVERSATIONS = [
    # mamas_kitchen ↔ nus_bizclub (about the fair)
    ('nus_bizclub',    'mamas_kitchen', 'Hi! Thanks for applying to our Environment Fair. Do you have experience with eco-friendly packaging?'),
    ('mamas_kitchen',  'nus_bizclub',   'Yes! We\'ve been using biodegradable containers for the past year. Happy to share photos if needed.'),
    ('nus_bizclub',    'mamas_kitchen', 'That\'s great. We\'ve approved your offer. Looking forward to seeing you there!'),
    ('mamas_kitchen',  'nus_bizclub',   'Thank you! Will arrive by 8am to set up. Any specific booth size we should expect?'),
    ('nus_bizclub',    'mamas_kitchen', '3m x 2m per booth. We\'ll send a full briefing pack by next week.'),

    # craft_by_lydia ↔ nus_bizclub
    ('craft_by_lydia', 'nus_bizclub',   'Hi, I\'m Lydia! Quick question — is there access to power outlets at the booth?'),
    ('nus_bizclub',    'craft_by_lydia','Yes, each booth has a 13A power point. Extension cords allowed.'),
    ('craft_by_lydia', 'nus_bizclub',   'Perfect, I\'ll bring a few for my glue guns. See you there!'),

    # belle_boutique ↔ sg_charity_fund
    ('sg_charity_fund','belle_boutique','Welcome to the Charity Bazaar! Will you be able to set up a fitting station?'),
    ('belle_boutique', 'sg_charity_fund','We\'ll bring a portable mirror. Full fitting room not possible but we can manage!'),
    ('sg_charity_fund','belle_boutique','Sounds good. Thank you for the extra 5% pledge — it means a lot to us.'),
    ('belle_boutique', 'sg_charity_fund','Happy to help! Let us know if there\'s anything else we can do.'),

    # green_thumb ↔ sg_charity_fund
    ('green_thumb',   'sg_charity_fund','Hello! Should we bring our own tables, or will those be provided?'),
    ('sg_charity_fund','green_thumb',   'Tables and chairs are provided. You just need to bring your display materials.'),
    ('green_thumb',   'sg_charity_fund','Wonderful. We\'ll bring some signage and plant stands too.'),

    # mamas_kitchen ↔ greenwave_sg
    ('greenwave_sg',  'mamas_kitchen',  'Hey! Super excited to have you at GreenWave. Just confirming — 100% compostable packaging?'),
    ('mamas_kitchen', 'greenwave_sg',   'Yes, absolutely. We use sugarcane-based boxes and paper straws only.'),
    ('greenwave_sg',  'mamas_kitchen',  'Brilliant. You\'re going to be a crowd favourite! 😊'),

    # green_thumb ↔ greenwave_sg
    ('green_thumb',   'greenwave_sg',   'Can we bring a banner at the back of our booth?'),
    ('greenwave_sg',  'green_thumb',    'Yes, up to 2m high. Please ensure it\'s printed on recycled material if possible.'),

    # techgadgets_sg ↔ esplanade_events (about the expo)
    ('techgadgets_sg','esplanade_events','Hi, we just confirmed our spot at the Tech Expo. What load-in time works for you?'),
    ('esplanade_events','techgadgets_sg','Load-in starts at 7am. Expo opens at 10am. Please be ready by 9:30am.'),
    ('techgadgets_sg','esplanade_events','Got it. We\'ll need a 5-amp circuit for demo devices. Is that fine?'),
    ('esplanade_events','techgadgets_sg','All booths have 13A sockets. You\'re covered. See you at the Expo!'),

    # craft_by_lydia ↔ sg_charity_fund (about Art Showcase)
    ('craft_by_lydia','sg_charity_fund','Very excited about the Art & Culture Showcase. Can I run a 30-minute demo session?'),
    ('sg_charity_fund','craft_by_lydia','Yes! We actually encourage that. Just register the time slot with us beforehand.'),
]


def run():
    created_count = 0
    for sender_uname, receiver_uname, content in CONVERSATIONS:
        try:
            sender = User.objects.get(username=sender_uname)
            receiver = User.objects.get(username=receiver_uname)
        except User.DoesNotExist:
            print(f"  Skipped (user not found): {sender_uname} → {receiver_uname}")
            continue

        if Message.objects.filter(sender=sender, receiver=receiver, content=content).exists():
            print(f"  Skipped (exists): {sender_uname} → {receiver_uname}")
            continue

        Message.objects.create(sender=sender, receiver=receiver, content=content, read=True)
        created_count += 1

    print(f"  → {created_count} messages created.")


if __name__ == '__main__':
    run()
