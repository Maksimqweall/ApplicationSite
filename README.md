# FitTrack — High-Fidelity Fitness Architecture & Telemetry Ecosystem

[![Engine](https://img.shields.io/badge/Architecture-Vanilla%20JS%20%20%20Express-0ea5e9?style=for-the-badge)]()
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%20%20Prisma-6366f1?style=for-the-badge)]()
[![PWA](https://img.shields.io/badge/PWA-Liquid%20Glass%20UX-af52de?style=for-the-badge)]()
[![Security](https://img.shields.io/badge/Security-JWT%20%20%20Bcrypt%20%20%20OAuth2-22c55e?style=for-the-badge)]()

FitTrack is an enterprise-grade, ultra-optimized Full-Stack Progressive Web Application (PWA) designed to eliminate friction in fitness tracking, macro-nutrition calculation, and progressive overload telemetry. 

Rejecting the bloated dependencies of heavy modern frameworks, this application serves as a **masterclass in pure Vanilla JavaScript engineering and high-performance System Design**. It implements a fully responsive, custom-styled **Liquid Glass UI framework** paired with an asynchronous REST API, a robust relational database layer, and deep hardware-level browser integrations.

---

## 🏗️ Architectural Philosophy & Paradigm

### 1. The Power of Zero-Dependency Vanilla JS
Modern web development is heavily oversaturated with large frameworks (React, Vue) that add layers of abstraction, virtual DOM parsing overhead, and massive bundle sizes. FitTrack proves that **pure JavaScript, when written with precise architectural discipline, outperforms frameworks in both rendering speed and resource consumption**.
* **Direct DOM State Synchronization:** UI updates happen deterministically through precise element manipulation, resulting in near-zero layout shift and instantaneous response times.
* **Componentless Architecture:** View management is handled through a custom single-page layout switcher that manipulates CSS class states rather than mounting/unmounting expensive DOM subtrees.

### 2. Ultra-Compact Liquid Glass Design System
The visual layer is built completely from scratch using modern CSS variables, advanced composite filters, and mathematical layout scaling.
* **Ambient Multi-Layered Depth:** Utilizes hardware-accelerated blurred background blobs mixed with `backdrop-filter: blur()` glass layers to achieve a highly responsive, modern dark-mode appearance reminiscent of premium iOS interfaces.
* **Viewport Lock & Zoom Prevention:** Specially optimized for native mobile application feel. Through precise viewport scaling configurations (`maximum-scale=1.0`, `user-scalable=0`) and adaptive media queries, the interface completely locks out intrusive web behaviors like unwanted page bouncing or iOS Safari’s forced input form auto-zooming while retaining an ultra-dense, glanceable metric layout.

---

## 🚀 Key Architectural Subsystems & Features

### 1. Temporal Navigation Calendar (SPA Core)
Your fitness data is treated as a continuous timeline. The interface utilizes a custom asynchronous date-navigator state machine. Swapping dates initiates a smooth scale-and-fade CSS transition, locks pointer interactions to prevent race conditions, fetches scoped daily payloads from the REST API, and repopulates the dashboard seamlessly within milliseconds.

### 2. Macro Nutrition Engine with Real-Time Calculation
* **Real-time Caloric Density Calculation:** Built-in nutrient database allowing users to select preconfigured food nodes.
* **Asynchronous Micro-Scaling:** An active event listener tracks precise gram inputs and uses real-time linear interpolation to calculate absolute caloric density on the fly, feeding the data dynamically into a fluid progress visualization.
* **Goal Threshold Alerts:** Automatically monitors daily caloric boundaries, altering structural UI accent vectors to alert users instantly if they exceed their predefined energy thresholds.

### 3. Architecture Workout Planner & Automated Template Injector
* **GitHub-Style Consistency Map:** Renders an interactive 12-week grid (84 unique time cells) reflecting workout consistency over time by querying specialized aggregated historical relational data arrays.
* **SaaS-Grade Blueprint Engine:** Includes an adaptive template repository featuring legendary structural programs like *Arnold x PPL Hybrid*, *Classic Push/Pull/Legs*, *Upper/Lower Splits*, and *High-Intensity Full Body*.
* **Dynamic Protocol Injection:** If a user chooses an architecture, the system reads the current day of the week, evaluates the targeted muscle block, displays an interactive preview banner, and enables **one-click automated micro-injection** of the entire routine straight into the active database log via parallelized network transactions.

### 4. Progressive Overload Strength Telemetry (Chart.js Integration)
* **Historical Data Compounding:** Exercises are logged with individual weight parameters linked directly to structural metrics.
* **Dynamic Analytics Rendering:** Fetches a filtered 90-day trajectory of performance records for compound lifts (Bench Press, Squat, Deadlift, OHP). It instantiates a thoroughly styled Chart.js instance complete with custom linear gradients, smoothed cubic bezier curves, and rich HTML tooltips mapping absolute strength progression.

### 5. Integrated Hardware Rest Timer (Web Audio API)
* **Zero Asset Overhead:** To guarantee 100% offline autonomy and completely avoid network asset loading choke points, the rest timer does not load or stream `.mp3` audio files.
* **Processor-Level Signal Synthesis:** It taps directly into the device's hardware audio chip via the **Web Audio API**. Upon timer completion, it spins up a native `OscillatorNode`, commands a pure mathematical sine wave at exactly 880Hz (Note A5), maps a sharp exponential decay curve through a `GainNode`, and dispatches a clean acoustic signal straight to the user's audio output.

## 🛠️ Tech Stack & System Infrastructure
                                  [ Liquid Glass UI ]
                                           │
                             (Vanilla JS / Service Worker PWA)
                                           │  (Secure JWT HTTPS)
                                           ▼
                                    [ Express API ]
                                     │     │     │
                 ┌───────────────────┘     │     └───────────────────┐
                 ▼                         ▼                         ▼
         (Prisma Client)             (Cloudinary CDN)         (Telegram Bot API)
                 │                         │                         │
                 ▼                         ▼                         ▼
         [ PostgreSQL ]             [ Image Storage ]        [ Real-time Alerts ]

Frontend Layer
HTML5 / CSS3: Custom responsive layout architectures, flex/grid systems, non-blocking asynchronous asset embedding, typography rendering via preconnected Google Fonts nodes.

Vanilla JavaScript (ES6+): Complete application state controller, form processing engines, Chart.js orchestration, Web Audio processor pipelines, Cropper.js avatar node integration.

PWA Service Worker: Implements a highly advanced service worker layer with active caching architectures. Features immediate update mechanics via self.skipWaiting() and self.clients.claim(), ensuring code updates push through to client viewports instantaneously upon deploy without being locked out by stale browser memory.

Backend API Layer
Node.js & Express: High-speed RESTful API, optimized modular routing structures, global error-handling catch blocks, and secure CORS headers configurations.

Custom Middleware Pipeline: Secure token processing gateway capturing, parsing, and authenticating inbound bearer signatures over stateless HTTP channels.

Database & Security Layer
Prisma ORM & PostgreSQL: Relational database schemas mapping multi-tier dependencies. Completely automated sync states via structured migrations.

Dual-Tier Identity Verification: Features deep encryption protocols deploying custom password hashing algorithms (bcryptjs) alongside robust federated authorization gateways natively executing Google OAuth2 credential token decryptions.

Storage & Webhook Integrations: Handles file stream piping by receiving multipart form uploads in memory buffer structures, pushing them asynchronously to the Cloudinary CDN network, and routing client interactions directly into a secure Telegram Bot messaging endpoint.

Installation & Local Environment Spin-up
To clone, configure, and execute this environment locally on your workstation, follow these steps:

1. Clone the Source Repository
   
git clone https://github.com/Maksimqweall/ApplicationSite

cd FitTrack

3. Install Project Dependencies

npm install

5. Establish Environment Configurations

Create a root-level .env file and populate it with your infrastructure access keys:
PORT=3000

DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

JWT_SECRET="your_ultra_secure_jwt_random_salt_string"

TELEGRAM_BOT_TOKEN="your_telegram_bot_api_token"

TELEGRAM_CHAT_ID="your_personal_telegram_chat_id"

CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"

CLOUDINARY_API_KEY="your_cloudinary_api_key"

CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

GOOGLE_CLIENT_ID="your_google_cloud_oauth2_client_id"


7. Push Database Blueprints & Sync Client
   
Map the Prisma relational architecture models directly into your live database node:

npx prisma db push

5. Start the Live Server Engine
   
npm start

The application backend will initialize, mapping standard endpoints on http://localhost:3000

Core Competencies Demonstrated in This Project
By building this application entirely from scratch, I have mastered and proven structural industry-standard engineering skills:
Advanced Systems Integration: Programmatically tying databases, file delivery CDNs, federated authentication brokers, and real-time messaging webhooks into a unified backend.
Performance-Driven UI Engineering: Constructing highly reactive interfaces utilizing native browser APIs, achieving massive performance spikes compared to typical heavy web application frameworks.
Secure Enterprise Coding: Enforcing strict data isolation rules through stateful JSON Web Token parsing mechanisms, password encryption protocols, and OAuth2 identity validations.
Mobile-First Product Delivery: Tuning network caches, viewport containment protocols, and hardware processing layers to ship an ultra-compact application maximizing space efficiency.
Developed with clean code architecture and absolute engineering discipline. Looking for an ambitious Full-Stack Engineer who understands low-level web performance, secure systems design, and database integrity? Let's connect and build something extraordinary.
