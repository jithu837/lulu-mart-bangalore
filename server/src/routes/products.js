import { Router } from 'express'
import Product from '../models/Product.js'

const router = Router()

// GET /api/products?category=Ice%20Cream&q=mango
router.get('/', async (req, res) => {
  try {
    const { category, q } = req.query
    const filter = {}
    if (category) filter.category = category
    if (q) filter.name = { $regex: q, $options: 'i' }
    const products = await Product.find(filter).sort({ createdAt: 1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products', details: err.message })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product', details: err.message })
  }
})

export default router
