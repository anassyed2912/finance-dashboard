import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import transactionsRouter from './routes/transactions.js'
import settingsRouter from './routes/settings.js'

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅  Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌  MongoDB connection error:', err.message)
    process.exit(1)
  })

app.use('/api/transactions', transactionsRouter)
app.use('/api/settings', settingsRouter)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`🚀  API running on http://localhost:${PORT}`))
