# Deployment Notes — Fixes Applied (Aug 2026)

## 🔴 1. URGENT — Rotate your MongoDB Atlas password
`client/.env` had your real Atlas username/password/connection string sitting
in the **frontend** folder. It was never pushed to Git (it's in
`.gitignore`), but treat that password as compromised anyway and rotate it
in Atlas → Database Access before deploying.

**Rule going forward:** database credentials only ever go in `server/.env`.
The client never needs (or should have) a database connection string —
it only talks to your Express API over HTTP.

## 🔴 2. Fixed — broken root `package.json` (build-breaking)
There was a stray, invalid `package.json` at the project root (referencing
a non-existent `index.js`, malformed JSON). Vite/esbuild was walking up to
it while resolving the project root and the production build failed with:
```
✘ [ERROR] Expected end of file in JSON but found "\"scripts\""
```
It wasn't used by anything — deleted it (along with its `package-lock.json`
and `node_modules`).

## 🔴 3. Fixed — frontend hardcoded to `localhost:5000` in production build
`client/.env` had no `VITE_API_URL`, so `client/src/api.js` fell back to
`http://localhost:5000/api` — and Vite **bakes that value into the built
JS at build time**. Once deployed, the live site would always try to call
your laptop, causing "Couldn't reach the server to record this order"
errors (this matches an error in your `.llm-chat-history` from a previous
session).

Fixed `client/.env` and `.env.example` to use `VITE_API_URL` properly.

## ✅ What you must do before/при deploying

1. **Rotate the Atlas password** (step 1 above), then put the **new**
   connection string only in `server/.env` as `MONGODB_URI`.
2. **Deploy the backend first** (Render, Railway, Fly.io, etc.):
   - Root/build dir: `server`
   - Start command: `npm start`
   - Env vars: `MONGODB_URI`, `PORT` (usually auto-set by host),
     `CLIENT_ORIGIN` = your deployed frontend URL (e.g.
     `https://your-app.vercel.app`) — this is required for CORS to allow
     your live frontend to call the API.
   - Run `npm run seed` once (locally against the Atlas URI, or via a
     one-off job) to populate products.
3. **Deploy the frontend** (Vercel, Netlify, etc.):
   - Root/build dir: `client`
   - Build command: `npm run build`, output dir: `dist`
   - Env var: `VITE_API_URL` = your deployed backend URL + `/api`
     (e.g. `https://your-api.onrender.com/api`) — **set this in the
     host's dashboard, not just in `.env`**, since most hosts don't read
     your local `.env` file; they inject build-time env vars themselves.
4. Redeploy the frontend any time `VITE_API_URL` changes — it's baked in
   at build time, not read at runtime.

## 💳 Razorpay integration (added)

Real payment verification is now wired up, replacing the old "just tap a
button to say you paid" flow for online payments:

- **Backend**: `server/src/config/razorpay.js` (client setup) +
  two new routes in `server/src/routes/orders.js`:
  - `POST /api/orders/:id/razorpay-order` — creates a Razorpay order using
    the **server-stored** `grandTotal` (never trusts an amount from the
    browser).
  - `POST /api/orders/:id/razorpay-verify` — verifies the payment
    signature with HMAC-SHA256 using your key secret, and only then marks
    the order `paid` in MongoDB.
- **Frontend**: `client/src/pages/Bill.jsx` has a new **"Pay Online"**
  option that opens Razorpay's hosted Checkout (UPI, cards, netbanking,
  wallets all in one). The old static UPI QR code option is still there
  too ("UPI (direct)") since it needs no Razorpay account — useful as a
  fallback.
- The Razorpay Checkout script tag was added to `client/index.html`.

### To activate it

1. Sign up at [dashboard.razorpay.com](https://dashboard.razorpay.com) and
   grab your **Test** keys first: Settings → API Keys.
2. Put them in `server/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_test_key_secret
   ```
3. Test locally with Razorpay's [test card/UPI numbers](https://razorpay.com/docs/payments/payments/test-card-details/)
   — no real money moves in test mode.
4. Before going live: complete Razorpay's KYC/business activation, then
   swap in your **Live** keys (`rzp_live_...`) as env vars on your
   **backend host** (Render/Railway/etc. dashboard — not committed to
   Git). The frontend never sees your key secret, only the public
   `key_id`, so no extra config is needed on the frontend host for this.
5. `RAZORPAY_KEY_SECRET` must stay server-side only — never put it in
   `client/.env` or any frontend code.

## Verified locally
- `server`: fresh `npm install` — no errors; all files pass `node --check`.
- `client`: fresh `npm install` — no errors; `npm run build` succeeds
  and correctly bakes in whatever `VITE_API_URL` is set at build time.
