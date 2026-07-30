import { useState } from 'react'
import { useStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Play,
  Clock,
  Zap,
  Trash2,
  Download,
  Grid3X3,
  List,
  Search,
  Film,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Filter,
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import type { VideoProject } from '@/types'

export function Gallery() {
  const { projects, deleteProject } = useStore()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filter, setFilter] = useState<'all' | 'completed' | 'generating' | 'failed'>('all')
  const [search, setSearch] = useState('')

  const filtered = projects.filter((p) => {
    if (filter !== 'all' && p.status !== filter) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.prompt.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground mt-1">{projects.length} projects total</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon-sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon-sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-lg border border-input bg-background/50 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Done</TabsTrigger>
            <TabsTrigger value="generating">Active</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Projects */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <Film className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No projects found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your filters or create a new video.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} onDelete={deleteProject} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((project) => (
            <ProjectRow key={project.id} project={project} onDelete={deleteProject} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project, onDelete }: { project: VideoProject; onDelete: (id: string) => void }) {
  return (
    <Card className="glass border-white/5 overflow-hidden group">
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
            ) : project.status === 'failed' ? (
              <AlertCircle className="h-8 w-8 text-destructive" />
            ) : (
              <Film className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={project.status} />
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
        <h3 className="font-semibold text-sm truncate">{project.title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{project.prompt}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {project.duration}s
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {project.creditsUsed}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(project.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectRow({ project, onDelete }: { project: VideoProject; onDelete: (id: string) => void }) {
  return (
    <Card className="glass border-white/5">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="relative h-16 w-28 rounded-lg overflow-hidden bg-muted shrink-0">
          {project.thumbnailUrl ? (
            <img src={project.thumbnailUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
              {project.status === 'generating' ? (
                <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
              ) : (
                <Film className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate">{project.title}</h3>
            <StatusBadge status={project.status} />
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{project.prompt}</p>
          <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {project.duration}s
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {project.creditsUsed} credits
            </span>
            <span>{project.model.name}</span>
            <span>{formatRelativeTime(project.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {project.status === 'completed' && (
            <Button variant="ghost" size="icon-sm" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(project.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: VideoProject['status'] }) {
  const config = {
    completed: { variant: 'success' as const, icon: CheckCircle2 },
    generating: { variant: 'info' as const, icon: Loader2 },
    failed: { variant: 'destructive' as const, icon: AlertCircle },
    pending: { variant: 'warning' as const, icon: Clock },
  }
  const { variant, icon: Icon } = config[status]
  return (
    <Badge variant={variant} className="gap-1 text-[10px]">
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  )
}
