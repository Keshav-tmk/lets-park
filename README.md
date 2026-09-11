# 🅿️ ParkWise AI — Intelligent Urban Parking Discovery Platform

> **Find smarter parking in Bangalore** — AI-scored spots ranked by legality, safety, shade, accessibility, and cost. Real-time maps, satellite view, interactive charts, and community-powered reporting.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Live Features](#live-features)
- [Architecture](#architecture)
- [Tech Stack (Detailed)](#tech-stack-detailed)
- [Project Structure](#project-structure)
- [AI Scoring Engine](#ai-scoring-engine)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

---

## Overview

ParkWise AI is a full-stack urban parking intelligence platform built for Bangalore. It combines a **custom multi-factor AI scoring engine** with real-time geocoding, an interactive map, satellite imagery, dynamic data visualizations, and a community-driven report system — all wrapped in a premium dark-themed, glassmorphism UI.

The platform operates in two modes:
- **Live Mode** — connects to a Node.js/Express + MongoDB backend for real data
- **Offline Mode** — gracefully falls back to 25 curated mock parking spots around MG Road

---

## Live Features

### 🗺️ Interactive 3-Panel Layout
- **Left Panel** — Smart search with geocoding autocomplete, user preferences (duration, walk distance, shade priority, free-only filter), and ranked parking results
- **Center Panel** — Dark-themed Leaflet map (CARTO dark tiles) with color-coded risk markers, walking radius circles, destination pin, and **click-to-set-destination**
- **Right Panel** — Animated detail panel that slides in on spot selection

### 🔍 Smart Search & Geocoding
- Debounced live search via **OpenStreetMap Nominatim API** (forward geocoding)
- Reverse geocoding on map click — automatically fills the search bar
- 20 pre-loaded popular Bangalore destinations (MG Road, Brigade Road, Koramangala, Whitefield, etc.)
- `useGeocoding` custom hook with 350ms debounce and India-specific filtering (`countrycodes=in`)

### 🤖 AI Scoring Engine
- Custom weighted multi-factor ranking algorithm (legality 30%, safety 20%, shade 20%, accessibility 20%, cost 10%)
- Haversine distance formula for accurate walking distance computation
- Time-aware shade scoring — shade matters more between 10 AM–4 PM
- Report-adjusted safety scoring — theft/fine reports dynamically reduce scores
- Fine risk computation based on legality score, road proximity, and community reports
- Returns top 10 spots sorted by composite `finalScore`

### 📊 Data Visualizations (Recharts)
- **Radar Chart** — 4-axis score breakdown (Legal / Safety / Shade / Access)
- **Bar Chart** — Current spot vs. top 5 competitors comparison
- **Donut Pie Chart** — Real-time occupancy (occupied vs. available slots)
- **Progress Bar** — Occupancy percentage with color-coded thresholds

### 🛰️ Satellite & Street View
- **Google Maps satellite embed** for each parking spot (iframe, zoom level 19)
- Deep links to **Google Maps Street View 360°**
- External link to Google Maps standard view

### 📰 Area Incidents & News Feed
- Dynamic incident cards generated from each spot's score profile
- Severity badges (High / Medium / Low) color-coded red/amber/green
- Horizontal scrollable card carousel with image thumbnails

### 🧠 AI Insights Panel
- Contextual advice per spot: lighting conditions, shade cover, occupancy warnings, road proximity, community report count

### 🔐 Authentication System
- JWT-based auth (signup / login / session persistence via `localStorage`)
- `AuthContext` React context with `useAuth` hook
- Auth-gated report submission

### 🚩 Community Report System
- Users can report spots as: **Safe** ✅ | **Fine** ⚠️ | **Theft** 🔴
- Reports persist in MongoDB and dynamically adjust AI safety scores
- Report submission triggers spot data re-fetch

### 📡 Backend / Offline Resilience
- Frontend tries to fetch spots from `/api/spots`
- On failure, automatically imports and uses mock data (zero-downtime fallback)
- Live/Offline status badge displayed in the UI header area

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vite + React + TS)          │
│                                                             │
│  ┌─────────────┐   ┌──────────────┐   ┌────────────────┐  │
│  │ SearchPanel  │   │  ParkingMap  │   │SpotDetailPanel │  │
│  │ (geocoding,  │   │  (Leaflet,   │   │ (Recharts,     │  │
│  │  prefs)      │   │   CARTO)     │   │  satellite,    │  │
│  └──────┬───────┘   └──────┬───────┘   │  insights)     │  │
│         │                  │           └────────────────┘  │
│         └──────────────────▼                               │
│                    scoringEngine.ts                         │
│              (Haversine + Weighted AI Rank)                  │
│                                                             │
│  useGeocoding ──► Nominatim OSM API                         │
│  AuthContext  ──► JWT localStorage                          │
│  api.ts       ──► Backend REST API                          │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST (JSON)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Express.js + Node.js)              │
│                                                             │
│  /api/auth  ──► bcryptjs + JWT                              │
│  /api/spots ──► CRUD for parking spots                      │
│  /api/reports ► Append reports, influence scoring           │
│                                                             │
│  Mongoose ODM ──► MongoDB Atlas / Local                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack (Detailed)

### 🎨 Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.3.1 | Core UI framework, component model |
| **TypeScript** | 5.8.3 | Type safety across entire frontend |
| **Vite** | 5.4.19 | Ultra-fast dev server & bundler (SWC compiler) |
| **React Router DOM** | 6.30.1 | Client-side routing (`/`, `*` 404) |
| **Framer Motion** | 12.38.0 | Entrance animations, `AnimatePresence`, spring transitions |
| **TailwindCSS** | 3.4.17 | Utility-first CSS, custom design tokens (neon colors, glassmorphism) |
| **tailwindcss-animate** | 1.0.7 | CSS keyframe animation utilities |

### 🗺️ Maps & Geocoding

| Technology | Version | Purpose |
|---|---|---|
| **Leaflet** | 1.9.4 | Core map library |
| **react-leaflet** | 4.2.1 | React bindings for Leaflet |
| **CARTO Dark Tiles** | CDN | Dark-themed base map tiles |
| **OpenStreetMap Nominatim** | REST API (free) | Forward & reverse geocoding |
| **Google Maps Embed** | iframe | Satellite & Street View per spot |

### 📊 Data Visualization

| Technology | Version | Purpose |
|---|---|---|
| **Recharts** | 2.15.4 | RadarChart, BarChart, PieChart, ResponsiveContainer |

### 🧩 UI Component System

| Technology | Version | Purpose |
|---|---|---|
| **Radix UI** | (multiple) | Headless accessible primitives (Dialog, Tabs, Select, Toast, etc.) |
| **shadcn/ui** | via components.json | Pre-built component library on top of Radix + Tailwind |
| **Lucide React** | 0.462.0 | Icon set (MapPin, Shield, TreePine, Flag, etc.) |
| **class-variance-authority** | 0.7.1 | Variant-based component styling |
| **clsx + tailwind-merge** | — | Conditional class merging |
| **cmdk** | 1.1.1 | Command palette component |
| **sonner** | 1.7.4 | Toast notifications |
| **vaul** | 0.9.9 | Drawer component |
| **embla-carousel-react** | 8.6.0 | Carousel component |

### 🔧 Forms & Validation

| Technology | Version | Purpose |
|---|---|---|
| **React Hook Form** | 7.61.1 | Form state management |
| **@hookform/resolvers** | 3.10.0 | Zod adapter for RHF |
| **Zod** | 3.25.76 | Schema validation |

### 🔄 State Management & Data Fetching

| Technology | Version | Purpose |
|---|---|---|
| **React Context API** | built-in | `AuthContext` for global auth state |
| **TanStack Query** | 5.83.0 | Server-state caching (available, used selectively) |
| **Custom Hooks** | — | `useGeocoding`, `useAuth`, `use-mobile`, `use-toast` |

### ⚙️ Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | ≥18 | JavaScript runtime |
| **Express.js** | 4.21.2 | REST API framework |
| **Mongoose** | 8.12.1 | MongoDB ODM, schema validation |
| **MongoDB** | (Atlas or local) | Database for spots, users, reports |
| **bcryptjs** | 3.0.2 | Password hashing |
| **jsonwebtoken** | 9.0.2 | JWT creation and verification |
| **cors** | 2.8.5 | Cross-Origin Resource Sharing |
| **dotenv** | 16.4.7 | Environment variable management |

### 🧪 Testing & Quality

| Technology | Version | Purpose |
|---|---|---|
| **Vitest** | 3.2.4 | Unit test runner (Vite-native) |
| **@testing-library/react** | 16.0.0 | Component testing utilities |
| **@testing-library/jest-dom** | 6.6.0 | DOM assertion matchers |
| **Playwright** | 1.57.0 | End-to-end browser testing |
| **ESLint** | 9.32.0 | Code linting |
| **typescript-eslint** | 8.38.0 | TypeScript-aware lint rules |

### 🛠️ Dev Tools & Build

| Technology | Version | Purpose |
|---|---|---|
| **@vitejs/plugin-react-swc** | 3.11.0 | SWC-based fast React compilation |
| **PostCSS** | 8.5.6 | CSS processing pipeline |
| **autoprefixer** | 10.4.21 | Vendor prefix injection |
| **Bun** | — | Alternative package manager (bun.lock present) |

---

## Project Structure

```
lets_park/
└── parkwise-ai/
    ├── src/
    │   ├── components/
    │   │   ├── ParkingMap.tsx        # Leaflet map, markers, walking radius
    │   │   ├── SearchPanel.tsx       # Search, geocoding, user prefs
    │   │   ├── SpotCard.tsx          # Parking spot list item
    │   │   ├── SpotDetailPanel.tsx   # Full analytics panel (Recharts, satellite)
    │   │   ├── Header.tsx            # App header with auth toggle
    │   │   ├── AuthModal.tsx         # Login / Signup modal
    │   │   ├── ReportModal.tsx       # Community report submission
    │   │   ├── NavLink.tsx           # Navigation link component
    │   │   └── ui/                   # shadcn/ui base components
    │   │
    │   ├── contexts/
    │   │   └── AuthContext.tsx       # JWT auth state, login/logout
    │   │
    │   ├── data/
    │   │   └── parkingSpots.ts       # TypeScript interfaces + 25 mock spots
    │   │
    │   ├── engine/
    │   │   └── scoringEngine.ts      # AI ranking algorithm (Haversine + weights)
    │   │
    │   ├── hooks/
    │   │   ├── useGeocoding.ts       # Nominatim forward/reverse geocoding
    │   │   ├── use-mobile.tsx        # Responsive breakpoint detection
    │   │   └── use-toast.ts          # Toast notification hook
    │   │
    │   ├── pages/
    │   │   ├── Index.tsx             # Main app page (3-panel orchestrator)
    │   │   └── NotFound.tsx          # 404 page
    │   │
    │   ├── services/
    │   │   └── api.ts                # REST API client (auth, spots, reports)
    │   │
    │   ├── lib/
    │   │   └── utils.ts              # clsx/tailwind-merge utility
    │   │
    │   ├── App.tsx                   # Router setup
    │   ├── main.tsx                  # React DOM entry point
    │   └── index.css                 # Global CSS, glassmorphism, neon tokens
    │
    ├── server/
    │   ├── config/
    │   │   └── db.js                 # MongoDB connection via Mongoose
    │   ├── middleware/
    │   │   └── auth.js               # JWT verification middleware
    │   ├── models/
    │   │   ├── ParkingSpot.js        # Mongoose schema: spots
    │   │   ├── Report.js             # Mongoose schema: reports
    │   │   └── User.js               # Mongoose schema: users
    │   ├── routes/
    │   │   ├── auth.js               # POST /signup, POST /login, GET /me
    │   │   ├── spots.js              # GET /spots, POST /spots
    │   │   └── reports.js            # POST /reports
    │   ├── seed.js                   # Database seeder (25 Bangalore spots)
    │   └── server.js                 # Express app entry point
    │
    ├── public/                       # Static assets
    ├── vite.config.ts                # Vite + proxy config
    ├── tailwind.config.ts            # Custom colors, animations
    ├── tsconfig.json                 # TypeScript config
    ├── package.json                  # Frontend dependencies
    └── vitest.config.ts              # Test runner config
```

---

## AI Scoring Engine

**File:** `src/engine/scoringEngine.ts`

The ranking engine uses a **weighted composite score** across 5 dimensions:

| Factor | Weight | Description |
|---|---|---|
| **Legality** | 30% | How legally safe the spot is (0–1 score) |
| **Safety** | 20% | Theft/vandalism risk, adjusted by recent reports |
| **Shade** | 20% | Tree cover score, weighted by time of day |
| **Accessibility** | 20% | Inverse distance — closer = higher score |
| **Cost** | 10% | Free=1.0, paid scales inversely with cost×duration |

### Key Algorithms

```
finalScore = (0.30 × legality + 0.20 × safety + 0.20 × shade × shadeMultiplier +
              0.20 × accessibility + 0.10 × cost) / totalWeight

walkDistance = haversine(spot.lat, spot.lng, dest.lat, dest.lng)  // meters
walkTime = walkDistance / 80  // ~80 m/min average walking speed

shadeMultiplier = { high: 1.5, medium: 1.0, low: 0.5 }  // user preference
safetyPenalty = -0.15 per theft report, -0.10 per fine, +0.05 per safe (90 days)
```

---

## API Reference

### Auth Routes (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | ❌ | Register new user |
| `POST` | `/api/auth/login` | ❌ | Login, returns JWT |
| `GET` | `/api/auth/me` | ✅ JWT | Get current user |

### Spots Routes (`/api/spots`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/spots` | ✅ JWT | Fetch all parking spots |

### Reports Routes (`/api/reports`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/reports` | ✅ JWT | Submit a spot report (safe/fine/theft) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas URI)

### 1. Install Frontend Dependencies

```bash
cd parkwise-ai
npm install
```

### 2. Install Backend Dependencies

```bash
cd parkwise-ai/server
npm install
```

### 3. Configure Environment

```bash
# parkwise-ai/server/.env
MONGO_URI=mongodb://localhost:27017/parkwise
JWT_SECRET=your_super_secret_key
PORT=5000
```

### 4. Seed the Database

```bash
cd parkwise-ai/server
npm run seed
```

### 5. Start Backend

```bash
cd parkwise-ai/server
npm run dev
# → http://localhost:5000
```

### 6. Start Frontend

```bash
cd parkwise-ai
npm run dev
# → http://localhost:8080
```

> The frontend auto-proxies `/api` requests to `localhost:5000` via `vite.config.ts`.  
> If the backend is unavailable, the app seamlessly falls back to 25 mock parking spots.

---

## Environment Variables

| Variable | Location | Description |
|---|---|---|
| `MONGO_URI` | `server/.env` | MongoDB connection string |
| `JWT_SECRET` | `server/.env` | Secret key for JWT signing |
| `PORT` | `server/.env` | Backend port (default: 5000) |

---

## Design System

- **Theme**: Dark glassmorphism with neon accent colors
- **Color Palette**: `neon-green (#22c55e)`, `neon-amber (#f59e0b)`, `neon-red (#ef4444)`, `primary (#2dd4bf)`
- **Typography**: JetBrains Mono (monospace data), system sans-serif (labels)
- **Map Tiles**: CARTO Dark Matter (`cartocdn.com/dark_all`)
- **Animations**: Framer Motion spring transitions, CSS `pulse-marker` keyframes
- **Components**: glassmorphism `glass-card` class with `backdrop-blur`, `bg-opacity`, and `border` layering

---

## Key Design Decisions

1. **Offline-first resilience** — The app degrades gracefully when the backend is unreachable, ensuring the UI is always functional with mock data.
2. **Click-to-search on map** — Reverse geocoding triggered on any map click allows exploratory, non-text-based destination selection.
3. **Time-aware scoring** — Shade importance is dynamically adjusted based on the current hour, making scores more contextually accurate throughout the day.
4. **Report decay window** — Only reports within the last 90 days affect safety scores, preventing stale data from permanently penalizing spots.
5. **Top-10 cap** — The engine always returns at most 10 results to keep the UI performant and the choices manageable.

---

