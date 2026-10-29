<<<<<<< HEAD
# AmmaTravels — Full-Stack Automotive Rental & Event Logistics Platform

> **Brand:** AmmaTravels  
> **Tagline:** *"Every journey, a celebration"*  
> **Location Hub:** Bhanugudi Junction, Kakinada, Andhra Pradesh 533003, India  
> **Offerings:** (1) Self-Drive Car & Bike Rentals with 360° Virtual Inspection • (2) Turnkey Event Management Packages (Weddings, Corporate, Birthdays, Godavari Tours)  
> **Palette:** Deep Teal (`#0A3641`, `#0D5C75`), Saffron/Amber Accent (`#E58B24`, `#F59E0B`), Warm Off-White (`#FBF9F5`), Charcoal (`#1E2229`)  

---

## 1. Overview & Architecture

**AmmaTravels** is a complete, production-quality, responsive web application engineered for travelers, residents, and event hosts in Kakinada and the East Godavari region. It consists of two seamlessly integrated parts:

1. **Public User Panel:**
   - **Cinematic Parallax Hero:** Layered scenery (coastal mountains, river delta, winding road) with animated vehicles driving on scroll, dynamic day-to-night atmospheric sky gradient, kinetic headline reveal, and two 3D tilt interactive choice cards (*Rent a Car or Bike* vs *Plan Your Event*).
   - **Interactive 360° Vehicle Studio:** 36-frame rotational viewer with horizontal touch/mouse drag, continuous auto-rotation toggle, circular angle compass (0° Front, 90° Right, 180° Rear, 270° Left), zoom controls (80%–180%), photo gallery, and technical spec sheet.
   - **Multi-Filtered Fleet Catalogue:** Real-time search by brand/model, type toggle (Cars vs Bikes), transmission (Manual / Automatic), fuel (Petrol / Diesel / Electric), seating capacity (2 to 8 seats), price sorting, and live status badges (*Available*, *Booked*, *Maintenance*).
   - **Event Management Showcase:** 4 comprehensive packages (Weddings, Corporate Summits, Birthday Caravans, Godavari Pilgrimage/Tours) with guest capacities, price ranges, included logistics checklists, and WhatsApp links.
   - **Live Enquiry Status Tracker:** Public lookup by Reference ID (`AT-V-XXXX` / `AT-E-XXXX`) and 10-digit mobile phone number, displaying an interactive 4-step progress timeline (*Submitted* → *Contacted* → *Confirmed* → *Completed*).
   - **Validated Interest Modals:** Honeypot anti-spam protection, date sequence checks, pickup locations (Bhanugudi, Town Station, Port Station, Doorstep), and instant WhatsApp confirmation deep links.
   - **Supporting Brand Sections:** 3-step How It Works, authentic Kakinada customer testimonials, comprehensive FAQs, hub timings, Google Maps location, and footer.

2. **Secured Operations & Admin Portal (`/admin` or Navigation Trigger):**
   - **Role-Based Authentication:** Multi-tier access for `admin` (full fleet & event CRUD, financial revenue estimates) and `staff` (leads CRM and customer updates). Pre-configured 1-click demo logins.
   - **Executive Dashboard:** Live fleet counters, available vs booked tallies, revenue estimates, 7-day enquiry flow bar chart, and top requested vehicle rankings.
   - **7-Stage CRM Lead Pipeline:** Visual pipeline (`New` → `Contacted` → `Visit/Meeting Scheduled` → `Documents Verified` → `Confirmed` → `Completed` / `Rejected`), quick stage changers, slide-out customer inspection drawer, internal remarks, scheduled follow-up dates, and immutable action audit logs.
   - **One-Click CSV Export:** Generates clean RFC-compliant CSV reports with escaped strings for offline accounting and management review.
   - **Fleet & Event Manager:** Complete CRUD, daily/weekly rate configuration, security deposit settings, km limit rules, and instant availability toggles.

---

## 2. Technology Stack

- **Frontend:** React 18, Vite 6, TypeScript 5.7, Tailwind CSS 3.4, Framer Motion 11, Lucide React icons
- **Backend:** Node.js, Express 4.21, CORS, RESTful API
- **Database Architecture:** PostgreSQL / Supabase DDL schema (`server/schema.sql`) with dual-mode fallback local persistence (`src/lib/api.ts`) ensuring 100% zero-config reliability
- **Testing:** Vitest 3.0 test suite with 38 passing tests across 5 test suites
- **Compliance & UX:** WCAG AA accessible contrast, respects `prefers-reduced-motion`, mobile-first responsive layout, dark & light theme modes

---

## 3. Directory Layout

