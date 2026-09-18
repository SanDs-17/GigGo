# GigGo — Full-Stack Clone

India's premium entertainment marketplace. Connects customers with verified artists, bands, DJs and venues using milestone-protected payments.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router, TypeScript, Tailwind) |
| **Backend** | FastAPI (Python 3.11+) |
| **Database** | PostgreSQL 16 |
| **Dev DB** | Docker Compose |

---

## Project Structure

```
Gigly/
├── frontend/          # Next.js 14 app
├── backend/           # FastAPI app
└── docker-compose.yml # PostgreSQL + pgAdmin
```

---

## Quick Start

### 1. Start PostgreSQL (Docker required)

```bash
docker-compose up -d
```

PostgreSQL → `localhost:5432`  
pgAdmin → `http://localhost:5050` (admin@giggo.com / admin123)

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Seed the database with sample data
python seed.py

# Start the API server
uvicorn main:app --reload --port 8000
```

API docs → `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies (already done)
npm install

# Start dev server
npm run dev
```

App → `http://localhost:3000`

---

## Pages

| Route | Description |
|---|---|
| `/` | Home / Landing page |
| `/marketplace` | Browse providers with filters |
| `/provider/[slug]` | Provider profile + booking |
| `/auth` | Sign in / Sign up |
| `/onboarding/role` | Choose role (Customer/Provider) |
| `/onboarding/provider-setup` | Provider registration |
| `/dashboard` | Customer bookings |
| `/dashboard/payments` | Pending payments |
| `/dashboard/reviews` | My reviews |
| `/dashboard/settings` | Account settings |
| `/bookings/[ref]` | Booking detail |
| `/studio` | Provider studio overview |
| `/studio/profile` | Edit provider profile |
| `/studio/bookings` | Manage bookings & requests |
| `/studio/packages` | Packages & pricing |
| `/studio/media` | Media gallery |
| `/studio/facilities` | Facilities management |
| `/studio/settings` | Studio settings |

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Customer | rhea@example.com | password123 |
| Customer | arjun@example.com | password123 |
| Provider (Live Band) | midnight@echo.com | password123 |
| Provider (Solo Artist) | aanya@rao.com | password123 |
| Provider (Venue) | atrium@grand.com | password123 |

---

## API Endpoints

```
POST /api/auth/register     — Register
POST /api/auth/login        — Login
GET  /api/auth/me           — Current user

GET  /api/providers         — List (with filters: category, max_price, min_rating, city)
GET  /api/providers/featured — Top-rated providers
GET  /api/providers/{slug}  — Single provider

POST /api/bookings          — Create booking
GET  /api/bookings          — My bookings
GET  /api/bookings/{ref}    — Booking detail
PUT  /api/bookings/{ref}/status — Update status

POST /api/reviews           — Submit review
GET  /api/providers/{slug}/reviews — Provider reviews

GET  /api/studio/overview   — Provider stats
GET  /api/studio/bookings   — Provider bookings
GET  /api/studio/activity   — Recent activity
```

---

## Milestone Payment System

- Customer pays **25% advance** when booking is confirmed
- Remaining **75% is released** only after the event is marked complete
- No surprises — both parties protected throughout
