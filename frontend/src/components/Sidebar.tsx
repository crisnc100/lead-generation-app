import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Search, Users, Settings } from 'lucide-react'

const navigation = [
  { name: 'Saved Searches', href: '/searches', icon: Search },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card/30 backdrop-blur-sm">
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-foreground shadow-lg'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-gradient-to-b from-purple-500 to-blue-500 rounded-r-full" />
              )}
              <Icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                  isActive ? 'text-purple-400' : 'text-muted-foreground group-hover:text-foreground'
                )}
              />
              <span className={cn(isActive && 'font-semibold')}>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
