import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useWorkspace } from './useWorkspace'
import { toast } from '@/lib/toast'
import type { Integration } from '@/lib/types'

// =====================================================
// Fetch integrations for current workspace
// =====================================================
export function useIntegrations() {
  const { workspace } = useWorkspace()

  return useQuery({
    queryKey: ['integrations', workspace?.id],
    queryFn: async () => {
      if (!workspace) return []

      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching integrations:', error)
        throw error
      }

      return data as Integration[]
    },
    enabled: !!workspace,
  })
}

// =====================================================
// Get GoHighLevel integration specifically
// =====================================================
export function useGHLIntegration() {
  const { workspace } = useWorkspace()

  return useQuery({
    queryKey: ['ghl-integration', workspace?.id],
    queryFn: async () => {
      if (!workspace) return null

      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('workspace_id', workspace.id)
        .eq('provider', 'gohighlevel')
        .eq('is_active', true)
        .maybeSingle()

      if (error) {
        console.error('Error fetching GHL integration:', error)
        throw error
      }

      return data as Integration | null
    },
    enabled: !!workspace,
  })
}

// =====================================================
// Disconnect integration
// =====================================================
export function useDisconnectIntegration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (integrationId: string) => {
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('id', integrationId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
      queryClient.invalidateQueries({ queryKey: ['ghl-integration'] })
      toast.success('Integration disconnected')
    },
    onError: (error: Error) => {
      toast.error('Failed to disconnect integration', {
        description: error.message,
      })
    },
  })
}

// =====================================================
// Get workspace usage stats
// =====================================================
export function useWorkspaceStats() {
  const { workspace } = useWorkspace()

  return useQuery({
    queryKey: ['workspace-stats', workspace?.id],
    queryFn: async () => {
      if (!workspace) return null

      // Get lead count for current month
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count: leadsThisMonth, error: leadsError } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspace.id)
        .gte('created_at', startOfMonth.toISOString())

      if (leadsError) throw leadsError

      // Get total leads
      const { count: totalLeads, error: totalError } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspace.id)

      if (totalError) throw totalError

      // Get saved searches count
      const { count: savedSearches, error: searchesError } = await supabase
        .from('saved_searches')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspace.id)

      if (searchesError) throw searchesError

      return {
        leadsThisMonth: leadsThisMonth ?? 0,
        totalLeads: totalLeads ?? 0,
        savedSearches: savedSearches ?? 0,
        monthlyLimit: workspace.monthly_lead_limit,
        percentageUsed:
          workspace.monthly_lead_limit > 0
            ? Math.round(((leadsThisMonth ?? 0) / workspace.monthly_lead_limit) * 100)
            : 0,
      }
    },
    enabled: !!workspace,
  })
}
