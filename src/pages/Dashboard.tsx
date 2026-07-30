import { useStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import {
  Play,
  Clock,
  Zap,
  TrendingUp,
  Film,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { formatRelativeTime, formatCredits } from '@/lib/utils'
import { AI_MODELS } from '@/lib/data'

export function Dashboard() {
  const { projects, user, activeJobs } = useStore()

  const recentProjects = projects.slice(0, 5)
  const completedCount = projects.filter((p) => p.status === 'completed').length
  const generatingCount = projects.filter((p) => p.status === 'generating').length
  const failedCount = projects.filter((p) => p.status === 'failed').length

  const stats = [
    {
      title: 'Total Videos',
      value: user.totalVideos,
      icon: Film,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Credits Left',
      value: formatCredits(user.credits),
      icon: Zap,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Completed',
      value: completedCount,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Active Jobs',
      value: activeJobs.length,
      icon: Loader2,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user.name}. Here's what's happening.
          </p>
        </div>
        <Link to="/create">
          <Button variant="gradient" size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Create Video
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="glass border-white/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`rounded-xl ${stat.bg} p-3`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
            Active Generations
          </h2>
          <div className="grid gap-4">
            {activeJobs.map((job) => (
              <Card key={job.id} className="glass border-white/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
                      </div>
                      <div>
                        <p className="font-medium text-sm truncate max-w-md">{job.prompt}</p>
                        <p className="text-xs text-muted-foreground">
                          {AI_MODELS.find((m) => m.id === job.modelId)?.name} — Est. {job.estimatedTime}s
                        </p>
                      </div>
                    </div>
                    <Badge variant="info" className="animate-pulse">
                      {job.status}
                    </Badge>
                  </div>
                  <Progress value={job.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">{job.progress}% complete</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
          <Link to="/gallery">
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentProjects.map((project) => (
            <Card
              key={project.id}
              className="glass border-white/5 overflow-hidden group cursor-pointer transition-all hover:border-white/10"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                {project.thumbnailUrl ? (
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                    {project.status === 'generating' ? (
                      <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
                    ) : (
                      <Film className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={
                      project.status === 'completed'
                        ? 'success'
                        : project.status === 'generating'
                        ? 'info'
                        : project.status === 'failed'
                        ? 'destructive'
                        : 'warning'
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
                {project.status === 'completed' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="h-5 w-5 text-white ml-0.5" />
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold truncate">{project.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{project.prompt}</p>
                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {project.duration}s
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {project.creditsUsed}
                    </span>
                  </div>
                  <span>{formatRelativeTime(project.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Model Comparison */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-400" />
          Model Performance
        </h2>
        <Card className="glass border-white/5">
          <CardContent className="p-6">
            <div className="space-y-4">
              {AI_MODELS.slice(0, 4).map((model) => {
                const modelProjects = projects.filter((p) => p.model.id === model.id && p.status === 'completed')
                const usage = modelProjects.reduce((acc, p) => acc + p.creditsUsed, 0)
                const maxUsage = 20
                return (
                  <div key={model.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: model.color }}
                        />
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs text-muted-foreground">({model.provider})</span>
                      </div>
                      <span className="text-muted-foreground">{usage.toFixed(1)} credits</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((usage / maxUsage) * 100, 100)}%`,
                          backgroundColor: model.color,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
