import { Outlet } from 'react-router-dom'
import { useStore } from '@/store'
import { Sidebar } from './Sidebar'
import { cn } from '@/lib/utils'

export function AppShell() {
  const { sidebarCollapsed } = useStore()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="min-h-screen p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