```
amma-travels/
├── server/
│   ├── index.js                  # Express REST API (vehicles, packages, interests, track, stats, logs)
│   ├── schema.sql                # PostgreSQL / Supabase production schema & RLS policies
│   ├── seed-data.js              # Comprehensive fleet & event package seed dataset
│   └── seed-data.d.ts            # TypeScript declarations
├── src/
│   ├── components/
│   │   ├── Preloader.tsx         # Rolling-wheel kinetic preloader (<1s)
│   │   ├── Navbar.tsx            # Sticky responsive nav, search trigger, theme toggle, admin link
│   │   ├── Hero.tsx              # Cinematic parallax scenery, day-night scroll, 3D tilt cards
│   │   ├── VehicleCatalogue.tsx  # Multi-filter cars & bikes search, 360 studio trigger
│   │   ├── Vehicle360Viewer.tsx  # 36-frame rotational visualizer, angle compass, specs
│   │   ├── EventPackages.tsx     # Weddings, corporate, birthday, tour package showcase
│   │   ├── EnquiryTracker.tsx    # Ref ID + Phone lookup with 4-step status timeline
│   │   ├── VehicleInterestModal.tsx # Booking form with honeypot spam protection & ref generator
│   │   ├── EventInterestModal.tsx   # Event planning quote request modal
│   │   ├── HowItWorks.tsx        # 3-step rental journey
│   │   ├── Testimonials.tsx      # Customer reviews from Kakinada & Godavari travelers
│   │   ├── FAQ.tsx               # Tariffs, deposits, licenses, outstation permits
│   │   ├── Contact.tsx           # Bhanugudi hub address, phone, timings, maps link
│   │   ├── Footer.tsx            # Wordmark, links, legal disclaimers, back to top
│   │   └── admin/
│   │       ├── AdminLoginModal.tsx   # Authentication modal with 1-click demo buttons
│   │       ├── AdminPortal.tsx       # Root container with tab navigation & CSV export
│   │       ├── AdminDashboard.tsx    # KPIs, revenue metrics, charts
│   │       ├── AdminLeadsCRM.tsx     # 7-stage CRM lead pipeline & drawer
│   │       ├── AdminFleetManager.tsx # Vehicle CRUD, pricing, availability toggles
│   │       └── AdminEventManager.tsx # Event package CRUD
│   ├── lib/
│   │   ├── api.ts                # Dual-mode API client (Express backend + LocalStorage fallback)
│   │   └── whatsapp.ts           # Contextual WhatsApp Click-to-Chat deep link generator
│   ├── types/
│   │   └── index.ts              # Strict TypeScript interfaces
│   ├── App.tsx                   # Master application orchestrator
│   ├── main.tsx                  # React DOM mount point
│   └── index.css                 # Design tokens, theme variables, rolling wheel animations
├── tests/
│   ├── platform.test.ts          # 360 degree math, tariffs, ref IDs, CRM stages, honeypot, CSV
│   ├── validation.test.ts        # WhatsApp phone sanitization & safe message utilities
│   ├── statemachine.test.ts      # Booking state machine transitions & guards
│   ├── pricing.test.ts           # Hourly/daily rates, insurance addons, deposit calculations
│   └── availability.test.ts      # Buffer intervals, double-booking prevention, maintenance
├── index.html                    # SEO tags, Plus Jakarta Sans & Inter fonts, SVG favicon
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 4. Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24.16.0)
- npm 9+

### Installation
```bash
# Clone and enter directory
cd "c:\amma travels"

# Install dependencies (already installed)
npm install
```

### Running the Application

1. **Start the Express Backend API (Port 5000):**
   ```bash
   npm run server
   ```
   *Console output:* `[AmmaTravels Server] Express API running on port 5000`

2. **Start the Vite Frontend Dev Server (Port 3000):**
   ```bash
   npm run dev
   ```
   *Open browser:* `http://localhost:3000` (automatically proxies `/api` requests to port 5000).

3. **Build for Production:**
   ```bash
   npm run build
   ```
   *Compiles TypeScript and bundles production assets into `dist/` with zero errors.*

---

## 5. Automated Test Suite

Run the full automated test suite using Vitest:
```bash
npx vitest run
```

### Verified Test Results (38/38 Passing):
- `tests/platform.test.ts` (11 tests): 360 frame rotation (0° to 350°), compass orientation labels, transparent multi-day tariffs, weekly package discounts, excess km calculations, reference ID formats (`AT-V` / `AT-E`), honeypot spam traps, CRM pipeline transitions, and CSV column escaping.
- `tests/validation.test.ts` (3 tests): WhatsApp click-to-chat sanitization, sensitive token leak prevention, booking support links.
- `tests/statemachine.test.ts` (9 tests): Lifecycle transitions (`Submitted` → `Review` → `Confirmed` → `Active` → `Completed`), terminal states, rejection notes.
- `tests/pricing.test.ts` (8 tests): Base rates, duration calculations, deposit snapshots, addons.
- `tests/availability.test.ts` (7 tests): Overlap detection, rental buffers, maintenance block exclusions.

---

## 6. Demo Accounts & Credentials

For fast review and demonstration in the Admin Portal:

| Role | Username | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | Full control: Fleet CRUD, Event Package CRUD, CRM Pipeline, CSV Export, Revenue KPIs |
| **Operations Staff** | `staff` | `staff123` | Operations desk: View & update CRM leads, assign follow-up dates, log remarks, export CSV |

*(1-click demo buttons are provided in the Admin Login modal for instant access).*
=======
# AmmaTravels
>>>>>>> ed06584876143d3d254a54f78e8d484dda4b869b
