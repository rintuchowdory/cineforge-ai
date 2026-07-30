export interface VideoProject {
  id: string;
  title: string;
  prompt: string;
  model: AIModel;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  thumbnailUrl?: string;
  videoUrl?: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  creditsUsed: number;
  aspectRatio: AspectRatio;
  style?: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  features: string[];
  maxDuration: number;
  costPerSecond: number;
  supportsAudio: boolean;
  supportsImageInput: boolean;
  supportsVideoInput: boolean;
  quality: 'standard' | 'high' | 'ultra';
  color: string;
  icon: string;
}

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '21:9';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  credits: number;
  totalVideos: number;
  createdAt: string;
}

export interface CreditTransaction {
  id: string;
  type: 'purchase' | 'usage' | 'bonus';
  amount: number;
  description: string;
  createdAt: string;
}

export interface GenerationJob {
  id: string;
  projectId: string;
  modelId: string;
  prompt: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  estimatedTime: number;
}

export interface ABTest {
  id: string;
  prompt: string;
  models: string[];
  results: VideoProject[];
  status: 'running' | 'completed';
  createdAt: string;
}
