import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
})

const MODELS: Record<string, string> = {
  'wan-2.1': 'wavespeedai/wan-2.1-i2v-720p',
  'cogvideox': 'thudm/cogvideox-5b',
  'mochi': 'genmoai/mochi-1-preview',
  'ltx-video': 'lightricks/ltx-video',
  'hunyuan': 'tencent/hunyuan-video',
}

export async function generateVideo(prompt: string, modelId: string = 'wan-2.1', options: any = {}) {
  const model = MODELS[modelId] || MODELS['wan-2.1']
  const input: any = {
    prompt,
    num_frames: options.duration ? Math.min(options.duration * 8, 81) : 81,
    fps: 8,
  }
  if (options.imageUrl) input.image = options.imageUrl
  if (options.aspectRatio) {
    const [w, h] = options.aspectRatio.split(':').map(Number)
    input.width = w > h ? 720 : 480
    input.height = w > h ? 480 : 720
  }
  console.log(`[Replicate] Starting ${modelId}: ${prompt.slice(0, 80)}...`)
  const output = await replicate.run(model as any, { input })
  const videoUrl = Array.isArray(output) ? output[0] : output
  return {
    success: true,
    videoUrl: typeof videoUrl === 'string' ? videoUrl : null,
    model: modelId,
    provider: 'replicate',
  }
}
