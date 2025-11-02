import { Link } from 'react-router-dom'
import { LogOut, ChevronDown, Sparkles, Moon, Sun } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useWorkspace } from '@/hooks/useWorkspace'
import { useTheme } from '@/hooks/useTheme'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const { workspace, workspaces, switchWorkspace } = useWorkspace()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex h-16 items-center px-6 gap-6">
        {/* Logo/Brand */}
        <Link to="/searches" className="flex items-center space-x-3 group">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 glow-effect group-hover:scale-105 transition-transform" />
            <div className="relative h-full w-full rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg gradient-text">Lead Finder AI</span>
            <span className="text-xs text-muted-foreground">Powered by AI</span>
          </div>
        </Link>

        {/* Workspace Selector */}
        <div className="ml-auto flex-1 max-w-xs">
          {workspaces.length > 0 && workspace && (
            <Select value={workspace.id} onValueChange={switchWorkspace}>
              <SelectTrigger className="bg-secondary/50 border-border hover:bg-secondary transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {workspaces.map((ws) => (
                  <SelectItem key={ws.id} value={ws.id}>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      {ws.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          ) : (
            <Sun className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          )}
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-medium">{user?.email?.split('@')[0]}</span>
              <span className="text-xs text-muted-foreground">{workspace?.plan || 'Free'} Plan</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {workspace?.name}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={signOut}
              className="text-red-500 cursor-pointer hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white data-[highlighted]:bg-red-500 data-[highlighted]:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
