import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useWorkspace } from './useWorkspace'
import { toast } from '@/lib/toast'
import type { Lead } from '@/lib/types'

interface LeadsFilters {
  searchId?: string
  minScore?: number
  searchQuery?: string
  // Signal filters
  hasOnlineBooking?: boolean
  hasChatWidget?: boolean
  lateHours?: boolean
  phoneIssues?: boolean
  isFranchise?: boolean
}

// =====================================================
// Fetch all leads for current workspace
// =====================================================
export function useLeads(filters?: LeadsFilters) {
  const { workspace } = useWorkspace()

  return useQuery({
    queryKey: ['leads', workspace?.id, filters],
    queryFn: async () => {
      if (!workspace) return []

      let query = supabase
        .from('leads')
        .select('*, saved_searches(name)')
        .eq('workspace_id', workspace.id)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters?.searchId) {
        query = query.eq('search_id', filters.searchId)
      }

      if (filters?.minScore !== undefined) {
        query = query.gte('lead_score', filters.minScore)
      }

      if (filters?.searchQuery) {
        query = query.ilike('name', `%${filters.searchQuery}%`)
      }

      // Apply signal filters
      if (filters?.hasOnlineBooking !== undefined) {
        query = query.eq('has_online_booking', filters.hasOnlineBooking)
      }

      if (filters?.hasChatWidget !== undefined) {
        query = query.eq('has_chat_widget', filters.hasChatWidget)
      }

      if (filters?.lateHours !== undefined) {
        query = query.eq('late_hours', filters.lateHours)
      }

      if (filters?.phoneIssues !== undefined) {
        query = query.eq('phone_issues_in_reviews', filters.phoneIssues)
      }

      if (filters?.isFranchise !== undefined) {
        query = query.eq('is_franchise', filters.isFranchise)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching leads:', error)
        throw error
      }

      return data as Lead[]
    },
    enabled: !!workspace,
  })
}

// =====================================================
// Export leads to CSV
// =====================================================
export function exportLeadsToCSV(leads: Lead[], filename = 'leads.csv') {
  if (!leads || leads.length === 0) {
    toast.info('No leads to export')
    return
  }

  // Define CSV headers
  const headers = [
    'Name',
    'Phone',
    'Email',
    'Website',
    'Address',
    'City',
    'State',
    'Rating',
    'Reviews',
    'Lead Score',
    'Has Booking',
    'Has Chat',
    'Late Hours',
    'Phone Issues',
    'Is Franchise',
    'Why Flagged',
    'Created',
  ]

  // Convert leads to CSV rows
  const rows = leads.map((lead) => [
    lead.name,
    lead.phone || '',
    lead.email || '',
    lead.website || '',
    lead.address || '',
    lead.city || '',
    lead.state || '',
    lead.rating || '',
    lead.review_count || '',
    lead.lead_score,
    lead.has_online_booking ? 'Yes' : 'No',
    lead.has_chat_widget ? 'Yes' : 'No',
    lead.late_hours ? 'Yes' : 'No',
    lead.phone_issues_in_reviews ? 'Yes' : 'No',
    lead.is_franchise ? 'Yes' : 'No',
    lead.why_flagged || '',
    new Date(lead.created_at).toLocaleDateString(),
  ])

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => {
        // Escape cells that contain commas or quotes
        const cellStr = String(cell)
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`
        }
        return cellStr
      }).join(',')
    ),
  ].join('\n')

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Show success toast
  toast.success('Leads exported', {
    description: `Exported ${leads.length} lead${leads.length !== 1 ? 's' : ''} to CSV`,
  })
}
