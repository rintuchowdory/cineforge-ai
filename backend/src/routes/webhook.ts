import { Router } from 'express'

const router = Router()

router.post('/replicate', (req, res) => {
  console.log('[Webhook] Replicate:', req.body)
  res.status(200).json({ received: true })
})

router.post('/fal', (req, res) => {
  console.log('[Webhook] Fal:', req.body)
  res.status(200).json({ received: true })
})

export default router
