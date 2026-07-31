import { EventEmitter } from 'events'

export interface Job {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  prompt: string
  model: string
  provider: string
  result?: any
  error?: string
  createdAt: string
  updatedAt: string
}

class JobQueue extends EventEmitter {
  private jobs: Map<string, Job> = new Map()
  private processing: Set<string> = new Set()

  add(job: Omit<Job, 'status' | 'createdAt' | 'updatedAt'>): Job {
    const fullJob: Job = {
      ...job,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.jobs.set(job.id, fullJob)
    this.emit('added', fullJob)
    this.processNext()
    return fullJob
  }

  get(id: string): Job | undefined {
    return this.jobs.get(id)
  }

  update(id: string, updates: Partial<Job>): Job | undefined {
    const job = this.jobs.get(id)
    if (!job) return undefined
    const updated = { ...job, ...updates, updatedAt: new Date().toISOString() }
    this.jobs.set(id, updated)
    this.emit('updated', updated)
    return updated
  }

  private async processNext() {
    if (this.processing.size >= 2) return
    const pending = Array.from(this.jobs.values()).filter(j => j.status === 'pending')
    if (pending.length === 0) return
    const job = pending[0]
    this.processing.add(job.id)
    this.update(job.id, { status: 'processing' })
    this.emit('process', job)
  }

  complete(id: string, result: any) {
    this.processing.delete(id)
    this.update(id, { status: 'completed', result })
    this.processNext()
  }

  fail(id: string, error: string) {
    this.processing.delete(id)
    this.update(id, { status: 'failed', error })
    this.processNext()
  }

  getAll(): Job[] {
    return Array.from(this.jobs.values()).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }
}

export const jobQueue = new JobQueue()
