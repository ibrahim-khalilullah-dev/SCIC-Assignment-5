# Aetheris Platform

Aetheris is a full-stack, luxury spatial design and architectural curation platform powered by integrated multi-modal AI agents. The platform facilitates the listing, exploration, and dynamic curation of premium architectural designs (such as Japandi Minimalism, Modernist Brutalism, Classical Bauhaus, and Nordic Rustic) while providing clients with cognitive spatial advice and intelligent matching engines.

---

## **Live Access & Repository**

* **Live Platform URL:** [https://aetheris-platform.vercel.app](https://aetheris-platform.vercel.app)

---

## **How the Platform Works**

Aetheris is constructed as a unified full-stack application leveraging the Next.js App Router. The frontend client layers interact directly with the backend using dynamic Route Handlers and secure Next.js Server Actions. 

### **The Architecture**
Unlike traditional multi-tier setups, Aetheris does not use a separate Express.js server:
1. **Dynamic Client Views:** Constructed using React 19, Tailwind CSS, HeroUI (v3), and Motion (Framer Motion v12) to present a premium, unified pitch-black (`#040404`) and luxury antique gold (`#dfb780`) aesthetic.
2. **Built-in Backend Routers:** API operations and secure server tasks are fully executed inside App Router route paths (`src/app/api/`), linking directly to MongoDB via the official native `mongodb` driver.
3. **Better-Auth & MongoDB Adapter:** Manages user state sessions, token validations, and dynamic registration parameters directly linked to database roles.
4. **Resilient Billing:** Incorporates a Stripe Node SDK with integrated local/offline payment fallback captures to ensure a smooth licensing loop even in environments without valid Stripe configurations.

---

## **Key Platform Features**

### **1. Multimodal Spatial Vision AI**
Located at `/dashboard/vision`, this module allows clients to upload floor drafts or physical interior renderings. The system uploads the asset to remote storage and feeds the image directly to the Google Gemini 2.5-flash vision engine, returning an instant classification of design style, dominant color palettes, lighting vectors, and layout optimization advice.

### **2. Architectural Advisor (Aetheris Chat Curator)**
Available at `/dashboard/user` (via the AI Advisor panel), this context-aware assistant utilizes historical messaging prompts to discuss wabi-sabi details, brutalist concrete shadows, and modernist proportions with absolute design authority.

### **3. Smart Recommender (AI Matching Engine)**
Located at `/ai-recommend` (available to authenticated clients), this engine reviews written client preferences alongside financial boundaries, analyzes active spatial database entries, and generates a structured JSON output of the top matching blueprint, along with its suitability score and detailed architectural justification.

### **4. Live Bookmarks Inspiration Grid**
Clients can bookmark high-end catalog curations. The user dashboard retrieves these selections from your database collections and renders an inspiration board featuring live unbookmarking triggers.

### **5. Dynamic Metrics & SVG Waveforms**
Static indicators have been replaced with live database pipelines:
* The landing page statistcs count and average all database spatial listings.
* Both the Admin Control Panel and Client Portal dashboards generate dynamic coordinates mapping live payment totals and complexity indices over time onto scalable vector SVG graphs.

---

## **Role-Based Access Control (RBAC) & Privileges**

The platform maintains secure operational boundaries across four distinct user designations:

```
[Admin] ── (Inherits & Overrides) ──> [Moderator] ── (Inherits & Overrides) ──> [Normal User]
                                                                                      │
                                                                   ┌──────────────────┴──────────────────┐
                                                                   ▼                                     ▼
                                                            [Client / User]                      [Architect / Creator]
```

### **1. Admin (Absolute System Controller)**
* **Access Control:** Full entry to `/dashboard/admin`.
* **Platform Metrics:** Views global statistics (total listings volume, active registered profiles, total platform fee revenues).
* **Explicit Designation Overrides:** Modifies any account's status via a drop-down menu, synchronizing system roles between `Client`, `Architect`, `Moderator`, and `Admin`.
* **User & Content Deletion:** Power to remove bad actors and non-compliant spatial records globally.
* **Direct Warnings:** Issues warning notices to users that render as actionable banners on their dashboards.

### **2. Moderator (Platform Steward)**
* **Access Control:** Full entry to `/dashboard/moderator`.
* **Review Pipeline:** Audits newly uploaded blueprints, applies verified approval stamps, or flags non-compliant designs.
* **Moderator User Blocking:** Authorized to ban or unban standard clients and architects (restricted from blocking administrators or other moderators).
* **Direct Warning System:** Issues custom notices to target users.

### **3. Architect (Studio Creator)**
* **Access Control:** Full entry to `/dashboard/writer`.
* **Publishing Privileges:** Unlocks portfolio uploading by paying the $20 registration fee.
* **Listing Registration (`/items/add`):** Publishes spatial templates, dimensions, rates, and locations, with direct image uploads natively mapped to ImgBB storage API.
* **Property Controls (`/items/manage`):** Allows creators to edit their layouts via pre-populated edit forms or delete owned templates securely.

### **4. Client (Standard User)**
* **Access Control:** Full entry to `/dashboard/user`.
* **Browse Vault (`/browse`):** Searches and filters listings by category, rates, or rating priorities.
* **Licensing:** Acquires spatial plans via Stripe Checkout or interactive offline bypasses to store active licenses inside their profile.

---

## **Cloning & Local Development Guide**

Follow these instructions to clone, configure, and launch the platform locally:

### **1. Clone the Repository**
Open your terminal and clone the repository to your local machine:
```bash
git clone https://github.com/ibrahim-khalilullah-dev/SCIC-Assignment-5.git
cd SCIC-Assignment-5
```

### **2. Install Dependencies**
Install the necessary package modules configured for React 19 and Next.js 16:
```bash
npm install
```

### **3. Configure Environment Variables**
Create a `.env.local` file in the root of your project directory and add your keys:
```env
# Platform Base URLs
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database Settings
MONGO_DB_URI=mongodb+srv://SCIC-Assignment-5:Ut4myRfjwV8oIT8W@cluster0.ygl3akl.mongodb.net/?appName=Cluster0
AUTH_DB_NAME=SCIC-Assignment-5

# AI API Key (Required for AI Advisor, Vision AI & AI Recommender)
GEMINI_API_KEY=your_gemini_api_key_here

# Payment Settings (Use "sk_test_mock..." or equivalent to test offline checkout fallback)
STRIPE_SECRET_KEY=sk_test_mock_key_for_vercel_build_pass
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Asset Storage Key (ImgBB Key used for profile and blueprint uploads)
NEXT_PUBLIC_IMAGE_UPLOAD_API=81e9a814e602ad8b0864a375b9d886e2

# Authentication Secrets
BETTER_AUTH_SECRET=QaEZkJmQ2PiA29HJJdsDbdVzU63VEQtQ
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### **4. Launch the Development Server**
Run the unified frontend and backend environment:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the platform.

### **5. Build for Production**
Test TypeScript static compilation safety and compile the optimized production package:
```bash
npm run build
```