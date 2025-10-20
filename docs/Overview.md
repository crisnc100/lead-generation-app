0) What you’ll build (at a glance)

Next.js app (Vercel) — login, create “Saved Searches” (niche/area/service), click Run Now, view/export leads, connect GoHighLevel, billing.

Supabase (Postgres + Auth + RLS) — secure multi-tenant storage: workspaces, members, saved_searches, leads, integrations (per-workspace GHL tokens).

n8n (Cloud or Docker) — two triggers:

Schedule (e.g., Sundays 9:00 PM ET) → run all enabled saved searches.

Webhook → run one search “on-demand” from your app.

GoHighLevel (optional per workspace) — upsert Contacts (+ Opportunities if score ≥ threshold).

Stripe — subscriptions/limits (you can add this later; scaffold now).

1) Prereqs

Accounts: Supabase, Vercel, n8n (Cloud or VPS), Stripe (optional now), Google Cloud (Places API key), GoHighLevel (LeadConnector API).

Domain (optional but nice): e.g., leadgen.yourdomain.com

Timezone: you’re in America/New_York → schedule in ET.

Create a private “platform config” doc with:

Google Places API key

GHL API credentials (per workspace later)

JWT secret (to sign calls from Next.js → n8n Webhook)

Supabase URL, anon key, service role key (server-only!)

2) Supabase: database + RLS
2.1 Tables (run in Supabase SQL)
-- Tenants
create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null,
  plan text default 'free',
  created_at timestamptz default now()
);

-- Members
create table members (
  user_id uuid not null,
  workspace_id uuid not null references workspaces(id) on delete cascade,
  role text check (role in ('owner','admin','member')) default 'member',
  primary key (user_id, workspace_id)
);

-- Saved searches (inputs)
create table saved_searches (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  niche text not null,            -- 'gym','yoga','med_spa','chiropractor',...
  area text not null,             -- 'Raleigh NC' or '27601' or 'bbox:...'
  service text not null,          -- 'ai_receptionist','website_refresh','chatbot'
  min_score int default 7,
  radius_mi int default 20,
  enabled boolean default true,
  created_by uuid not null,
  created_at timestamptz default now()
);

-- Leads (outputs)
create table leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  search_id uuid references saved_searches(id) on delete set null,
  source text,                    -- 'google_places','yelp'
  name text,
  phone text,
  email text,
  website text,
  address text,
  city text, state text, zip text,
  lat double precision, lng double precision,
  rating numeric, review_count int,
  has_online_booking boolean, has_chat_widget boolean,
  ssl_valid boolean, mobile_responsive boolean,
  copyright_year int,
  lead_score int,
  why_flagged text,
  place_ref text,                 -- place_id or yelp id
  created_at timestamptz default now()
);

-- Per-workspace integration creds (e.g., GHL)
create table integrations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  provider text not null,         -- 'gohighlevel'
  access_token text not null,     -- store encrypted at rest
  refresh_token text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

2.2 Enable RLS + policies (sketch)
alter table workspaces enable row level security;
alter table members enable row level security;
alter table saved_searches enable row level security;
alter table leads enable row level security;
alter table integrations enable row level security;

-- Helper view: workspaces current user belongs to
create or replace view v_user_workspaces as
select m.user_id, m.workspace_id from members m;

-- Policies (typical pattern)
create policy "members can read their workspaces"
on workspaces for select
using (exists(select 1 from members m where m.workspace_id = id and m.user_id = auth.uid()));

create policy "members can read saved_searches"
on saved_searches for select
using (exists(select 1 from members m where m.workspace_id = saved_searches.workspace_id and m.user_id = auth.uid()));

create policy "members can insert saved_searches"
on saved_searches for insert
with check (exists(select 1 from members m where m.workspace_id = saved_searches.workspace_id and m.user_id = auth.uid()));

create policy "members can read leads"
on leads for select
using (exists(select 1 from members m where m.workspace_id = leads.workspace_id and m.user_id = auth.uid()));

-- Similarly add update/delete as you prefer, and policies for integrations (read/insert limited to workspace members).


Important: never expose the service_role key in the browser. Use it only server-side (Next.js API routes or n8n).

3) n8n: two workflows (Schedule + Webhook)

You’ll create one reusable sub-workflow for “run a single saved search,” and two thin wrappers that call it.

3.1 Sub-workflow: Run One Saved Search

Inputs: { workspace_id, search_id } (or the full search params)

Nodes (in order):

