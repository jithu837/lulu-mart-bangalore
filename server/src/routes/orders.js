import { Router } from 'express'
import crypto from 'node:crypto'
import Order from '../models/Order.js'
import { getRazorpay } from '../config/razorpay.js'

const router = Router()

// POST /api/orders  — create a pending order from the cart
router.post('/', async (req, res) => {
  try {
    const { items, subtotal, gst = 0, grandTotal } = req.body
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must include at least one item' })
    }
    const order = await Order.create({ items, subtotal, gst, grandTotal })
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order', details: err.message })
  }
})

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message })
  }
})

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order', details: err.message })
  }
})

// PATCH /api/orders/:id/pay — mark an order as paid
router.patch('/:id/pay', async (req, res) => {
  try {
    const { paymentMethod } = req.body
    if (!['upi', 'cash'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'paymentMethod must be "upi" or "cash"' })
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentMethod, status: 'paid', paidAt: new Date() },
      { new: true }
    )
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order', details: err.message })
  }
})

// POST /api/orders/:id/razorpay-order — create a Razorpay order for this bill.
// The amount is taken from the order stored in MongoDB (never trust an
// amount sent from the client) so it can't be tampered with in the browser.
router.post('/:id/razorpay-order', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })
    if (order.status === 'paid') return res.status(400).json({ error: 'Order is already paid' })

    const razorpay = getRazorpay()
    const rpOrder = await razorpay.orders.create({
      amount: Math.round(order.grandTotal * 100), // paise
      currency: 'INR',
      receipt: order._id.toString(),
      notes: { orderId: order._id.toString() },
    })

    order.razorpayOrderId = rpOrder.id
    await order.save()

    res.json({
      razorpayOrderId: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Razorpay order', details: err.message })
  }
})

// POST /api/orders/:id/razorpay-verify — verify the payment signature
// Razorpay Checkout returns to the browser, then mark the order paid.
// This is the ONLY place an order should be marked paid via Razorpay —
// the signature check proves the payment genuinely happened.
router.post('/:id/razorpay-verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing Razorpay payment fields' })
    }

    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })
    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ error: 'Order/payment mismatch' })
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed — invalid signature' })
    }

    order.status = 'paid'
    order.paymentMethod = 'razorpay'
    order.razorpayPaymentId = razorpay_payment_id
    order.paidAt = new Date()
    await order.save()

    res.json(order)
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify Razorpay payment', details: err.message })
  }
})

export default router
