import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Ice Cream', 'Ice Cream Cake', 'Chocolate', 'Cold Brew'],
    },
    group: { type: String }, // sub-group, used for Chocolates (Ganache, Marzipan, etc.)
    serves: { type: String }, // used for Ice Cream Cakes (e.g. "6 Serve")
    unit: { type: String },   // used for Ice Cream (e.g. "125 ml cup")
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    isEstimate: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Product', productSchema)
