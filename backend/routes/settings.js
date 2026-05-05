import { Router } from 'express'
import Settings from '../models/Settings.js'

const router = Router()

// GET settings 
router.get('/', async (_req, res) => {
  try {
    let s = await Settings.findOne({ userId: 'default' })
    if (!s) s = await Settings.create({ userId: 'default' })
    res.json(s)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT — update settings
router.put('/', async (req, res) => {
  try {
    const s = await Settings.findOneAndUpdate(
      { userId: 'default' },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    )
    res.json(s)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
