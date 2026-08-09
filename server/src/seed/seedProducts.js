import 'dotenv/config'
import { connectDB } from '../config/db.js'
import Product from '../models/Product.js'
import { buildSeedProducts } from './data.js'
import mongoose from 'mongoose'

async function run() {
  await connectDB()
  const products = buildSeedProducts()

  await Product.deleteMany({})
  const inserted = await Product.insertMany(products)

  console.log(`Seeded ${inserted.length} products into MongoDB.`)
  await mongoose.disconnect()
  process.exit(0)
}

run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