HTTP Request (Supabase: fetch search row)

GET /rest/v1/saved_searches?id=eq.{search_id}&select=* (Auth: Bearer service_role)

Output JSON → {{$json[0]}} gives you niche, area, service, min_score, radius_mi, workspace_id

Function (Build queries) — create an array of Google Places queries from niche + area (e.g., ["gym in Raleigh NC","yoga studio in Raleigh NC", ...]). You can also compute a geo center if you prefer Nearby Search.

HTTP Request (Google Places: Text/Nearby Search)

For each query, collect place_ids (handle next_page_token with small waits). Store unique IDs.

Split In Batches (e.g., 10–20) to throttle API calls.

HTTP Request (Place Details) per place_id

Fields: name, address, phone, website, hours, rating, user_ratings_total, price_level, geometry.

IF (has website) → HTTP Request (Site Probe)

GET homepage (follow redirects).

Code node parses HTML to detect:

Booking vendors (regex any of: calendly|acuityscheduling|mindbodyonline|glofox|janeapp|classpass|squareup/appointments|squarespace.*appointments|wix.*book)

Chat vendors (intercom|tawk|crisp|drift|manychat|tidio|hubspot-chat)

ssl_valid (scheme https:), mobile_responsive (presence of <meta name="viewport" ...>), copyright_year (regex ©\s*(20\d{2}))

If no website, set features to false/empty.

(Optional) HTTP Request (Reviews scan)

If you use Yelp/SerpAPI: get a few review texts; Code node counts % mentioning call|phone|voicemail|busy|no one answered.

Function (Chain filter + scoring + format row)

Maintain a franchise list (Planet Fitness, Orangetheory, Lifetime, Crunch, etc.); is_chain = true if matches → skip.

Score function (example):

const r = item.json;
let s = 0;
if (r.website) s+=2;
if (!r.has_chat_widget) s+=2;
if (!r.has_online_booking) s+=2;
if (r.rating >= 3.8 && r.rating <= 4.7 && r.review_count >= 20 && r.review_count <= 300) s+=2;
if (r.late_hours_open) s+=1; // derive from hours
if (r.reviews_mention_calls_pct >= 0.08) s+=1;
r.lead_score = s;
r.why_flagged = [
  !r.has_chat_widget && 'no chat',
  !r.has_online_booking && 'no online booking',
  r.lighthouse_low && 'slow site',
  r.reviews_mention_calls_pct >= 0.08 && 'reviews mention phone/voicemail'
].filter(Boolean).join('; ');
return r;


Create final object matching your leads table columns + {workspace_id, search_id}.

HTTP Request (Supabase: upsert leads)

POST /rest/v1/leads with Prefer: resolution=merge-duplicates (or dedupe yourself by place_ref).

Use service_role auth here (server-side only).

(Optional) HTTP Request (Supabase: fetch GHL token)

GET /rest/v1/integrations?workspace_id=eq.{workspace_id}&provider=eq.gohighlevel&select=*

If exists and lead_score >= min_score → proceed.

HTTP Request (GoHighLevel: upsert Contact + create/update Opportunity)

Upsert Contact by phone/email → add tags and custom fields (Lead Score, Why Flagged, Niche, Service, Area, Review Count, Rating, Has Booking/Chat).

If qualified: create/update Opportunity in the workspace’s chosen pipeline/stage.

(Optional) Slack message with top 10 new leads.

Pro tip: wrap vendor detection + scoring in a single Code node that takes the raw details + site HTML and returns the normalized lead object.

3.2 Webhook workflow: Run Now

Webhook Trigger → expects a signed payload {workspace_id, search_id} (or full params).

Code (verify HMAC/JWT with your shared secret).

Execute Workflow → call Run One Saved Search with those values.

Return a JSON with a job id or quick summary.

3.3 Scheduled workflow: Nightly/Weekly Refresh

Schedule Trigger → Sundays 9:00 PM ET.

HTTP Request (Supabase) → GET /rest/v1/saved_searches?enabled=eq.true&select=id,workspace_id

For each row → Execute Workflow → Run One Saved Search.

4) Next.js app (tiny but powerful)
4.1 Install + env

Create app: pnpm create next-app (or npx create-next-app)

Add: @supabase/supabase-js, auth helper, UI lib (shadcn/ui), jsonwebtoken (for signing Webhook calls).

.env (server and client versions):

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...  # server-only, never to client
N8N_WEBHOOK_URL=https://your-n8n.../webhook/run-now
N8N_WEBHOOK_JWT_SECRET=super-secret

