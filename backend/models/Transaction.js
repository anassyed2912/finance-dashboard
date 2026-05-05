import mongoose from 'mongoose'

const TransactionSchema = new mongoose.Schema(
  {
    type:        { type: String, enum: ['income', 'expense'], required: true },
    amount:      { type: Number, required: true },
    category:    { type: String, default: null },
    description: { type: String, default: '' },
    date:        { type: String, required: true },
    month:       { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('Transaction', TransactionSchema)
