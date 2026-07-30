import { create } from 'zustand'
import type { VideoProject, User, GenerationJob, ABTest, AIModel, AspectRatio } from '@/types'
import { AI_MODELS, MOCK_USER, MOCK_PROJECTS, MOCK_TRANSACTIONS, MOCK_AB_TESTS } from '@/lib/data'
import { generateId } from '@/lib/utils'

interface AppState {
  user: User
  projects: VideoProject[]
  transactions: import('@/types').CreditTransaction[]
  abTests: ABTest[]
  activeJobs: GenerationJob[]
  selectedModel: AIModel | null
  selectedAspectRatio: AspectRatio
  selectedStyle: string
  prompt: string
  duration: number
  isGenerating: boolean
  sidebarCollapsed: boolean

  // Actions
  setSelectedModel: (model: AIModel | null) => void
  setSelectedAspectRatio: (ratio: AspectRatio) => void
  setSelectedStyle: (style: string) => void
  setPrompt: (prompt: string) => void
  setDuration: (duration: number) => void
  generateVideo: () => Promise<void>
  cancelJob: (jobId: string) => void
  deleteProject: (projectId: string) => void
  toggleSidebar: () => void
  createABTest: (models: string[]) => void
}

export const useStore = create<AppState>((set, get) => ({
  user: MOCK_USER,
  projects: MOCK_PROJECTS,
  transactions: MOCK_TRANSACTIONS,
  abTests: MOCK_AB_TESTS,
  activeJobs: [],
  selectedModel: AI_MODELS[0],
  selectedAspectRatio: '16:9',
  selectedStyle: 'Cinematic',
  prompt: '',
  duration: 5,
  isGenerating: false,
  sidebarCollapsed: false,

  setSelectedModel: (model) => set({ selectedModel: model }),
  setSelectedAspectRatio: (ratio) => set({ selectedAspectRatio: ratio }),
  setSelectedStyle: (style) => set({ selectedStyle: style }),
  setPrompt: (prompt) => set({ prompt }),
  setDuration: (duration) => set({ duration }),

  generateVideo: async () => {
    const state = get()
    if (!state.selectedModel || !state.prompt.trim()) return

    const cost = Math.ceil(state.duration * state.selectedModel.costPerSecond)
    if (state.user.credits < cost) {
      alert('Insufficient credits! Please upgrade your plan.')
      return
    }

    set({ isGenerating: true })

    const projectId = generateId()
    const jobId = generateId()

    const newProject: VideoProject = {
      id: projectId,
      title: state.prompt.slice(0, 50) + (state.prompt.length > 50 ? '...' : ''),
      prompt: state.prompt,
      model: state.selectedModel,
      status: 'generating',
      duration: state.duration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creditsUsed: cost,
      aspectRatio: state.selectedAspectRatio,
      style: state.selectedStyle,
    }

    const newJob: GenerationJob = {
      id: jobId,
      projectId,
      modelId: state.selectedModel.id,
      prompt: state.prompt,
      status: 'queued',
      progress: 0,
      estimatedTime: state.duration * 12,
    }

    set({
      projects: [newProject, ...state.projects],
      activeJobs: [...state.activeJobs, newJob],
      user: { ...state.user, credits: state.user.credits - cost },
    })

    // Simulate generation progress
    const interval = setInterval(() => {
      set((s) => ({
        activeJobs: s.activeJobs.map((j) =>
          j.id === jobId
            ? { ...j, status: 'processing' as const, progress: Math.min(j.progress + 10, 90) }
            : j
        ),
      }))
    }, 1000)

    // Simulate completion after ~8 seconds
    setTimeout(() => {
      clearInterval(interval)
      set((s) => ({
        activeJobs: s.activeJobs.filter((j) => j.id !== jobId),
        projects: s.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                status: 'completed' as const,
                thumbnailUrl: `https://picsum.photos/seed/${projectId}/800/450`,
                videoUrl: '#',
                updatedAt: new Date().toISOString(),
              }
            : p
        ),
        isGenerating: false,
        prompt: '',
      }))
    }, 8000)
  },

  cancelJob: (jobId) => {
    set((s) => ({
      activeJobs: s.activeJobs.filter((j) => j.id !== jobId),
      projects: s.projects.map((p) =>
        p.id === s.activeJobs.find((j) => j.id === jobId)?.projectId
          ? { ...p, status: 'failed' as const }
          : p
      ),
      isGenerating: false,
    }))
  },

  deleteProject: (projectId) => {
    set((s) => ({
      projects: s.projects.filter((p) => p.id !== projectId),
    }))
  },

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  createABTest: (models) => {
    const state = get()
    const newTest: ABTest = {
      id: generateId(),
      prompt: state.prompt,
      models,
      results: [],
      status: 'running',
      createdAt: new Date().toISOString(),
    }
    set({ abTests: [newTest, ...state.abTests] })
  },
}))
