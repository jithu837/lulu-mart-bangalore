import Razorpay from 'razorpay'

let instance = null

// Lazily create the Razorpay client so a missing key only breaks the
// payment routes (not the whole server) if env vars aren't set yet.
export function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set in the server .env file')
  }
  if (!instance) {
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }
  return instance
}
