# Aetheris Platform

Aetheris is a luxury full-stack spatial design and architectural curation platform powered by integrated multi-modal AI agents. The platform facilitates the listing, exploration, and dynamic curation of high-end architectural spaces while providing clients with cognitive spatial advice and intelligent matching engines.

---

## Technical Specifications

### Frontend
*   **Framework:** Next.js 16 (App Router)
*   **Library:** React 19
*   **Language:** TypeScript (Strict Mode)
*   **Styling:** Tailwind CSS (with dark minimalist defaults)
*   **UI Component Library:** HeroUI (v3) / NextUI equivalents
*   **State Management:** TanStack Query (React Query)
*   **Icons:** Lucide React
*   **Animations:** Framer Motion (Framer Motion v12 / motion)

### Backend & Core Services
*   **Runtime:** Node.js
*   **Server:** Next.js built-in API Route Handlers & Direct Server Actions
*   **Database:** MongoDB (via official native MongoDB driver `mongodb`)
*   **Authentication:** Better-Auth (with MongoDB adapter, session middleware, and credentials/Google OAuth provider integration)
*   **Payment Processing:** Stripe Node SDK & Stripe Elements client-side
*   **Agentic AI:** Google Gemini API (utilizing stable `gemini-2.5-flash` model engines)
*   **Asset Storage:** ImgBB API Integration (direct device file upload mapping)

---

## User Roles & System Privileges (RBAC)

The application supports three distinct user roles mapped dynamically across four operational user profiles:

```
[Admin] ── (Inherits & Overrides) ──> [Moderator] ── (Inherits & Overrides) ──> [Normal User]
                                                                                      │
                                                                   ┌──────────────────┴──────────────────┐
                                                                   ▼                                     ▼
                                                            [Client / User]                      [Architect / Creator]
```

### 1. Admin (Absolute System Controller)
*   Accesses the Admin Control Panel `/dashboard/admin`.
*   Reviews global stats (managed listings volume, active licenses, accrued platform fees).
*   Analyzes transaction curves via custom vector SVG charts.
*   Modifies user account roles (promoting standard accounts to administrators).
*   Executes global block and ban parameters on bad actors.
*   Deletes any non-compliant spatial listing in the database.

### 2. Moderator (Platform Steward)
*   Accesses the Moderator Panel `/dashboard/moderator`.
*   Audits spatial blueprint submissions pending quality verification.
*   Grants official approval stamps, releasing listings to the public catalog and homepage showcases.
*   Flags or hides non-compliant portfolios from public search indexes.
*   Moderates design critiques, reviews, and community architectural feedback.

### 3. Client / User (Standard Customer)
*   Accesses the Client Portal `/dashboard/user`.
*   Browses, searches, and filters verified blueprints ($10k - $35k) in the explore catalog.
*   Engages the Aetheris Curator (Gemini AI Chat) for design advice.
*   Consults the Smart Recommender (AI Matching Engine) to locate layouts matching preferences.
*   Licenses verified architectural blueprints through Stripe Checkout integrations.
*   Bookmarks favorite curations and manages active licenses inside their dashboard.

### 4. Architect (Studio Creator)
*   Accesses the Architect Portal `/dashboard/writer`.
*   Pays the $20 registration fee to activate studio verified listings.
*   Registers new spatial designs (dimensions, pricing, location, CAD images) via centered upload forms.
*   Leverages direct device image uploads (natively mapped to ImgBB storage API).
*   Tracks portfolio statistics, total licensing revenue earned, and active client inquiries.

---

## Operational Data Flow

```
[Architect submits Blueprint] ──> [Enters Pending Verification] ──> [Moderator Approves Space]
                                                                                  │
                                                                                  ▼
[Platform Administrator Monitors] <── [Client Licenses via Stripe] <── [Space visible in Catalog]
```

---

## Database Schema Specifications (MongoDB)

### Users Collection (`users`)
```typescript
interface UserSchema {
  _id: import("mongodb").ObjectId;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: "user" | "writer" | "admin" | "moderator";
  userRole: "user" | "writer";
  verifiedArchitect: boolean;
  banned?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Spaces Collection (`spaces`)
```typescript
interface SpaceSchema {
  _id: import("mongodb").ObjectId;
  title: string;
  category: "Japandi Minimalism" | "Modernist Brutalism" | "Classical Bauhaus" | "Nordic Rustic";
  shortDescription: string;
  description: string;
  price: number;
  rating: number;
  coverImage: string;
  architectName: string;
  architectEmail: string;
  dimensions: string;
  location: string;
  status?: "Approved" | "Flagged";
  createdAt: Date;
}
```

### Transactions Collection (`transactions`)
```typescript
interface TransactionSchema {
  _id: import("mongodb").ObjectId;
  stripeSessionId: string;
  type: "purchase" | "publishing fee";
  buyerEmail: string;
  associatedItemId?: import("mongodb").ObjectId;
  amountPaid: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}
```

### Bookmarks Collection (`bookmarks`)
```typescript
interface BookmarkSchema {
  _id: import("mongodb").ObjectId;
  userId: string;
  spaceId: import("mongodb").ObjectId;
  createdAt: Date;
}
```

---

## Environment Variable Setup (`.env.local`)

```env
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
MONGO_DB_URI=mongodb+srv://SCIC-Assignment-5:Ut4myRfjwV8oIT8W@cluster0.ygl3akl.mongodb.net/?appName=Cluster0
AUTH_DB_NAME=SCIC-Assignment-5
GEMINI_API_KEY=your_gemini_api_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
NEXT_PUBLIC_IMAGE_UPLOAD_API=81e9a814e602ad8b0864a375b9d886e2
BETTER_AUTH_SECRET=QaEZkJmQ2PiA29HJJdsDbdVzU63VEQtQ
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

---

## Local Setup & Development Guide

Follow these steps to initialize and launch the development environment:

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Launch Local Servers
Run the unified frontend and backend server environment:
```bash
npm run dev
```

### 3. Production Compiling
Build the Next.js production build bundle and test TypeScript static compilation safety:
```bash
npm run build
```