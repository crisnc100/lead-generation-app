import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import type { Workspace } from '@/lib/types'

// =====================================================
// Workspace Context Interface
// =====================================================
interface WorkspaceContextType {
  workspace: Workspace | null
  workspaces: Workspace[]
  loading: boolean
  switchWorkspace: (workspaceId: string) => void
  refreshWorkspaces: () => Promise<void>
}

// =====================================================
// Create Workspace Context
// =====================================================
const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

// =====================================================
// Workspace Provider Component
// =====================================================
export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)

  // =====================================================
  // Fetch Workspaces Function
  // =====================================================
  const fetchWorkspaces = useCallback(async () => {
    if (!user) {
      setWorkspaces([])
      setWorkspace(null)
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      // Fetch all workspaces user has access to
      // RLS will automatically filter to only workspaces where user is a member
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching workspaces:', error)
        throw error
      }

      setWorkspaces(data || [])

      // Restore active workspace from localStorage or set first one
      const savedId = localStorage.getItem('active_workspace_id')
      if (savedId && data) {
        const saved = data.find((w) => w.id === savedId)
        if (saved) {
          setWorkspace(saved)
        } else if (data.length > 0) {
          // Saved workspace not found, use first one
          setWorkspace(data[0])
          localStorage.setItem('active_workspace_id', data[0].id)
        }
      } else if (data && data.length > 0) {
        // No saved workspace, use first one
        setWorkspace(data[0])
        localStorage.setItem('active_workspace_id', data[0].id)
      }
    } catch (err) {
      console.error('Failed to fetch workspaces:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  // =====================================================
  // Effect: Fetch workspaces when user changes
  // =====================================================
  useEffect(() => {
    fetchWorkspaces()
  }, [fetchWorkspaces])

  // =====================================================
  // Switch Workspace Function
  // =====================================================
  const switchWorkspace = useCallback(
    (workspaceId: string) => {
      const ws = workspaces.find((w) => w.id === workspaceId)
      if (ws) {
        setWorkspace(ws)
        localStorage.setItem('active_workspace_id', workspaceId)
        console.log('✅ Switched to workspace:', ws.name)
      } else {
        console.error('❌ Workspace not found:', workspaceId)
      }
    },
    [workspaces]
  )

  // =====================================================
  // Refresh Workspaces Function
  // =====================================================
  const refreshWorkspaces = useCallback(async () => {
    await fetchWorkspaces()
  }, [fetchWorkspaces])

  const value = {
    workspace,
    workspaces,
    loading,
    switchWorkspace,
    refreshWorkspaces,
  }

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

// =====================================================
// useWorkspace Hook
// =====================================================
export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}
