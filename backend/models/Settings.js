import mongoose from 'mongoose'

const SettingsSchema = new mongoose.Schema(
  {
    userId:        { type: String, default: 'default', unique: true },
    userName:      { type: String, default: 'there' },
    savingsGoal:   { type: Number, default: 5000 },
    savingsSaved:  { type: Number, default: 1200 },
    monthlyBudget: { type: Number, default: 2500 },
  },
  { timestamps: true }
)

export default mongoose.model('Settings', SettingsSchema)
