"""
Seed the database with sample providers, packages, users and bookings.
Run: python seed.py
"""
import json
from datetime import datetime, timedelta
from src.core.database import SessionLocal, engine
from src.models import domain as models
from src.utils.security import hash_password

models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed():
    # Clear existing data
    db.query(models.Review).delete()
    db.query(models.Booking).delete()
    db.query(models.Package).delete()
    db.query(models.Facility).delete()
    db.query(models.Media).delete()
    db.query(models.Provider).delete()
    db.query(models.User).delete()
    db.commit()

    # ── Users ─────────────────────────────────────────────────
    rhea = models.User(email="rhea@example.com", name="Rhea Kapoor",
                       hashed_password=hash_password("password123"), role=models.UserRole.customer)
    arjun = models.User(email="arjun@example.com", name="Arjun Mehta",
                        hashed_password=hash_password("password123"), role=models.UserRole.customer)

    # Provider users
    echo_user = models.User(email="midnight@echo.com", name="Midnight Echo",
                            hashed_password=hash_password("password123"), role=models.UserRole.provider)
    aanya_user = models.User(email="aanya@rao.com", name="Aanya Rao",
                             hashed_password=hash_password("password123"), role=models.UserRole.provider)
    atrium_user = models.User(email="atrium@grand.com", name="The Grand Atrium",
                              hashed_password=hash_password("password123"), role=models.UserRole.provider)
    vyre_user = models.User(email="dj@vyre.com", name="DJ Vyre",
                            hashed_password=hash_password("password123"), role=models.UserRole.provider)
    skyline_user = models.User(email="skyline@terrace.com", name="Skyline Terrace",
                               hashed_password=hash_password("password123"), role=models.UserRole.provider)
    aurora_user = models.User(email="aurora@strings.com", name="Aurora Strings",
                              hashed_password=hash_password("password123"), role=models.UserRole.provider)

    for u in [rhea, arjun, echo_user, aanya_user, atrium_user, vyre_user, skyline_user, aurora_user]:
        db.add(u)
    db.commit()

    # ── Providers ─────────────────────────────────────────────
    providers_data = [
        dict(user_id=echo_user.id, slug="midnight-echo", name="Midnight Echo",
             category=models.ProviderCategory.live_band, city="Bengaluru",
             tagline="Six-piece rock & funk collective built for peak-hour crowds.",
             bio="Midnight Echo has headlined 400+ weddings, corporate nights and festival stages across India. Full production, in-house sound engineer and a setlist tailored to your crowd.",
             rating=4.9, review_count=128, verified=True,
             cover_image="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800"),
        dict(user_id=aanya_user.id, slug="aanya-rao", name="Aanya Rao",
             category=models.ProviderCategory.solo_artist, city="Mumbai",
             tagline="Soulful vocalist for intimate rooms and golden-hour ceremonies.",
             bio="Aanya Rao brings warmth and storytelling to every stage. Trained in Hindustani classical and contemporary pop, she crafts a personalised set for your event.",
             rating=4.8, review_count=96, verified=True,
             cover_image="https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800"),
        dict(user_id=atrium_user.id, slug="the-grand-atrium", name="The Grand Atrium",
             category=models.ProviderCategory.venue, city="Delhi NCR",
             tagline="Chandelier ballroom seating 600 with in-house catering.",
             bio="The Grand Atrium is Delhi's most sought-after event space. With seven versatile halls, award-winning catering and full AV, we handle every detail so you don't have to.",
             rating=4.7, review_count=212, verified=True,
             cover_image="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800"),
        dict(user_id=vyre_user.id, slug="dj-vyre", name="DJ Vyre",
             category=models.ProviderCategory.dj, city="Goa",
             tagline="Techno-leaning open format sets with CDJ-3000 rig.",
             bio="DJ Vyre has played the biggest beach clubs and rooftop parties in Goa. Expect precision mixing, a deep crate of records, and peak-hour energy that keeps floors packed all night.",
             rating=4.9, review_count=174, verified=True,
             cover_image="https://images.unsplash.com/photo-1571266028243-d220c6a7c0d0?w=800"),
        dict(user_id=skyline_user.id, slug="skyline-terrace", name="Skyline Terrace",
             category=models.ProviderCategory.venue, city="Hyderabad",
             tagline="Open-air rooftop with skyline views for 250 guests.",
             bio="Perched 18 floors above the city, Skyline Terrace offers unobstructed panoramic views, modular seating layouts and a dedicated event coordination team.",
             rating=4.6, review_count=88, verified=True,
             cover_image="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800"),
        dict(user_id=aurora_user.id, slug="aurora-strings", name="Aurora Strings",
             category=models.ProviderCategory.live_band, city="Chennai",
             tagline="Classical quartet for ceremonies, dinners and galas.",
             bio="Aurora Strings is a four-piece string ensemble with over a decade of experience performing at luxury weddings, corporate galas and cultural concerts across South India.",
             rating=4.8, review_count=64, verified=True,
             cover_image="https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800"),
    ]

    providers = []
    for pd in providers_data:
        p = models.Provider(**pd)
        db.add(p)
        providers.append(p)
    db.commit()

    midnight_echo, aanya, atrium, vyre, skyline, aurora = providers

    # ── Packages ─────────────────────────────────────────────
    packages_data = [
        # Midnight Echo
        (midnight_echo.id, "Basic Gig", "90 minutes", 50000, ["4-piece line-up", "Own instruments", "Basic PA"]),
        (midnight_echo.id, "Headline Night", "3 hours + soundcheck", 125000, ["6-piece line-up", "Full production", "Sound engineer", "Custom setlist"]),
        # Aanya Rao
        (aanya.id, "Acoustic Set", "60 minutes", 35000, ["Solo performance", "Acoustic guitar", "Personal PA"]),
        (aanya.id, "Full Performance", "2 hours", 65000, ["Band backing", "Stage lighting", "Custom set list"]),
        # The Grand Atrium
        (atrium.id, "Half Day Rental", "5 hours", 100000, ["Up to 300 guests", "Basic AV", "Parking"]),
        (atrium.id, "Full Day Rental", "12 hours", 100000, ["Up to 600 guests", "Full AV", "In-house catering", "Decor team", "Parking"]),
        # DJ Vyre
        (vyre.id, "Club Set", "3 hours", 45000, ["CDJ-3000 rig", "Open format", "Fog machine"]),
        (vyre.id, "Festival Set", "5 hours", 90000, ["Full DJ rig", "Custom lighting", "MC services", "Rider included"]),
        # Skyline Terrace
        (skyline.id, "Sunset Party", "4 hours", 75000, ["Up to 150 guests", "Basic décor", "Bar setup"]),
        (skyline.id, "Night Gala", "8 hours", 150000, ["Up to 250 guests", "Premium décor", "Open bar", "AV system"]),
        # Aurora Strings
        (aurora.id, "Ceremony Set", "45 minutes", 40000, ["4-piece quartet", "Classical repertoire", "Amplification"]),
        (aurora.id, "Dinner Concert", "2.5 hours", 80000, ["4-piece quartet", "Mixed repertoire", "Custom requests", "Interval"]),
    ]

    pkg_objs = []
    for (pid, name, dur, price, features) in packages_data:
        p = models.Package(provider_id=pid, name=name, duration=dur, price=price,
                           features=json.dumps(features))
        db.add(p)
        pkg_objs.append(p)
    db.commit()

    # ── Bookings ─────────────────────────────────────────────
    now = datetime.utcnow()
    bookings_data = [
        dict(booking_ref="EH-2481", customer_id=rhea.id, provider_id=midnight_echo.id,
             package_id=pkg_objs[1].id, event_date=now + timedelta(days=24),
             status=models.BookingStatus.confirmed, total_amount=125000,
             advance_amount=31250, final_amount=93750),
        dict(booking_ref="EH-2477", customer_id=arjun.id, provider_id=atrium.id,
             package_id=pkg_objs[5].id, event_date=now + timedelta(days=10),
             status=models.BookingStatus.confirmed, total_amount=100000,
             advance_amount=25000, final_amount=75000),
        dict(booking_ref="EH-2465", customer_id=rhea.id, provider_id=aanya.id,
             package_id=pkg_objs[2].id, event_date=now - timedelta(days=35),
             status=models.BookingStatus.completed, total_amount=35000,
             advance_amount=8750, final_amount=26250),
        dict(booking_ref="EH-2450", customer_id=arjun.id, provider_id=vyre.id,
             package_id=pkg_objs[6].id, event_date=now - timedelta(days=77),
             status=models.BookingStatus.settled, total_amount=45000,
             advance_amount=11250, final_amount=33750),
    ]

    booking_objs = []
    for bd in bookings_data:
        b = models.Booking(**bd)
        db.add(b)
        booking_objs.append(b)
    db.commit()

    print("✅ Database seeded successfully!")
    print(f"   Users: {db.query(models.User).count()}")
    print(f"   Providers: {db.query(models.Provider).count()}")
    print(f"   Packages: {db.query(models.Package).count()}")
    print(f"   Bookings: {db.query(models.Booking).count()}")

    db.close()

if __name__ == "__main__":
    seed()
