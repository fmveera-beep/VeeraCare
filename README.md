# VeeraCare

Marketing site + contact/CTA intake for VeeraCare, built with Next.js (App Router), Prisma, and Postgres.

## Tech stack

- **Next.js** 14 (React 18, App Router)
- **Prisma** (schema + client)
- **PostgreSQL** (e.g. Neon)
- **Nodemailer** (SMTP email sending)
- **Tailwind CSS** + UI components

## Requirements

- **Node.js** 18+ (recommended)
- A **PostgreSQL** database URL (local Postgres or hosted like Neon)

## Getting started

Install deps:

```bash
npm install
```

Note: this repo pins **`legacy-peer-deps`** (via `.npmrc`) because `@neondatabase/auth` currently declares a Next.js peer range newer than Next 14; the integration still builds and runs on Next 14.

Create a local env file:

- Create `.env` in the project root.
- Add the variables below.

Then sync the database schema and start dev server:

```bash
npm run db:push
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

### Required (core app)

- **`DATABASE_URL`**: Postgres connection string used by Prisma.

### CMS admin (Neon Auth)

Neon Console → your branch → **Auth**: enable sign-in with email and Email OTP (see [Neon Auth docs](https://neon.com/docs/auth/guides/plugins/email-otp)).

- **`NEON_AUTH_BASE_URL`**: Auth URL from Neon Auth configuration.
- **`NEON_AUTH_COOKIE_SECRET`**: Random string **32+ characters** used to sign session cache cookies (`openssl rand -base64 32`).
- **`SOURCE_ADMIN_EMAILS`** (in `src/lib/neon-auth/adminEmails.ts`): Comma-separated allowlist checked into the repo.
- **`ADMIN_EMAIL`** (optional env): Comma-separated **additional** admins merged with `SOURCE_ADMIN_EMAILS` (useful on Vercel without redeploying).

Optional:

- **`NEXT_PUBLIC_ADMIN_EMAIL`**: Comma-separated hint list for the login UI (optional pre-check before OTP).

### Email (SMTP) — optional but recommended

The CTA form can send an email notification when a request is submitted.

- **`OWNER_NOTIFY_EMAIL`**: Where CTA notifications are delivered.
- **`SMTP_HOST`**: SMTP host (e.g. `smtp.gmail.com`).
- **`SMTP_PORT`**: `587` (STARTTLS) or `465` (TLS).
- **`SMTP_USER`**: SMTP username (often an email address).
- **`SMTP_PASS`**: SMTP password (for Gmail, this should be an **App Password**).
- **`SMTP_FROM`**: From header, e.g. `VeeraCare <no-reply@veeracare.com>`.

### Images (optional)

- **`DISABLE_IMAGE_OPTIMIZATION`**: Set to `true` to disable Next image optimization (uses `images.unoptimized` in `next.config.mjs`).

## Key pages

- **Home**: `src/app/page.tsx`
- **Contact**: `src/app/contact/page.tsx`
- **Services**: `src/app/services/page.tsx`
- **Solutions**:
  - `src/app/solutions/contract-staffing/page.tsx`
  - `src/app/solutions/direct-hire/page.tsx`

## CTA request flow (database + email)

1. The CTA form posts JSON to **`POST /api/cta-request`**.
2. The server validates input and saves it to Postgres via Prisma (`StaffRequest`).
3. If SMTP + recipient inbox are configured, it sends a notification email via Nodemailer.

Relevant files:

- API route: `src/app/api/cta-request/route.ts`
- Email helper: `src/lib/email/cta.ts`
- Prisma client: `src/lib/prisma.ts`
- Schema: `prisma/schema.prisma`

### SMTP behavior

The email sender configures Nodemailer like this:

- `secure: SMTP_PORT === 465`
- STARTTLS is used automatically on `587` when supported by the server.

If SMTP auth fails, the request is still saved to the DB, and the API returns success with email flags:

- `emailSent: true|false`
- `emailSkipped: true|false`
- `emailError` (only when email sending fails)

## Scripts

- **`npm run dev`**: start dev server
- **`npm run dev:clean`**: clear caches, then dev
- **`npm run build`**: generate Prisma client, then build
- **`npm run start`**: run production server
- **`npm run lint`**: lint
- **`npm run db:push`**: push Prisma schema to DB
- **`npm run db:migrate`**: run migrations (if using migrations)

## Notes

- **Do not commit `.env`** (secrets).
- On Windows dev, `next.config.mjs` uses an in-memory webpack cache for stability.