4.2 Auth + Workspaces

On signup, create a workspace and insert (user_id, workspace_id, role='owner') in members.

Add a simple workspace switcher (most users will have one).

4.3 Saved Searches CRUD

Page: /app/searches with a form: niche, area, service, minScore, radius.

On submit: insert into saved_searches (workspace_id, created_by, ...).

Table lists searches with Enable/Disable toggle and Run Now button.

4.4 Leads table

Page: /app/leads → query leads for current workspace_id (with pagination and filters).

Export CSV button (client-side transform is fine).

4.5 “Run Now” API route (server)
// /app/api/searches/[id]/run/route.ts
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { user_id, workspace_id } = await getCurrentUserAndWorkspace(); // your auth helper

  // Optional: verify user owns this search
  const { data: row } = await supabase
    .from('saved_searches')
    .select('id, workspace_id')
    .eq('id', params.id)
    .single();

  if (!row || row.workspace_id !== workspace_id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const token = jwt.sign(
    { workspace_id, search_id: row.id, iat: Date.now() / 1000 },
    process.env.N8N_WEBHOOK_JWT_SECRET!
  );

  const res = await fetch(process.env.N8N_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });

  const out = await res.json().catch(() => ({}));
  return NextResponse.json({ status: 'queued', n8n: out });
}

4.6 n8n Webhook verification (Code node)
const jwt = require('jsonwebtoken');
const secret = $env.N8N_WEBHOOK_JWT_SECRET; // define in n8n env
const { token } = $json;
try {
  const payload = jwt.verify(token, secret);
  // set into workflow variables
  $json.workspace_id = payload.workspace_id;
  $json.search_id = payload.search_id;
  return $json;
} catch (e) {
  throw new Error('Unauthorized');
}

5) GoHighLevel mapping (per workspace)

In your app’s Integrations page, collect the workspace’s GHL token (OAuth/API key) and store in integrations.

In n8n, before pushing, fetch that workspace’s token.

Contacts: upsert by phone/email. Add tags: niche:gym, service:ai_receptionist, area:RDU. Fill custom fields (Lead Score, Why Flagged, etc.).

Opportunities: create/update only when lead_score >= min_score. Store default pipeline_id/stage_id in integrations.metadata.

6) Scheduling & rate limits

Schedule Trigger in n8n: Sundays 9:00 PM ET (CRON 0 21 * * 0).

Throttle API calls with Split In Batches + Wait nodes.

Batch upserts to Supabase in chunks (50–200 rows per insert).

7) Quotas & billing (Stripe)

Plans:

Free: 1 saved search, 50 leads/mo

Pro: 10 searches, 1,000 leads/mo

Agency: 50 searches, 5,000 leads/mo

Enforce in n8n: before inserting, count this month’s leads.created_at for workspace_id. If over limit → stop and write a “limit reached” row or send Slack/email.

Add Stripe Checkout + customer portal. On webhook “active subscription,” set workspaces.plan.

8) Testing checklist

Unit test vendor detection (feed sample HTML and confirm flags).

Run One Saved Search manually with a tiny area (e.g., “gym in Cary NC”).

Confirm leads upsert to Supabase and show in /app/leads.

Flip on Schedule; verify Sunday job logs.

Connect a test GHL workspace; create one qualified lead and ensure Contact/Opportunity created.

Try a second workspace (friend/agency) to confirm isolation (RLS working).

9) Hardening & polish (next sprint)

Add Airtable/Google Sheets export toggle per workspace.

Add a “Push to GoHighLevel” switch on each Saved Search.

Add Slack summary (“Top 10 new leads this week”) via webhook.

Add review scanning and Lighthouse performance (optional microservice).

White-label domain per agency (CNAME to your app).

TL;DR build order (you can copy this into a task list)

Supabase: create tables + RLS; test auth + workspace creation.

Next.js: auth; pages for Saved Searches + Leads; Run Now API route (JWT→n8n).

n8n: Run One Saved Search sub-workflow; Webhook (on-demand) + Schedule (weekly).

Google Places: search + details; site probe; score; Supabase upsert.

GoHighLevel: per-workspace token; upsert Contact; conditional Opportunity.

Quotas: simple monthly cap; (optional) Stripe plans + limits.

Deploy: Vercel (app), Supabase (DB), n8n (Cloud or Docker), set env vars & secrets.

Test end-to-end with a small radius; refine score thresholds; ship!