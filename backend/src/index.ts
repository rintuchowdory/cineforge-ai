import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import generateRoutes from './routes/generate.js'
import webhookRoutes from './routes/webhook.js'
import statusRoutes from './routes/status.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env') })

const app = express()
const PORT = process.env.PORT || 10000

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/generate', generateRoutes)
app.use('/api/webhook', webhookRoutes)
app.use('/api/status', statusRoutes)

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Error:', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log('🚀 CineForge API running on port ' + PORT)
})
