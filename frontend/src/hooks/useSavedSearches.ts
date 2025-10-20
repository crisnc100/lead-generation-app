import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useWorkspace } from './useWorkspace'
import { useAuth } from './useAuth'
import { toast } from '@/lib/toast'
import type { SavedSearch, SavedSearchFormData, SavedSearchUpdate } from '@/lib/types'

// =====================================================
// Fetch all saved searches for current workspace
// =====================================================
export function useSavedSearches() {
  const { workspace } = useWorkspace()

  return useQuery({
    queryKey: ['saved-searches', workspace?.id],
    queryFn: async () => {
      if (!workspace) return []

      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching saved searches:', error)
        throw error
      }

      return data as SavedSearch[]
    },
    enabled: !!workspace,
  })
}

// =====================================================
// Create new saved search
// =====================================================
export function useCreateSavedSearch() {
  const queryClient = useQueryClient()
  const { workspace } = useWorkspace()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (search: SavedSearchFormData) => {
      if (!workspace) throw new Error('No workspace selected')
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('saved_searches')
        .insert({
          ...search,
          workspace_id: workspace.id,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data as SavedSearch
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches'] })
      toast.success('Search created successfully', {
        description: data.name,
      })
    },
    onError: (error: Error) => {
      toast.error('Failed to create search', {
        description: error.message,
      })
    },
  })
}

// =====================================================
// Update existing saved search
// =====================================================
export function useUpdateSavedSearch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: SavedSearchUpdate }) => {
      const { data, error } = await supabase
        .from('saved_searches')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as SavedSearch
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches'] })
      toast.success('Search updated')
    },
    onError: (error: Error) => {
      toast.error('Failed to update search', {
        description: error.message,
      })
    },
  })
}

// =====================================================
// Delete saved search
// =====================================================
export function useDeleteSavedSearch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('saved_searches').delete().eq('id', id)

      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches'] })
      toast.success('Search deleted')
    },
    onError: (error: Error) => {
      toast.error('Failed to delete search', {
        description: error.message,
      })
    },
  })
}

// =====================================================
// Trigger n8n workflow for a saved search
// =====================================================
export function useTriggerSearch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (searchId: string) => {
      // Call Supabase Edge Function to trigger n8n workflow
      const { data, error } = await supabase.functions.invoke('trigger-search', {
        body: { search_id: searchId },
      })

      if (error) {
        throw new Error(error.message || 'Failed to trigger search')
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Failed to trigger workflow')
      }

      return {
        success: true,
        qualified_leads: data.qualified_leads || 0,
        leads_found: data.leads_found || 0,
        message: data.message,
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches'] })
      queryClient.invalidateQueries({ queryKey: ['leads'] })

      // Show success message with lead count
      toast.success('🎉 Search complete!', {
        description: `Found ${data.qualified_leads} qualified lead${data.qualified_leads !== 1 ? 's' : ''}`,
        duration: 6000, // Success message stays longer
      })
    },
    onError: (error: Error) => {
      toast.error('Search failed', {
        description: error.message,
        duration: 5000,
      })
    },
  })
}
