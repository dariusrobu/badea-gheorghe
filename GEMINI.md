# Project Overview: Badea Gheorghe (Restaurant Sebeș)

Badea Gheorghe is a comprehensive restaurant platform for "Restaurant Sebeș," offering traditional Romanian and fast-food cuisine. The project integrates a static frontend with a headless CMS for dynamic content, a local Node.js backend for data persistence, and cloud-based serverless functions for production features like payments and subscriptions.

## 🚀 Main Technologies

- **Frontend:** Vanilla HTML/CSS/JavaScript, bundled and served with **Vite**.
- **Headless CMS:** **Sanity.io** manages the menu, blog posts, categories, and catering orders.
- **Backend (Local):** **Node.js** with **Express** and **PostgreSQL** for managing subscribers and orders during development.
- **Serverless (Production):** **Vercel Functions** handle Stripe checkouts and newsletter subscriptions.
- **Payments:** **Stripe** integration for catering services.
- **Email:** **Resend** for newsletter delivery.
- **Database:** **PostgreSQL** (local or hosted) for persistent data storage.

## 📁 Project Structure Highlights

- `index.html`, `meniu.html`, etc.: Core frontend pages.
- `js/`: Vanilla JS logic, including Sanity integrations (`main-sanity.js`, `menu-sanity.js`).
- `backend/`: Local Express server and database initialization scripts (`server.js`, `init.sql`).
- `api/`: Production-ready Vercel serverless functions.
- `sanity/badea-gheorghe/`: Sanity Studio configuration and schema definitions (`schemaTypes/`).
- `css/`: Styling including responsive designs and theme configurations.

## 🛠 Building and Running

### Development
To run the frontend and local backend concurrently:
```bash
npm run dev
```

Alternatively, run them separately:
- **Frontend:** `npm run frontend` (Starts Vite on http://localhost:5173)
- **Backend:** `npm run backend` (Starts Express on http://localhost:3000)

### Production Build
To build the static frontend assets:
```bash
npm run build
```

### Sanity Studio
To manage content locally, navigate to the sanity directory and start the studio:
```bash
cd sanity/badea-gheorghe
npm install
npm run dev
```

## 📝 Development Conventions

- **Vanilla JS:** The project favors native JavaScript over frameworks for the frontend to maintain simplicity and performance.
- **Content Resilience:** Always provide fallback data in `fetch` functions (see `js/main-sanity.js`) to ensure the site remains functional if the Sanity API is unavailable.
- **Utility First:** Use the helpers in `js/utils.js` for common tasks like debouncing, throttling, and viewport detection.
- **Modular Backend:** Keep production-critical logic in the `api/` directory as serverless functions for easy deployment to Vercel.
- **Database Schema:** Use `backend/init.sql` as the source of truth for the PostgreSQL schema.

## 🔧 Infrastructure & Keys
The project requires several environment variables for full functionality (refer to `.env` if available):
- `SANITY_PROJECT_ID`: `rb9fvomb`
- `DATABASE_URL`: PostgreSQL connection string.
- `STRIPE_SECRET_KEY`: For processing payments.
- `RESEND_API_KEY`: For sending emails.
