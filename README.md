# Nuvora

Nuvora is a Next.js + React ecommerce MVP with a customer storefront, product details, customer account entry point, admin dashboard, and a MySQL-ready Prisma data layer.

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a MySQL database and copy `.env.example` to `.env`. Update `DATABASE_URL` with your MySQL credentials.

3. Create the database tables and generate the Prisma client:

   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000` for the storefront and `http://localhost:3000/admin` for product management.

## Aiven database

The local `.env` holds the private `DATABASE_URL` for Aiven. Keep it out of Git and never use a `NEXT_PUBLIC_` prefix for database credentials. For a hosted app, set the same variable in the hosting provider's environment settings, run `npm run db:generate` before building, and redeploy.

Prisma maps models to the existing lowercase MySQL tables. Keep these mappings to preserve compatibility with Aiven's case-sensitive table names. Review schema changes before running `db:push` against shared data; do not reset the database or accept data loss.

The connection uses `sslaccept=accept_invalid_certs` with Aiven requiring encrypted connections. This does not verify the server certificate. To enable verification, download the project's CA certificate from Aiven, make it available to the app, and use `sslcert=<certificate-path>&sslaccept=strict` instead. Certificate paths are relative to `prisma/`; see the [Prisma MySQL SSL documentation](https://docs.prisma.io/docs/orm/v6/overview/databases/mysql).

## Homepage image

Place your homepage hero image in `public/images/`. The current placeholder is `public/images/hero-placeholder.svg`. To use your own image, add a file such as `public/images/hero.jpg` and update the `src` in `src/app/page.tsx` from `/images/hero-placeholder.svg` to `/images/hero.jpg`.

## Included routes

- `/` — customer storefront
- `/products` — catalog
- `/products/[id]` — product detail
- `/account` — customer account entry point
- `/admin` — admin overview and add-product form
- `/api/products` — MySQL-backed product GET/POST API

## Firebase Authentication

Customer and seller registration, sign-in, and password reset use Firebase Authentication.
Profiles, carts, orders, and role membership remain in MySQL. Firebase UIDs, not email
addresses or browser-provided roles, bind identities to those profiles. An email can
have both roles, using the same Firebase password. Registration never overwrites an
existing profile or password.

### Setup

1. In the Firebase console, create/select your project and enable **Authentication >
   Sign-in method > Email/Password**. Register a Web app and copy its API key.
2. In **Project settings > Service accounts**, generate an Admin SDK service account
   key. Set `FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and
   `FIREBASE_PRIVATE_KEY` in your local `.env` and hosting environment. Use the same
   project for all values. The private key may contain literal `\n` escapes. Never
   commit this key or put it in a `NEXT_PUBLIC_` variable.
3. Apply the two nullable unique `firebaseUid` columns to the existing database with
   `npm run db:push`, then run `npm run db:generate`. Review the proposed changes on
   shared databases; do not accept data loss. No existing tables need to be reset.
4. Restart the app. In Firebase Authentication's email templates, configure the
   password reset email branding. Keep Firebase's default hosted action handler:
   users choose their new password there and return to Nuvora to sign in.

Sessions last five days and use HTTP-only cookies. Every authenticated request checks
Firebase revocation and the local role, so disabled users and password resets invalidate
access. Old database-only sessions require a fresh sign-in after this change.

### Existing accounts

Existing users migrate on their first successful sign-in with their original password.
The server verifies the legacy bcrypt hash, creates a Firebase identity only if one
is absent, authenticates with Firebase, and binds the UID without changing profile data.
After linking, the legacy password hash is cleared. If that email already belongs to a
Firebase user with a different password, both accounts need administrator-assisted
migration; the app does not overwrite either password or automatically link by email.
Legacy users who forgot their password before migration also need administrator-assisted
migration/import before Firebase can send a reset email. If both customer and seller
profiles exist, sign in to each role to migrate each profile.

### Verification

Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`. With a configured test
Firebase project and database, verify customer and seller registration, duplicate-email
rejection, invalid credentials, both roles for one email, old-account migration, sign-out,
and a reset email end to end. After resetting, verify the old password and an existing
session no longer grant access. Also test a disabled Firebase user and inactive seller.

Implementation references: [Firebase Auth REST API](https://firebase.google.com/docs/reference/rest/auth)
and [Firebase session cookies](https://firebase.google.com/docs/auth/admin/manage-cookies).
