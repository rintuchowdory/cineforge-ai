import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { jobQueue } from '../queue.js'
import * as replicateService from '../services/replicate.js'

const router = Router()

const MODEL_MAP: Record<string, { provider: string; modelId: string }> = {
  'veo-3-1': { provider: 'replicate', modelId: 'wan-2.1' },
  'kling-3-0': { provider: 'replicate', modelId: 'hunyuan' },
  'runway-gen-4-5': { provider: 'replicate', modelId: 'cogvideox' },
  'pika-2-5': { provider: 'replicate', modelId: 'ltx-video' },
  'luma-ray-3': { provider: 'replicate', modelId: 'wan-2.1' },
  'seedance-2-0': { provider: 'replicate', modelId: 'mochi' },
}

router.post('/', async (req, res) => {
  try {
    const { prompt, model: frontendModelId, duration, aspectRatio, imageUrl } = req.body
    if (!prompt || !frontendModelId) {
      res.status(400).json({ error: 'Missing prompt or model' })
      return
    }
    const jobId = uuidv4()
    const mapping = MODEL_MAP[frontendModelId] || { provider: 'replicate', modelId: 'wan-2.1' }
    const job = jobQueue.add({
      id: jobId,
      prompt,
      model: mapping.modelId,
      provider: mapping.provider,
    })
    processJob(job, { duration, aspectRatio, imageUrl })
    res.status(202).json({
      success: true,
      jobId,
      status: 'pending',
      message: 'Video generation started',
      estimatedTime: 60,
    })
  } catch (error: any) {
    console.error('Generate error:', error)
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', (req, res) => {
  const job = jobQueue.get(req.params.id)
  if (!job) {
    res.status(404).json({ error: 'Job not found' })
    return
  }
  res.json({
    id: job.id,
    status: job.status,
    prompt: job.prompt,
    model: job.model,
    provider: job.provider,
    result: job.result,
    error: job.error,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  })
})

router.get('/', (_req, res) => {
  const jobs = jobQueue.getAll()
  res.json({ jobs })
})

async function processJob(job: any, options: any) {
  try {
    console.log(`[Queue] Processing job ${job.id} with ${job.provider}/${job.model}`)
    let result: any
    if (job.provider === 'replicate') {
      result = await replicateService.generateVideo(job.prompt, job.model, options)
    } else {
      throw new Error(`Unknown provider: ${job.provider}`)
    }
    jobQueue.complete(job.id, result)
    console.log(`[Queue] Job ${job.id} completed`)
  } catch (error: any) {
    console.error(`[Queue] Job ${job.id} failed:`, error.message)
    jobQueue.fail(job.id, error.message)
  }
}

export default router
