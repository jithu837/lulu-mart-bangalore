# Lulu Mart Bangalore — Ice Cream Counter (Full Stack)

A full-stack MERN-style app for **in-mart shopping only**: browse the
full Ibaco product range (backed by MongoDB via an Express API), add
items to a cart, and pay the bill by scanning a UPI QR code or paying
cash at the counter. There is no online ordering or delivery — this is
built for browsing and billing while physically in the store.

```
lulu-mart-bangalore/
├── client/   React + Vite frontend
└── server/   Express + MongoDB (Mongoose) backend
```

## Prerequisites

- Node.js 18+
- A MongoDB instance — either local (`mongod` running on
  `mongodb://127.0.0.1:27017`) or a free cluster on MongoDB Atlas

## 1. Set up the server

```bash
cd server
npm install
cp .env.example .env
# edit .env if your MongoDB URI or port differs
npm run seed   # populates MongoDB with all 70 Ibaco products
npm run dev    # starts the API on http://localhost:5000
```

## 2. Set up the client

In a second terminal:

```bash
cd client
npm install
cp .env.example .env
# edit .env if your API runs somewhere other than localhost:5000
npm run dev    # starts the app on http://localhost:5173
```

Open `http://localhost:5173` — products now load from MongoDB through
the Express API instead of a static file.

## API endpoints

| Method | Path                    | Description                             |
|--------|--------------------------|------------------------------------------|
| GET    | `/api/products`          | List products (`?category=`, `?q=`)      |
| GET    | `/api/products/:id`      | Get one product                          |
| POST   | `/api/orders`             | Create a pending order from the cart     |
| GET    | `/api/orders/:id`         | Get an order                             |
| PATCH  | `/api/orders/:id/pay`     | Mark an order paid (`{ paymentMethod }`) |

Orders are created (status `pending`) as soon as the Pay Bill screen
loads, then updated to `status: "paid"` once the customer confirms
payment — so every bill is recorded in MongoDB, paid or not.

## Product range (Ibaco only)

- **29 Ice Creams** — signature scoop flavours
- **12 Ice Cream Cakes** — celebration cakes serving 6–20
- **26 Chocolates** — ganache, marzipan, bar chocolates and more
- **3 Cold Brews** — coffee, mocha, matcha

Run `npm run seed` in `server/` any time to reset the database back to
this full catalogue. Signature Cones, Signature Bars and Milkshakes
aren't included — those are "build your own" pages on Ibaco's site
with no fixed product list.

## Pricing

Ibaco doesn't publish official prices, so every price in the seed data
is a **typical mart estimate** for demo purposes (marked with a `*` on
each product) — not a confirmed shelf price. Edit
`server/src/seed/data.js` and re-run `npm run seed` to use real prices.

## Paying the bill — UPI QR code

The Pay Bill page lets the customer choose **UPI** or **Cash**:

- **UPI** generates a QR code on the fly with the order total already
  encoded (`upi://pay?...&am=<total>`), so scanning it with Google Pay,
  PhonePe, Paytm, Navi, etc. opens the app with the amount pre-filled.
- **Cash** skips the QR and lets counter staff confirm once cash is
  physically received.

**Important limitation:** this app has no payment gateway connected,
so it cannot verify a real UPI payment automatically. The "I've
completed the payment" / "Confirm Cash Received" buttons are what mark
the order `paid` in MongoDB. A production version would connect the
QR flow to a real gateway (Razorpay, Cashfree, PayU, etc.) so a
server-side webhook confirms payment and updates the order for real.

## What's included

- **Backend**: Express API + Mongoose models (`Product`, `Order`),
  seed script, CORS configured for the Vite dev server
- **Frontend pages**: Home, Ice Creams, Ice Cream Cakes, Chocolates,
  Cold Brews, About, Contact, Wishlist, Cart, Pay Bill, 404
- **State**: Cart & Wishlist in React Context + localStorage (client
  side); Orders persisted in MongoDB (server side)
- **No animation libraries** — plain CSS only

## Design tokens

| Role | Hex |
|---|---|
| Background (cream) | `#FBF3E1` |
| Card surface | `#FFFCF5` |
| Panel (parchment) | `#F3E6C8` |
| Primary (burgundy) | `#7A1F2B` |
| Accent (brass gold) | `#B8892B` |
| Ink (text) | `#34241A` |

Fonts: **Playfair Display** (headings) + **Work Sans** (body/UI).

## Data source

Product names, image URLs and short descriptions in
`server/src/seed/data.js` are adapted from Ibaco's own product pages
(ice-cream-sundaes.php, ice-cream-cakes.php, chocolates.php,
coldbrews.php). Prices are estimates added for this demo.

This is an unofficial demo, not affiliated with or endorsed by Ibaco,
Hatsun Agro Product Ltd, or Lulu Group / Lulu Mart.
