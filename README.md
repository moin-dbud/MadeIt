<p align="center">
  <img src="public/madeit.png" alt="MadeIt Logo" width="120" />
</p>

<h1 align="center">MadeIt</h1>

<p align="center">
  <strong>Build real projects. Prove your work. Get noticed.</strong>
</p>

<p align="center">
  A milestone-based project execution platform that helps developers build real-world projects through structured tasks, and automatically transforms their progress into a shareable proof-of-work portfolio.
</p>

<p align="center">
  <a href="https://madeit.moinsheikh.in">🌐 Live Demo</a> •
  <a href="#features">✨ Features</a> •
  <a href="#tech-stack">🛠 Tech Stack</a> •
  <a href="#getting-started">🚀 Getting Started</a>
</p>

---

## 📋 Overview

MadeIt solves the problem of developers who learn but never ship. Instead of passive courses and tutorials, MadeIt provides curated, real-world projects broken down into structured milestones. Users pick a project, complete tasks step-by-step, submit proof of their work (GitHub commits, screenshots, videos, links), and automatically build a public portfolio that showcases verified accomplishments.

**Who is this for?**

- Self-taught developers looking to build a credible portfolio
- Bootcamp graduates who need real-world project experience
- Anyone who wants to transition from learning to building

---

## ✨ Features

- **Curated Real-World Projects** — Pre-configured projects (Personal Portfolio, E-Commerce, Task Manager, etc.) with structured milestones and tasks
- **Milestone-Based Execution** — Projects are broken into milestones, each with specific tasks, expected outputs, and proof requirements
- **Proof-of-Work Submissions** — Submit proof via GitHub commits, screenshots, video demos, live links, or text descriptions
- **GitHub Integration** — Fetch commits from linked repositories, analyze commit patterns, detect red flags (bulk uploads, poor messages)
- **Automatic Portfolio Generation** — Completed work automatically builds a shareable public portfolio at `/portfolio/:username`
- **Portfolio Analytics** — Track portfolio views, session durations, link clicks (GitHub, LinkedIn, live demo), and per-project engagement
- **ATS-Ready PDF Export** — Generate a clean, text-first PDF of your portfolio optimized for Applicant Tracking Systems
- **Recruiter Contact System** — Recruiters can reach out to portfolio owners directly through a built-in contact modal
- **Public Portfolio Sharing** — Share your portfolio on LinkedIn, Twitter/X, WhatsApp, and Facebook with one click
- **Admin Dashboard** — Review pending milestone submissions, approve/reject/flag user work
- **Transactional Email Notifications** — Branded HTML emails for welcome, project selection, milestone submission, verification, and more
- **Support Ticket System** — Users can raise tickets (bugs, questions, feature requests, repo change requests) with email confirmations
- **Contact Form** — Public contact page with auto-reply emails
- **Cohort Registration** — Sign up for future learning cohorts
- **User Feedback Collection** — Contextual feedback prompts after first milestone or first project completion
- **SEO Optimized** — Dynamic meta tags, Open Graph, structured data (JSON-LD), and a `robots.txt` for public pages
- **Profile Onboarding** — Multi-step profile setup (name, bio, avatar, GitHub username, skills, portfolio settings)
- **Dark Mode UI** — Polished dark-themed interface with the Inter font, smooth animations, and glassmorphism accents
- **File Uploads** — Upload images, videos, and documents to Cloudinary for milestone proof
- **Activity Tracking** — Log user actions (page views, project starts, milestone completions) for engagement insights
- **Error Boundaries** — Graceful error handling across the app with user-friendly fallback UIs

---

## 🛠 Tech Stack

