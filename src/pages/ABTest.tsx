import { useState } from 'react'
import { useStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FlaskConical, Play, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'
import { AI_MODELS } from '@/lib/data'
import { cn } from '@/lib/utils'

export function ABTestPage() {
  const { abTests, prompt, createABTest } = useStore()
  const [selectedModels, setSelectedModels] = useState<string[]>([])

  const toggleModel = (id: string) => {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const canRun = selectedModels.length >= 2 && prompt.trim().length > 0

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">A/B Test Lab</h1>
        <p className="text-muted-foreground mt-1">
          Compare multiple AI models with the same prompt.
        </p>
      </div>

      <Card className="glass border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-indigo-400" />
            Configure Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Prompt</label>
            <textarea
              defaultValue={prompt}
              placeholder="Enter your prompt here..."
              className="min-h-[100px] w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Select Models to Compare (min 2)</label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {AI_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => toggleModel(model.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-4 text-left transition-all',
                    selectedModels.includes(model.id)
                      ? 'border-indigo-500/50 bg-indigo-500/5'
                      : 'border-white/5 hover:border-white/10'
                  )}
                >
                  <div
                    className={cn(
                      'h-5 w-5 rounded border-2 flex items-center justify-center transition-all shrink-0',
                      selectedModels.includes(model.id)
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-white/20'
                    )}
                  >
                    {selectedModels.includes(model.id) && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{model.name}</p>
                    <p className="text-xs text-muted-foreground">${model.costPerSecond}/s</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="gradient"
            size="lg"
            className="gap-2"
            disabled={!canRun}
            onClick={() => createABTest(selectedModels)}
          >
            <FlaskConical className="h-4 w-4" />
            Run A/B Test
          </Button>
        </CardContent>
      </Card>

      {abTests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Results</h2>
          {abTests.map((test) => (
            <Card key={test.id} className="glass border-white/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">{test.prompt.slice(0, 60)}...</p>
                    <p className="text-xs text-muted-foreground">
                      {test.models.length} models • {test.status}
                    </p>
                  </div>
                  <Badge variant={test.status === 'completed' ? 'success' : 'info'}>
                    {test.status}
                  </Badge>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {test.models.map((modelId) => {
                    const model = AI_MODELS.find((m) => m.id === modelId)
                    return (
                      <div
                        key={modelId}
                        className="rounded-xl border border-white/5 bg-white/5 p-4 space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-8 w-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${model?.color}20` }}
                          >
                            <FlaskConical className="h-4 w-4" style={{ color: model?.color }} />
                          </div>
                          <span className="font-medium text-sm">{model?.name}</span>
                        </div>
                        <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                          {test.status === 'running' ? (
                            <Loader2 className="h-6 w-6 text-purple-400 animate-spin" />
                          ) : (
                            <Play className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Cost: {model ? model.costPerSecond * 5 : 0} cr</span>
                          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                            View <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
