-- =====================================================
-- GHL Lead Gen SaaS - Supabase Schema
-- =====================================================
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- 1. WORKSPACES (Multi-tenant isolation)
-- =====================================================
create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null, -- references auth.users
  plan text default 'free' check (plan in ('free','pro','agency')),
  monthly_lead_limit int default 50,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
-- 2. MEMBERS (Workspace access control)
-- =====================================================
create table members (
  user_id uuid not null, -- references auth.users
  workspace_id uuid not null references workspaces(id) on delete cascade,
  role text not null check (role in ('owner','admin','member')) default 'member',
  created_at timestamptz default now(),
  primary key (user_id, workspace_id)
);

-- =====================================================
-- 3. SAVED SEARCHES (User-defined search configs)
-- =====================================================
create table saved_searches (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null, -- e.g., "Durham Gyms - AI Receptionist"
  niche text not null, -- 'gym','yoga','wellness'
  location text not null, -- 'Raleigh NC' or '27601'
  radius_miles int default 20,
  service text not null, -- 'ai_receptionist','chatbot','website'
  min_score int default 7, -- only show leads with score >= this
  enabled boolean default true,
  created_by uuid not null, -- references auth.users
  created_at timestamptz default now(),
  last_run_at timestamptz,
  last_run_count int default 0
);

-- =====================================================
-- 4. LEADS (Found businesses)
-- =====================================================
create table leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  search_id uuid references saved_searches(id) on delete set null,

  -- Basic info
  name text not null,
  phone text,
  email text,
  website text,

  -- Location
  address text,
  city text,
  state text,
  zip text,
  lat double precision,
  lng double precision,

  -- Google Places data
  place_id text unique not null, -- dedup key
  rating numeric(2,1),
  review_count int,
  price_level int, -- 1-4

  -- AI Receptionist signals
  has_online_booking boolean default false,
  has_chat_widget boolean default false,
  late_hours boolean default false, -- open before 6am or after 8pm
  phone_issues_in_reviews boolean default false,
  is_franchise boolean default false,

  -- Website analysis
  website_exists boolean default false,
  website_copyright_year int,
  ssl_valid boolean default false,
  mobile_responsive boolean default false,

  -- Scoring
  lead_score int not null default 0,
  why_flagged text, -- e.g., "No online booking; Phone issues in reviews"

  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  pushed_to_ghl boolean default false,
  pushed_to_ghl_at timestamptz
);

-- Index for dedup
create index idx_leads_place_id on leads(place_id);
create index idx_leads_workspace_score on leads(workspace_id, lead_score desc);

-- =====================================================
-- 5. INTEGRATIONS (Per-workspace GHL/API tokens)
-- =====================================================
create table integrations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  provider text not null check (provider in ('gohighlevel','zapier','make')),

  -- OAuth tokens (encrypt at rest in production)
  access_token text not null,
  refresh_token text,
  token_expires_at timestamptz,

  -- Provider-specific settings
  metadata jsonb default '{}', -- e.g., { "pipeline_id": "abc", "stage_id": "xyz" }

  -- Status
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(workspace_id, provider)
);

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
alter table workspaces enable row level security;
alter table members enable row level security;
alter table saved_searches enable row level security;
alter table leads enable row level security;
alter table integrations enable row level security;

-- Helper function: Get user's workspaces (in public schema, not auth)
create or replace function public.user_workspaces()
returns setof uuid
language sql
security definer
stable
as $$
  select workspace_id
  from members
  where user_id = auth.uid();
$$;

-- WORKSPACES policies
create policy "Users can view their workspaces"
  on workspaces for select
  using (id in (select public.user_workspaces()));

create policy "Users can create their workspaces"
  on workspaces for insert
  with check (owner_id = auth.uid());

create policy "Users can update their workspaces"
  on workspaces for update
  using (id in (select public.user_workspaces()));

-- MEMBERS policies
create policy "Users can view workspace members"
  on members for select
  using (workspace_id in (select public.user_workspaces()));

create policy "Users can add themselves to workspaces"
  on members for insert
  with check (user_id = auth.uid());

-- SAVED_SEARCHES policies
create policy "Users can view saved searches"
  on saved_searches for select
  using (workspace_id in (select public.user_workspaces()));

create policy "Users can create saved searches"
  on saved_searches for insert
  with check (workspace_id in (select public.user_workspaces()));

create policy "Users can update saved searches"
  on saved_searches for update
  using (workspace_id in (select public.user_workspaces()));

create policy "Users can delete saved searches"
  on saved_searches for delete
  using (workspace_id in (select public.user_workspaces()));

-- LEADS policies
create policy "Users can view their leads"
  on leads for select
  using (workspace_id in (select public.user_workspaces()));

create policy "Users can update their leads"
  on leads for update
  using (workspace_id in (select public.user_workspaces()));

-- INTEGRATIONS policies
create policy "Users can view integrations"
  on integrations for select
  using (workspace_id in (select public.user_workspaces()));

create policy "Users can manage integrations"
  on integrations for all
  using (workspace_id in (select public.user_workspaces()));

-- =====================================================
-- 7. FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply to tables
create trigger update_workspaces_updated_at before update on workspaces
  for each row execute function update_updated_at_column();

create trigger update_leads_updated_at before update on leads
  for each row execute function update_updated_at_column();

create trigger update_integrations_updated_at before update on integrations
  for each row execute function update_updated_at_column();

-- =====================================================
-- 8. SEED DATA (Optional - for testing)
-- =====================================================
-- Uncomment to create a test workspace

/*
-- Insert test workspace (replace with your auth.users id)
insert into workspaces (name, owner_id, plan)
values ('My Team', 'YOUR_USER_ID_HERE', 'free');

-- Add yourself as owner
insert into members (user_id, workspace_id, role)
values ('YOUR_USER_ID_HERE', (select id from workspaces where name = 'My Team'), 'owner');
*/

-- =====================================================
-- Done! Your database is ready.
-- =====================================================
