import { Router } from 'express'
import Transaction from '../models/Transaction.js'

const router = Router()

// GET all transactions (newest first)
router.get('/', async (_req, res) => {
  try {
    const txs = await Transaction.find().sort({ date: -1 })
    res.json(txs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST — create new transaction
router.post('/', async (req, res) => {
  try {
    const tx = await Transaction.create(req.body)
    res.status(201).json(tx)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE — remove by id
router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /seed — inserts sample data if collection is empty (called on first load)
router.post('/seed', async (req, res) => {
  try {
    const count = await Transaction.countDocuments()
    if (count > 0) return res.json({ seeded: false, message: 'Data already exists' })
    const { samples } = req.body
    if (!samples || !samples.length) return res.status(400).json({ error: 'No samples provided' })
    await Transaction.insertMany(samples)
    res.json({ seeded: true, count: samples.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /all — used by "Reset data" in Settings
router.delete('/', async (_req, res) => {
  try {
    await Transaction.deleteMany({})
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
