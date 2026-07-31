import { Router } from 'express'

const router = Router()

router.get('/providers', (_req, res) => {
  res.json({
    providers: {
      replicate: {
        configured: !!process.env.REPLICATE_API_TOKEN,
        name: 'Replicate',
        models: ['wan-2.1', 'cogvideox', 'mochi', 'ltx-video', 'hunyuan'],
      }
    }
  })
})

router.get('/models', (_req, res) => {
  res.json({
    models: [
      { id: 'wan-2.1', name: 'Wan 2.1', provider: 'replicate', description: 'Alibaba open-source video model', maxDuration: 10, free: true },
      { id: 'cogvideox', name: 'CogVideoX', provider: 'replicate', description: 'THUDM open-source', maxDuration: 6, free: true },
      { id: 'hunyuan', name: 'HunyuanVideo', provider: 'replicate', description: 'Tencent open-source', maxDuration: 8, free: true },
      { id: 'ltx-video', name: 'LTX-Video', provider: 'replicate', description: 'Lightricks real-time', maxDuration: 5, free: true },
      { id: 'mochi', name: 'Mochi 1', provider: 'replicate', description: 'Genmo open-source', maxDuration: 5, free: true },
    ]
  })
})

export default router
