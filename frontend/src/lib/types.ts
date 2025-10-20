// =====================================================
// TypeScript Types for Supabase Database
// =====================================================
// Auto-generated types matching supabase-schema.sql
// =====================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// =====================================================
// Database Interface (Main Export)
// =====================================================
export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: Workspace
        Insert: WorkspaceInsert
        Update: WorkspaceUpdate
      }
      members: {
        Row: Member
        Insert: MemberInsert
        Update: MemberUpdate
      }
      saved_searches: {
        Row: SavedSearch
        Insert: SavedSearchInsert
        Update: SavedSearchUpdate
      }
      leads: {
        Row: Lead
        Insert: LeadInsert
        Update: LeadUpdate
      }
      integrations: {
        Row: Integration
        Insert: IntegrationInsert
        Update: IntegrationUpdate
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_workspaces: {
        Args: Record<string, never>
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// =====================================================
// 1. Workspace Types
// =====================================================
export interface Workspace {
  id: string
  name: string
  owner_id: string
  plan: 'free' | 'pro' | 'agency'
  monthly_lead_limit: number
  created_at: string
  updated_at: string
}

export interface WorkspaceInsert {
  id?: string
  name: string
  owner_id: string
  plan?: 'free' | 'pro' | 'agency'
  monthly_lead_limit?: number
  created_at?: string
  updated_at?: string
}

export interface WorkspaceUpdate {
  id?: string
  name?: string
  owner_id?: string
  plan?: 'free' | 'pro' | 'agency'
  monthly_lead_limit?: number
  created_at?: string
  updated_at?: string
}

// =====================================================
// 2. Member Types
// =====================================================
export interface Member {
  user_id: string
  workspace_id: string
  role: 'owner' | 'admin' | 'member'
  created_at: string
}

export interface MemberInsert {
  user_id: string
  workspace_id: string
  role?: 'owner' | 'admin' | 'member'
  created_at?: string
}

export interface MemberUpdate {
  user_id?: string
  workspace_id?: string
  role?: 'owner' | 'admin' | 'member'
  created_at?: string
}

// =====================================================
// 3. Saved Search Types
// =====================================================
export interface SavedSearch {
  id: string
  workspace_id: string
  name: string
  niche: string
  location: string
  radius_miles: number
  service: string
  min_score: number
  enabled: boolean
  created_by: string
  created_at: string
  last_run_at: string | null
  last_run_count: number
}

export interface SavedSearchInsert {
  id?: string
  workspace_id: string
  name: string
  niche: string
  location: string
  radius_miles?: number
  service: string
  min_score?: number
  enabled?: boolean
  created_by: string
  created_at?: string
  last_run_at?: string | null
  last_run_count?: number
}

export interface SavedSearchUpdate {
  id?: string
  workspace_id?: string
  name?: string
  niche?: string
  location?: string
  radius_miles?: number
  service?: string
  min_score?: number
  enabled?: boolean
  created_by?: string
  created_at?: string
  last_run_at?: string | null
  last_run_count?: number
}

// =====================================================
// 4. Lead Types
// =====================================================
export interface Lead {
  id: string
  workspace_id: string
  search_id: string | null
  // Basic info
  name: string
  phone: string | null
  email: string | null
  website: string | null
  // Location
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  lat: number | null
  lng: number | null
  // Google Places data
  place_id: string
  rating: number | null
  review_count: number | null
  price_level: number | null
  // AI Receptionist signals
  has_online_booking: boolean
  has_chat_widget: boolean
  late_hours: boolean
  phone_issues_in_reviews: boolean
  is_franchise: boolean
  // Website analysis
  website_exists: boolean
  website_copyright_year: number | null
  ssl_valid: boolean
  mobile_responsive: boolean
  // Scoring
  lead_score: number
  why_flagged: string | null
  // Metadata
  created_at: string
  updated_at: string
  pushed_to_ghl: boolean
  pushed_to_ghl_at: string | null
}

export interface LeadInsert {
  id?: string
  workspace_id: string
  search_id?: string | null
  // Basic info
  name: string
  phone?: string | null
  email?: string | null
  website?: string | null
  // Location
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  lat?: number | null
  lng?: number | null
  // Google Places data
  place_id: string
  rating?: number | null
  review_count?: number | null
  price_level?: number | null
  // AI Receptionist signals
  has_online_booking?: boolean
  has_chat_widget?: boolean
  late_hours?: boolean
  phone_issues_in_reviews?: boolean
  is_franchise?: boolean
  // Website analysis
  website_exists?: boolean
  website_copyright_year?: number | null
  ssl_valid?: boolean
  mobile_responsive?: boolean
  // Scoring
  lead_score?: number
  why_flagged?: string | null
  // Metadata
  created_at?: string
  updated_at?: string
  pushed_to_ghl?: boolean
  pushed_to_ghl_at?: string | null
}

export interface LeadUpdate {
  id?: string
  workspace_id?: string
  search_id?: string | null
  // Basic info
  name?: string
  phone?: string | null
  email?: string | null
  website?: string | null
  // Location
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  lat?: number | null
  lng?: number | null
  // Google Places data
  place_id?: string
  rating?: number | null
  review_count?: number | null
  price_level?: number | null
  // AI Receptionist signals
  has_online_booking?: boolean
  has_chat_widget?: boolean
  late_hours?: boolean
  phone_issues_in_reviews?: boolean
  is_franchise?: boolean
  // Website analysis
  website_exists?: boolean
  website_copyright_year?: number | null
  ssl_valid?: boolean
  mobile_responsive?: boolean
  // Scoring
  lead_score?: number
  why_flagged?: string | null
  // Metadata
  created_at?: string
  updated_at?: string
  pushed_to_ghl?: boolean
  pushed_to_ghl_at?: string | null
}

// =====================================================
// 5. Integration Types
// =====================================================
export interface Integration {
  id: string
  workspace_id: string
  provider: 'gohighlevel' | 'zapier' | 'make'
  access_token: string
  refresh_token: string | null
  token_expires_at: string | null
  metadata: Json
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface IntegrationInsert {
  id?: string
  workspace_id: string
  provider: 'gohighlevel' | 'zapier' | 'make'
  access_token: string
  refresh_token?: string | null
  token_expires_at?: string | null
  metadata?: Json
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface IntegrationUpdate {
  id?: string
  workspace_id?: string
  provider?: 'gohighlevel' | 'zapier' | 'make'
  access_token?: string
  refresh_token?: string | null
  token_expires_at?: string | null
  metadata?: Json
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

// =====================================================
// Helper Types (for forms and API responses)
// =====================================================

// Form data for creating a saved search
export interface SavedSearchFormData {
  name: string
  niche: string
  location: string
  radius_miles: number
  service: string
  min_score: number
}

// n8n webhook response format
export interface N8nWebhookResponse {
  success: boolean
  leads_found: number
  qualified_leads: number
  leads: Lead[]
}

// Lead with search info (joined query result)
export interface LeadWithSearch extends Lead {
  saved_search?: SavedSearch
}

// Workspace with member count
export interface WorkspaceWithStats extends Workspace {
  member_count?: number
  lead_count?: number
  search_count?: number
}
