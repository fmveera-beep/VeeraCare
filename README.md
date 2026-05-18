# VeeraCare

Marketing site, contact/CTA intake, and a small **CMS** for services and industries—built with Next.js (App Router), Prisma, Postgres, and **Neon Auth** (email OTP) for admin access.

## Tech stack

- **Next.js** 14 (React 18, App Router)
- **Prisma** (schema + client)
- **PostgreSQL** (Neon recommended)
- **Neon Auth** (`@neondatabase/auth`) — managed auth + **email OTP** for `/admin`
- **Nodemailer** (SMTP) — CTA / contact notifications only (not CMS OTP; Neon sends those)
- **Tailwind CSS** + UI components

## Requirements

- **Node.js** 18+
- A **PostgreSQL** `DATABASE_URL` (e.g. Neon)

## Getting started

Install dependencies:

```bash
npm install
```

This repo uses **`legacy-peer-deps`** (see `.npmrc`) because `@neondatabase/auth` declares a Next.js peer range newer than Next 14; the app still builds and runs on Next 14.

Create `.env` in the project root (copy from `.env.example` and fill values). Then sync the database and run the dev server:

```bash
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy **`.env.example`** → **`.env`**. Do not commit `.env`.

### Required (core app)

| Variable | Purpose |
|----------|---------|
| **`DATABASE_URL`** | Postgres connection string for Prisma |

### CMS admin (Neon Auth)

Configure Auth in the Neon Console: branch → **Auth** → enable **email sign-in** and **Email OTP** ([Email OTP plugin](https://neon.com/docs/auth/guides/plugins/email-otp)). OTP emails are sent by **Neon**, not your VeeraCare `SMTP_*` settings.

| Variable | Purpose |
|----------|---------|
| **`NEON_AUTH_BASE_URL`** | Auth base URL from Neon (Auth → Configuration) |
| **`NEON_AUTH_COOKIE_SECRET`** | Random string **≥ 32 characters** for signing session cache cookies (`openssl rand -base64 32`) |

Optional:

| Variable | Purpose |
|----------|---------|
| **`ADMIN_EMAIL`** | Comma-separated **extra** CMS admin emails, **merged** with the in-repo list (see below). Handy on Vercel without redeploying. |
| **`NEXT_PUBLIC_ADMIN_EMAIL`** | Comma-separated hint list for the login UI (optional client-side pre-check before requesting OTP) |

### Admin allowlist (who can open `/admin/dashboard`)

The CMS allowlist is the **union** of:

1. **`SOURCE_ADMIN_EMAILS`** in **`src/lib/neon-auth/adminEmails.ts`** — comma-separated, version-controlled defaults.
2. **`ADMIN_EMAIL`** from the environment (if set) — additional addresses, same comma-separated format.

Each address must be a user you can sign in as via Neon Auth (OTP to that inbox). If sign-in works but the dashboard rejects you, add the **exact** email Neon returns for that user to `SOURCE_ADMIN_EMAILS` and/or `ADMIN_EMAIL`.

### Email (SMTP) — CTA / contact only

Used when someone submits the hiring/worker CTA form (`POST /api/cta-request`), not for CMS login codes.

| Variable | Purpose |
|----------|---------|
| **`OWNER_NOTIFY_EMAIL`** | Inbox for CTA notifications |
| **`SMTP_HOST`**, **`SMTP_PORT`**, **`SMTP_USER`**, **`SMTP_PASS`**, **`SMTP_FROM`** | Nodemailer transport |

### Images (optional)

| Variable | Purpose |
|----------|---------|
| **`DISABLE_IMAGE_OPTIMIZATION`** | Set to `true` to disable Next image optimization (`next.config.mjs`) |

## Neon Auth checklist (production)

- [Configure trusted domains](https://neon.com/docs/auth/guides/configure-domains) for your production URL.
- For reliable OTP delivery, use **Custom SMTP** under Neon Auth ([production checklist](https://neon.com/docs/auth/production-checklist#email-provider)); shared Neon mail can rate-limit or land in spam.
- For local dev, keep **Allow Localhost** enabled in Neon Auth settings ([localhost access](https://neon.com/docs/auth/production-checklist#localhost-access)).

## CMS routes

| Path | Description |
|------|-------------|
| **`/admin/login`** | Email OTP sign-in (Neon Auth client) |
| **`/admin/dashboard`** | Protected shell (Neon session + allowlist) |
| **`/admin/dashboard/services`** | CRUD CMS services |
| **`/admin/dashboard/industries`** | CRUD CMS industries |
| **`/admin/dashboard/settings`** | Local preferences + destructive CMS actions |

API:

- **`/api/auth/[...path]`** — Neon Auth proxy (session cookies)
- **`/api/admin/me`** — Returns 200 only if session user is in the allowlist
- **`/api/admin/services`**, **`/api/admin/industries`** — CRUD (allowlist required)

Relevant code:

- `src/lib/neon-auth/server.ts` — `createNeonAuth` singleton
- `src/lib/neon-auth/client.ts` — browser auth client
- `src/lib/neon-auth/adminEmails.ts` — `SOURCE_ADMIN_EMAILS` + env merge
- `middleware.ts` — protects `/admin/dashboard/*` with Neon middleware

## Key marketing pages

- **Home**: `src/app/page.tsx`
- **Contact**: `src/app/contact/page.tsx`
- **Services**: `src/app/services/page.tsx`
- **Solutions**: `src/app/solutions/contract-staffing/page.tsx`, `src/app/solutions/direct-hire/page.tsx`

## CTA request flow (database + email)

1. The CTA form posts JSON to **`POST /api/cta-request`**.
2. The server validates input and saves to Postgres via Prisma (`StaffRequest`).
3. If SMTP + recipient are configured, Nodemailer sends a notification.

Files: `src/app/api/cta-request/route.ts`, `src/lib/email/cta.ts`, `src/lib/prisma.ts`, `prisma/schema.prisma`.

If SMTP fails, the row is still stored; the API returns success with `emailSent` / `emailSkipped` / `emailError` as appropriate.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run dev:clean` | Clear caches, then dev |
| `npm run build` | Prisma generate + production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run db:push` | Push Prisma schema to the database |
| `npm run db:migrate` | Migrations (if using migrate workflow) |

## Notes

- **Do not commit `.env`** (secrets).
- On Windows dev, `next.config.mjs` uses an in-memory webpack cache for stability.
- Set the same **`NEON_AUTH_*`**, **`DATABASE_URL`**, **`ADMIN_EMAIL`**, and allowlist-related env on **Vercel** (or your host) as in local `.env`.
