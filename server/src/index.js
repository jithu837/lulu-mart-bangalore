import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import Product from './models/Product.js'
import { buildSeedProducts } from './seed/data.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000
const ALLOWED_ORIGINS = process.env.CLIENT_ORIGIN?.split(',').map(s => s.trim()) || ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes('*')) return callback(null, true)
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) return callback(null, true)
    if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com') || origin.endsWith('.netlify.app')) return callback(null, true)
    callback(null, true)
  }
}))
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }))
// Temporary debug route to inspect the running Razorpay key ID on the server.
// This returns only the public `key_id` (NOT the secret). Remove after verification.
app.get('/api/debug/razorpay-key', (req, res) => {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || null
    res.json({ keyId })
  } catch (err) {
    res.status(500).json({ error: 'Failed to read env var' })
  }
})
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

// Serve static frontend in production if built
const clientDistPath = path.join(__dirname, '../../client/dist')
app.use(express.static(clientDistPath))

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' })
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).json({ error: 'Not found' })
    }
  })
})

async function autoSeedIfEmpty() {
  try {
    const count = await Product.countDocuments()
    if (count === 0) {
      console.log('No products found in DB. Auto-seeding database...')
      const seedData = buildSeedProducts()
      await Product.insertMany(seedData)
      console.log(`Auto-seeded ${seedData.length} products.`)
    }
  } catch (err) {
    console.error('Auto-seed check failed:', err.message)
  }
}

connectDB()
  .then(async () => {
    await autoSeedIfEmpty()
    app.listen(PORT, () => console.log(`Lulu Mart Bangalore API running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  })


