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

## Homepage image

Place your homepage hero image in `public/images/`. The current placeholder is `public/images/hero-placeholder.svg`. To use your own image, add a file such as `public/images/hero.jpg` and update the `src` in `src/app/page.tsx` from `/images/hero-placeholder.svg` to `/images/hero.jpg`.

## Included routes

- `/` — customer storefront
- `/products` — catalog
- `/products/[id]` — product detail
- `/account` — customer account entry point
- `/admin` — admin overview and add-product form
- `/api/products` — MySQL-backed product GET/POST API
