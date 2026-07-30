import { useState } from 'react'
import { useStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sparkles,
  Zap,
  Clock,
  DollarSign,
  Wand2,
  Image as ImageIcon,
  Film,
  Check,
  Loader2,
  X,
  Upload,
  Mic,
  MonitorPlay,
  Maximize2,
} from 'lucide-react'
import { AI_MODELS, ASPECT_RATIOS, VIDEO_STYLES } from '@/lib/data'
import { cn, estimateCost } from '@/lib/utils'
import type { AspectRatio } from '@/types'

export function Create() {
  const {
    selectedModel,
    setSelectedModel,
    selectedAspectRatio,
    setSelectedAspectRatio,
    selectedStyle,
    setSelectedStyle,
    prompt,
    setPrompt,
    duration,
    setDuration,
    generateVideo,
    isGenerating,
    activeJobs,
    cancelJob,
    user,
  } = useStore()

  const [inputMode, setInputMode] = useState<'text' | 'image' | 'video'>('text')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const cost = selectedModel ? estimateCost(duration, selectedModel.costPerSecond) : 0
  const canGenerate = prompt.trim().length > 0 && selectedModel && user.credits >= cost && !isGenerating

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Video</h1>
        <p className="text-muted-foreground mt-1">
          Describe your vision and let AI bring it to life.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Input Mode Tabs */}
          <Card className="glass border-white/5">
            <CardContent className="p-4">
              <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as typeof inputMode)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="text" className="gap-2">
                    <Wand2 className="h-4 w-4" /> Text to Video
                  </TabsTrigger>
                  <TabsTrigger value="image" className="gap-2">
                    <ImageIcon className="h-4 w-4" /> Image to Video
                  </TabsTrigger>
                  <TabsTrigger value="video" className="gap-2">
                    <Film className="h-4 w-4" /> Video to Video
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Prompt Input */}
          <Card className="glass border-white/5">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Prompt</label>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                  <Sparkles className="h-3 w-3" /> Enhance Prompt
                </Button>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A cinematic aerial shot of a futuristic city at sunset, flying cars, neon lights, 4K quality..."
                className="min-h-[140px] w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Quick styles:</span>
                {['Cinematic', 'Anime', 'Photorealistic', '3D'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={cn(
                      'text-xs px-2.5 py-1 rounded-full border transition-all',
                      selectedStyle === style
                        ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
                        : 'border-white/10 hover:border-white/20'
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Image Upload (conditional) */}
          {inputMode === 'image' && (
            <Card className="glass border-white/5 border-dashed">
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-medium">Upload an image</p>
                    <p className="text-sm text-muted-foreground">Drag & drop or click to browse</p>
                  </div>
                  <Button variant="outline" size="sm">Choose File</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Duration & Settings */}
          <Card className="glass border-white/5">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Duration
                  </label>
                  <span className="text-sm font-bold text-indigo-400">{duration}s</span>
                </div>
                <Slider
                  value={[duration]}
                  onValueChange={(v) => setDuration(v[0])}
                  min={1}
                  max={selectedModel?.maxDuration || 25}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1s</span>
                  <span>{selectedModel?.maxDuration || 25}s max</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Aspect Ratio</label>
                <div className="grid grid-cols-5 gap-2">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => setSelectedAspectRatio(ratio.value)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-all',
                        selectedAspectRatio === ratio.value
                          ? 'border-indigo-500/50 bg-indigo-500/10'
                          : 'border-white/5 hover:border-white/10'
                      )}
                    >
                      <div
                        className={cn(
                          'rounded border-2',
                          selectedAspectRatio === ratio.value ? 'border-indigo-400' : 'border-muted-foreground/30'
                        )}
                        style={{
                          width: ratio.value === '9:16' ? 16 : ratio.value === '1:1' ? 24 : 32,
                          height: ratio.value === '16:9' ? 18 : ratio.value === '21:9' ? 13.7 : ratio.value === '4:3' ? 24 : 28.4,
                        }}
                      />
                      <span className="text-[10px] font-medium">{ratio.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Video Style</label>
                <div className="flex flex-wrap gap-2">
                  {VIDEO_STYLES.map((style) => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      className={cn(
                        'text-xs px-3 py-1.5 rounded-full border transition-all',
                        selectedStyle === style
                          ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
                          : 'border-white/10 hover:border-white/20'
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Model Selection */}
        <div className="space-y-6">
          <Card className="glass border-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Select AI Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {AI_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className={cn(
                    'w-full rounded-xl border p-4 text-left transition-all group',
                    selectedModel?.id === model.id
                      ? 'border-indigo-500/50 bg-indigo-500/5'
                      : 'border-white/5 hover:border-white/10 hover:bg-white/5'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${model.color}20` }}
                      >
                        <Zap className="h-5 w-5" style={{ color: model.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{model.name}</p>
                        <p className="text-xs text-muted-foreground">{model.provider}</p>
                      </div>
                    </div>
                    <div
                      className={cn(
                        'h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all',
                        selectedModel?.id === model.id
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-white/20'
                      )}
                    >
                      {selectedModel?.id === model.id && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{model.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {model.features.slice(0, 2).map((f) => (
                      <Badge key={f} variant="secondary" className="text-[10px]">
                        {f}
                      </Badge>
                    ))}
                    {model.supportsAudio && (
                      <Badge variant="secondary" className="text-[10px] gap-1">
                        <Mic className="h-2.5 w-2.5" /> Audio
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <span className="text-xs text-muted-foreground">Max {model.maxDuration}s</span>
                    <span className="text-xs font-medium" style={{ color: model.color }}>
                      ${model.costPerSecond}/s
                    </span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Cost Summary */}
          <Card className="glass border-white/5 sticky top-6">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Generation Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model</span>
                  <span className="font-medium">{selectedModel?.name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{duration}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aspect Ratio</span>
                  <span className="font-medium">{selectedAspectRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Style</span>
                  <span className="font-medium">{selectedStyle}</span>
                </div>
                <div className="border-t border-white/5 pt-2 flex justify-between">
                  <span className="text-muted-foreground">Cost</span>
                  <span className="font-bold text-indigo-400">{cost} credits</span>
                </div>
              </div>

              <Button
                onClick={generateVideo}
                disabled={!canGenerate}
                variant="gradient"
                size="lg"
                className="w-full gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Video
                  </>
                )}
              </Button>

              {!canGenerate && prompt.trim().length === 0 && (
                <p className="text-xs text-center text-muted-foreground">Enter a prompt to generate</p>
              )}
              {!canGenerate && prompt.trim().length > 0 && user.credits < cost && (
                <p className="text-xs text-center text-destructive">Insufficient credits</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