| Category           | Technology                                                       |
| ------------------ | ---------------------------------------------------------------- |
| **Frontend**       | React 19, React Router 7, JSX                                   |
| **Styling**        | Tailwind CSS 4 (via `@tailwindcss/vite`), Inter (Google Fonts)   |
| **Animations**     | Framer Motion, React Spring                                      |
| **Icons**          | Lucide React                                                     |
| **Build Tool**     | Vite 7                                                           |
| **Backend / API**  | Vercel Serverless Functions + Express.js (local dev)             |
| **Database**       | Supabase (PostgreSQL) with Row Level Security                    |
| **Authentication** | Supabase Auth (Email/Password + Google OAuth)                    |
| **File Storage**   | Cloudinary (unsigned uploads for milestone proof)                |
| **Email**          | Nodemailer via Gmail SMTP                                        |
| **PDF Generation** | jsPDF                                                            |
| **Linting**        | ESLint 9 with React Hooks & React Refresh plugins                |
| **Deployment**     | Vercel                                                           |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel (Production)                   │
│  ┌──────────────┐  ┌─────────────────────────────────┐  │
│  │ Static Build │  │  Serverless Functions (/api/*)   │  │
│  │  (Vite SPA)  │  │  • send-email.js                │  │
│  │              │  │  • contact.js                    │  │
│  │  React App   │  │  • support-ticket.js             │  │
│  │  + Router    │  │  • health.js                     │  │
│  └──────┬───────┘  └──────────┬──────────────────────┘  │
│         │                     │                          │
└─────────┼─────────────────────┼──────────────────────────┘
          │                     │
   ┌──────▼──────┐       ┌──────▼──────┐     ┌────────────┐
   │  Supabase   │       │   Gmail     │     │ Cloudinary │
   │ (Auth + DB) │       │   SMTP      │     │  (Uploads) │
   └─────────────┘       └─────────────┘     └────────────┘
```

- **Frontend**: React SPA with client-side routing. Supabase JS client handles auth and database operations directly from the browser.
- **API**: Vercel serverless functions handle email delivery (contact form, support tickets, transactional notifications). A custom Vite plugin (`vercelApiDevPlugin`) proxies `/api/*` requests during local development.
- **Express Server** (`server/index.js`): A standalone Express server that mirrors the Vercel functions for local development. Supports the same email endpoints and also initializes a Supabase admin client.
- **Database**: Supabase PostgreSQL with 6 tables (`users`, `analytics`, `recruiter_inquiries`, `support_tickets`, `feedback`, `cohort_applications`), Row Level Security, and JSONB columns for flexible document-style data.

---

## 📁 Project Structure

```
MadeIt/
├── api/                          # Vercel Serverless Functions
│   ├── send-email.js             # Transactional email handler (10 email types)
│   ├── contact.js                # Public contact form endpoint
│   ├── support-ticket.js         # Support ticket email endpoint
│   ├── health.js                 # Health check endpoint
│   ├── _helpers.js               # Shared email/CORS utilities
│   └── package.json              # Serverless function dependencies
├── server/
│   └── index.js                  # Express server for local development
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── Navbar.jsx            # Navigation bar
│   │   ├── ProtectedRoute.jsx    # Auth route guards (Protected, PublicOnly, Admin, Owner)
│   │   ├── DetailedProjectCard.jsx
│   │   ├── MilestoneCard.jsx     # Milestone display with task tracking
│   │   ├── ProofInput.jsx        # Proof submission form
│   │   ├── SubmissionModal.jsx   # Milestone submission dialog
│   │   ├── PortfolioAnalytics.jsx
│   │   ├── RecruiterMessages.jsx
│   │   ├── SharePortfolioModal.jsx
│   │   ├── FeedbackModal.jsx
│   │   ├── ContactCandidateModal.jsx
│   │   ├── GitHubCommitSelector.jsx
│   │   ├── Hero.jsx, HeroMockup.jsx, FinalCTA.jsx  # Landing page sections
│   │   ├── ErrorBoundary.jsx     # Error boundary wrapper
│   │   └── ...
│   ├── pages/                    # Route-level page components
│   │   ├── Home.jsx              # Landing page
│   │   ├── Login.jsx             # Auth page (login + signup)
│   │   ├── ProfileSetup.jsx      # Multi-step onboarding
│   │   ├── Dashboard.jsx         # User dashboard
│   │   ├── Projects.jsx          # Browse/select projects
│   │   ├── ProjectPage.jsx       # Project detail + milestone execution
│   │   ├── Portfolio.jsx         # Portfolio view (private + public)
│   │   ├── Support.jsx           # Support ticket system
│   │   ├── ContactUs.jsx         # Public contact form
│   │   ├── CohortRegistration.jsx
│   │   ├── Documentation.jsx     # Platform documentation
│   │   ├── About.jsx, PrivacyPolicy.jsx, TermsOfService.jsx
│   │   └── ...
│   ├── services/                 # API/service integrations
│   │   ├── user.service.js       # Supabase user CRUD operations
│   │   ├── github.service.js     # GitHub API (commits, analysis, red flags)
│   │   └── cloudinary.service.js # File upload to Cloudinary
│   ├── context/
│   │   └── AuthContext.jsx       # Auth state provider (Supabase)
│   ├── config/
│   │   ├── projects.config.js    # All project definitions, milestones, tasks
│   │   └── email.js              # Email config constants
│   ├── utils/                    # Utility functions
│   │   ├── analytics.js          # Portfolio analytics tracking (Supabase)
│   │   ├── publicPortfolio.js    # Username lookup, social sharing URLs
│   │   ├── proofValidation.js    # Proof type validation (commit, screenshot, video, etc.)
│   │   ├── pdfExport.js          # ATS-ready PDF generation (jsPDF)
│   │   ├── feedback.js           # Feedback collection logic
│   │   ├── seo.js                # Dynamic meta tags, Open Graph, JSON-LD
│   │   ├── activityTracking.js   # User activity logging
│   │   └── ...
│   ├── supabase/
│   │   └── supabase.js           # Supabase client initialization
│   ├── firebase/                 # Legacy shim (redirects to Supabase)
│   ├── App.jsx                   # Root component with routing
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles + Tailwind + design tokens
├── supabase/
│   └── schema.sql                # Complete database schema with RLS policies
├── public/
│   ├── madeit.png                # Favicon / logo
│   ├── logo.png, logo.svg
│   └── robots.txt                # SEO robots directives
├── scripts/
│   └── update-api-urls.js        # Migration helper for API URL updates
├── .env.example                  # Environment variable template
├── .gitignore
├── index.html                    # SPA entry HTML
├── package.json
├── vite.config.js                # Vite config + API dev proxy plugin
├── vercel.json                   # Vercel routing rewrites
└── eslint.config.js
```

---

## 📦 Prerequisites

- **Node.js** ≥ 18
- **npm** (comes with Node.js)
- **Supabase** project ([supabase.com](https://supabase.com))
- **Gmail** account with [App Password](https://support.google.com/accounts/answer/185833) enabled (for email functionality)
- **Cloudinary** account ([cloudinary.com](https://cloudinary.com)) — free tier works

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/moin-dbud/MadeIt.git
cd MadeIt
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Run the contents of [`supabase/schema.sql`](supabase/schema.sql) to create all tables, indexes, and Row Level Security policies.
4. Enable **Google OAuth** in Supabase → Authentication → Providers (optional, for Google sign-in).

### 4. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials (see [Environment Variables](#-environment-variables) below).

### 5. Set up Cloudinary

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. Go to **Settings → Upload** and create an **unsigned upload preset** (e.g., `madeit_unsigned`).
3. Add your cloud name and preset to `.env`.

### 6. Run locally

**Option A: Frontend only** (Vite dev server with API proxy)

```bash
npm run dev
```

This starts the Vite dev server with the built-in `vercelApiDevPlugin` that proxies `/api/*` routes. This is sufficient for most development.

**Option B: Frontend + Express server** (concurrent)

```bash
npm run dev:all
```

This runs both `vite` and `node server/index.js` concurrently.

**Option C: Express server only**

```bash
npm run server
```

The Express server runs on port `3001` by default.

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Environment Variables

| Variable                       | Purpose                                         | Required |
| ------------------------------ | ----------------------------------------------- | -------- |
| `VITE_SUPABASE_URL`           | Supabase project URL                             | ✅       |
| `VITE_SUPABASE_ANON_KEY`     | Supabase anonymous (public) API key              | ✅       |
| `SUPABASE_SERVICE_ROLE_KEY`   | Supabase service role key (server-side only)     | ✅       |
| `EMAIL_USER`                  | Gmail address for sending emails                 | ✅       |
| `EMAIL_PASS`                  | Gmail App Password (not your account password)   | ✅       |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for file uploads           | ✅       |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned upload preset name        | ✅       |
| `VITE_ADMIN_EMAIL`            | Admin email shown to users / used for notifications | Optional |
| `VITE_EMAIL`                  | Displayed contact email address                  | Optional |
| `VITE_APP_URL`                | Production app URL (used in email links)         | Optional |
| `ADMIN_EMAIL`                 | Server-side admin email fallback                 | Optional |

> ⚠️ **Security**: Variables prefixed with `VITE_` are exposed to the browser. Never put secrets (service role keys, passwords) in `VITE_`-prefixed variables. The `SUPABASE_SERVICE_ROLE_KEY`, `EMAIL_USER`, and `EMAIL_PASS` are only used server-side.

---

## 📜 Available Scripts

| Command            | Description                                       |
| ------------------ | ------------------------------------------------- |
| `npm run dev`      | Start Vite dev server with API proxy (port 5173)  |
| `npm run server`   | Start Express email server (port 3001)            |
| `npm run dev:all`  | Run Vite + Express concurrently                   |
| `npm run build`    | Build production bundle                           |
| `npm run preview`  | Preview production build locally                  |
| `npm run lint`     | Run ESLint                                        |

---

## 🗄 Database Schema

The Supabase PostgreSQL database consists of 6 tables:

| Table                    | Purpose                                              |
| ------------------------ | ---------------------------------------------------- |
| `users`                  | User profiles, onboarding state, projects, settings (JSONB) |
| `analytics`              | Portfolio view counts, interaction tracking, sessions |
| `recruiter_inquiries`    | Messages from recruiters to portfolio owners         |
| `support_tickets`        | User-submitted support tickets                       |
| `feedback`               | User feedback on milestones and projects             |
| `cohort_applications`    | Cohort registration sign-ups                         |

All tables have **Row Level Security** (RLS) enabled. The full schema with indexes and policies is in [`supabase/schema.sql`](supabase/schema.sql).

---

## 🔐 Authentication

MadeIt uses **Supabase Auth** with two providers:

1. **Email/Password** — Sign up with email, password (min 6 chars), and optional full name. Email confirmation may be required depending on Supabase project settings.
2. **Google OAuth** — Sign in with Google via Supabase's built-in OAuth flow.

### Auth Flow

1. User signs up / signs in → Supabase session created
2. `AuthContext` subscribes to auth state changes
3. On first login, a user record is auto-created in the `users` table via `createUserIfNotExists`
4. If the user's profile is incomplete (`onboarding.profileCompleted === false`), they're redirected to `/profile-setup`
5. Protected routes enforce authentication; `ProjectOwnerRoute` validates project ownership

### Route Protection

| Guard               | Behavior                                                   |
| -------------------- | ---------------------------------------------------------- |
| `ProtectedRoute`    | Requires authentication; redirects to `/login` if not logged in |
| `PublicOnlyRoute`   | Only for unauthenticated users; redirects to `/dashboard` if logged in |
| `ProjectOwnerRoute` | Requires auth + project ownership or admin status          |
| `AdminRoute`        | Requires admin flag (`is_admin = true`)                    |
| `OptionalAuthRoute` | Works with or without authentication (public portfolios)   |

---

## 📡 API Endpoints

The API runs as Vercel Serverless Functions in production and via a Vite dev plugin or Express server locally.

| Method | Endpoint             | Description                          |
| ------ | -------------------- | ------------------------------------ |
| `POST` | `/api/send-email`    | Send transactional emails (10 types: welcome, projectSelection, milestoneSubmitAdmin, milestoneVerified, milestoneRejected, milestoneFlagged, cohortApplicationUser, cohortApplicationAdmin, supportTicketUser, supportTicketAdmin) |
| `POST` | `/api/contact`       | Contact form submission (sends admin notification + user auto-reply) |
| `POST` | `/api/support-ticket`| Submit support ticket (sends admin notification + user confirmation) |
| `GET`  | `/api/health`        | Health check                         |

---

## 🚀 Deployment

MadeIt is configured for deployment on **Vercel**.

### Deploy to Vercel

1. Push your code to a GitHub repository.
2. Import the project in [Vercel](https://vercel.com).
3. Add all [environment variables](#-environment-variables) in Vercel's project settings.
4. Vercel will auto-detect the Vite build and serverless functions in `/api`.
5. The `vercel.json` handles routing rewrites for the SPA and API.

### Vercel Routing

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🗺 Client-Side Routes

| Path                    | Access      | Description                    |
| ----------------------- | ----------- | ------------------------------ |
| `/`                     | Public only | Landing page                   |
| `/login`                | Public only | Login / Sign up                |
| `/about`                | Public      | About page                     |
| `/contact-us`           | Public      | Contact form                   |
| `/documentation`        | Public      | Platform documentation         |
| `/privacy-policy`       | Public      | Privacy policy                 |
| `/terms-of-service`     | Public      | Terms of service               |
| `/cohort`               | Public      | Cohort registration            |
| `/portfolio/:username`  | Public      | Public portfolio view          |
| `/profile-setup`        | Protected   | Profile onboarding             |
| `/dashboard`            | Protected   | User dashboard                 |
| `/projects`             | Protected   | Browse and select projects     |
| `/projects/:projectId`  | Protected   | Project detail + milestones    |
| `/portfolio`            | Protected   | Own portfolio management       |
| `/support`              | Protected   | Support ticket system          |

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private. All rights reserved.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/moin-dbud">Moin Sheikh</a>
</p>
