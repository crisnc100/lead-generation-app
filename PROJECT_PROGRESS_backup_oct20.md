# PROJECT PROGRESS - GoHighLevel Lead Finder

**Project Name:** GHL Lead Finder - AI Receptionist SaaS
**Last Updated:** October 19, 2025
**Current Phase:** Phase 3 - Frontend Development =§
**Overall Status:** 65% Complete

---

## =Ê Quick Status Overview

| Phase | Status | Completion Date |
|-------|--------|----------------|
| Phase 1: Database Setup |  Complete | October 12, 2025 |
| Phase 2A: n8n Review Analysis |  Complete | October 14, 2025 |
| Phase 2B: n8n Website HTML Analysis |  Complete | October 15, 2025 |
| Phase 3: Frontend Application | =§ In Progress | TBD |
| Phase 4: GHL Integration | ó Pending | TBD |
| Phase 5: Billing & Production | ó Pending | TBD |

---

## <¯ Project Vision

**What We're Building:**
A multi-tenant SaaS platform that automatically finds and scores local businesses that need AI receptionist services. Users create "Saved Searches" (e.g., "gyms in Durham NC"), click "Run Now", and get a scored list of qualified leads based on real signals from Google reviews and website analysis.

**Target Users:**
- AI receptionist agencies
- GoHighLevel users selling AI voice services
- Marketing agencies targeting local businesses

**Business Model:**
- Free: 1 search, 50 leads/month
- Pro: 10 searches, 1,000 leads/month ($49/mo)
- Agency: 50 searches, 5,000 leads/month ($149/mo)

---

## <× Architecture Overview

### Tech Stack
- **Frontend:** Vite + React 18 + TypeScript + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + RLS + Edge Functions)
- **Automation:** n8n Cloud (workflow orchestration)
- **APIs:** Google Places API (New) v1
- **Integrations:** GoHighLevel (LeadConnector API)
- **Billing:** Stripe (planned)
- **Hosting:** Vercel (frontend) + Supabase Cloud (backend)

### Data Flow
```
User ’ Frontend (Vite/React)
  “
Supabase Edge Function (JWT signing)
  “
n8n Webhook (search execution)
  “
Google Places API (business search + details)
  “
Website HTML Scraping (booking/chat detection)
  “
Supabase Database (lead storage)
  “
Frontend (lead display + export)
  “
GoHighLevel (optional: push qualified leads)
```

---

##  Phase 1: Database Setup (COMPLETE)

**Completion Date:** October 12, 2025

### Supabase Project Details
- **Project Name:** HighLevelLeads
- **Project ID:** iohktyjjktyyacxzgfkp
- **Region:** us-east-2
- **Database URL:** https://iohktyjjktyyacxzgfkp.supabase.co
- **Postgres Version:** 17.6.1.016

### Database Schema (5 Tables)

#### 1. `workspaces` (Multi-tenant isolation)
- **Purpose:** Tenant workspaces for isolating data
- **Columns:** id, name, owner_id, plan, monthly_lead_limit, created_at, updated_at
- **RLS:**  Enabled
- **Current Data:** 2 workspaces

#### 2. `members` (Access control)
- **Purpose:** User-workspace relationships with roles
- **Columns:** user_id, workspace_id, role (owner/admin/member), created_at
- **RLS:**  Enabled
- **Current Data:** 2 members

#### 3. `saved_searches` (User-defined search configs)
- **Purpose:** Store search parameters (niche, location, service)
- **Columns:** id, workspace_id, name, niche, location, radius_miles, service, min_score, enabled, created_by, created_at, last_run_at, last_run_count
- **RLS:**  Enabled
- **Current Data:** 1 saved search

#### 4. `leads` (Scored business results)
- **Purpose:** Store found businesses with scoring data
- **Columns:** 31 columns including basic info, location, Google Places data, AI receptionist signals, website analysis, scoring
- **Key Fields:**
  - `place_id` (unique) - Google Place ID for deduplication
  - `lead_score` (0-12 range) - Qualification score
  - `why_flagged` - Human-readable explanation
  - Boolean signals: has_online_booking, has_chat_widget, phone_issues_in_reviews, mobile_responsive
- **RLS:**  Enabled
- **Current Data:** 0 leads (ready for production data)

#### 5. `integrations` (Per-workspace API tokens)
- **Purpose:** Store GoHighLevel/Zapier/Make credentials
- **Columns:** id, workspace_id, provider, access_token, refresh_token, token_expires_at, metadata (jsonb), is_active, created_at, updated_at
- **RLS:**  Enabled
- **Current Data:** 0 integrations

### Row-Level Security (RLS)
-  All tables have RLS enabled
-  Helper function `user_workspaces()` created
-  Policies enforce workspace isolation
-  Users can only access data in their own workspaces

### Authentication
-  Supabase Auth configured
-  Email/password authentication enabled
-  JWT-based session management

---

##  Phase 2A: n8n Review Analysis (COMPLETE)

**Completion Date:** October 14, 2025

### Implemented Features
-  Google Places API Text Search integration
-  Franchise filtering (15+ chains detected and excluded)
-  Review text analysis for phone complaints
-  Review text analysis for booking complaints
-  Initial lead scoring based on review signals
-  Deduplication via Google Place ID

### Review Analysis Signals
| Signal | Points | Detection Method |
|--------|--------|------------------|
| Phone complaints in reviews | +4 | Regex: "no answer\|voicemail\|can't reach\|won't answer\|never picks up" |
| Booking complaints in reviews | +3 | Regex: "hard to book\|no online booking\|can't book online" |
| Mid-tier rating (3.8-4.7) | +2 | Active business with room to improve |
| Local independent business | +1 | Passed franchise filter |

### Franchise Filter
**Excluded Chains:**
Planet Fitness, Crunch, LA Fitness, Life Time, YMCA, O2 Fitness, Anytime Fitness, Orangetheory, F45, Gold's Gym, 24 Hour Fitness, Blink Fitness, Pure Barre, SoulCycle, CorePower Yoga

---

##  Phase 2B: n8n Website HTML Analysis (COMPLETE)

**Completion Date:** October 15, 2025

### Implemented Features
-  Website HTML fetching (5s timeout, follows redirects)
-  Booking system detection (13 vendors)
-  Chat widget detection (13 vendors)
-  Mobile responsiveness check (viewport meta tag)
-  Copyright year extraction (flags outdated sites)
-  SSL validation
-  Final lead scoring with confirmed signals
-  Supabase upsert with deduplication

### Website Analysis Signals
| Signal | Points | Detection Method |
|--------|--------|------------------|
| No online booking system | +3 | HTML scan for calendly, mindbody, acuity, etc. (confirmed absence) |
| No chat widget | +2 | HTML scan for intercom, tawk, crisp, etc. (confirmed absence) |
| Not mobile responsive | +1 | Missing `<meta name="viewport">` tag |
| Old website (©<2020) | +1 | Copyright year extraction |

### Detected Booking Vendors
calendly, acuity, mindbody, glofox, pike13, zenplanner, squareup/appointments, wix book, bookeo, setmore, appointlet, vagaro, schedulicity

### Detected Chat Vendors
intercom, tawk.to, crisp, drift, manychat, tidio, hubspot-chat, zendesk, livechat, olark, freshchat, userlike, pure-chat

---

## =Ë n8n Workflow Status

### Active Workflow: "GHL Lead Finder - AI Receptionist"
- **Workflow ID:** ZOThqKPoQ5h2oalO
- **Status:**  Active
- **Last Updated:** October 18, 2025
- **Node Count:** 11 nodes
- **Test Webhook:** https://crisnc100.app.n8n.cloud/webhook-test/find-leads
- **Production Webhook:** https://crisnc100.app.n8n.cloud/webhook/find-leads

### Workflow Architecture (11 Nodes)
```
1. Webhook Trigger
   “
2. Google Places Search (HTTP Request)
   “
3. Filter Franchises (Code)
   “
4. Analyze Reviews & Score (Code)
   “
5. Fetch Website HTML (HTTP Request)
   “
6. Analyze Website HTML (Code)
   “
7. Format for Supabase (Code)
   “
8. Save to Supabase (HTTP Request)
   “
9. Prepare Response (Code)
   “
10. Respond to Webhook (Webhook Response)
   “
11. [Error Handler Node]
```

### Lead Scoring Algorithm
**Total Possible Score:** 0-12 points
**Qualification Threshold:** e7 points

**Scoring Breakdown:**
- Phone complaints in reviews: +4
- Booking complaints in reviews: +3
- No online booking (confirmed): +3
- No chat widget (confirmed): +2
- Mid-tier rating (3.8-4.7, 20-200 reviews): +2
- Not mobile responsive: +1
- Old website (<2020): +1
- Local business (not franchise): +1

### Test Results
**Durham NC Yoga Studio Search (October 15, 2025):**
- Businesses checked: 20
- Franchises filtered: 3
- Qualified leads found: 3
- Example lead: Gracie Barra Charlotte (Score: 8)
  - Signals: Phone complaints (+4), No booking (+3), Local (+1)

---

## =§ Phase 3: Frontend Development (IN PROGRESS)

**Status:** Setup Complete, Ready to Build Components
**Started:** October 15, 2025
**Target Completion:** TBD

### Technology Stack
- **Framework:** Vite 5.x + React 18 + TypeScript 5
- **Routing:** React Router 6.x
- **State Management:** TanStack Query (React Query) 5.x
- **UI Library:** shadcn/ui (Radix UI + Tailwind CSS 3.x)
- **Forms:** React Hook Form + Zod validation
- **Icons:** lucide-react
- **CSV Export:** papaparse

### Project Structure
```
frontend/
   src/
      components/
         ui/              # shadcn/ui components
         auth/            # Auth wrappers
         layout/          # App layout, navbar
         features/        # Feature components
      lib/
         supabase.ts      # Supabase client
         types.ts         # TypeScript types
         utils.ts         # Utilities
      hooks/
         useAuth.ts       # Auth hook
         useWorkspace.ts  # Workspace context
         useSearches.ts   # Searches queries
         useLeads.ts      # Leads queries
      pages/
         Login.tsx
         Signup.tsx
         Searches.tsx
         Leads.tsx
         Settings.tsx
      App.tsx
   supabase/functions/      # Edge Functions
       trigger-search/      # JWT signing + n8n webhook caller
```

### Completed Steps
-  Vite project initialization
-  Dependencies installed (Supabase, React Router, TanStack Query, etc.)
-  Tailwind CSS + shadcn/ui setup
-  Environment variables configured (.env.local)
-  TypeScript types defined (matching database schema)
-  Supabase client created
-  Detailed build plan documented (FRONTEND_BUILD_PLAN.md - 2400+ lines)

### Remaining Tasks (Phase 3)
- ó Build auth pages (Login, Signup)
- ó Build auth hooks (useAuth, useWorkspace)
- ó Build protected route wrapper
- ó Build app layout (Navbar, WorkspaceSwitcher)
- ó Build Saved Searches page
  - Search form (create/edit dialog)
  - Search table with Run Now button
  - Enable/disable toggle
- ó Build Leads page
  - Leads table with pagination
  - Filter controls (score, niche, date)
  - CSV export button
- ó Build Settings page
  - Workspace settings
  - GHL integration setup
- ó Create Supabase Edge Function (trigger-search)
  - Verify user authentication
  - Sign JWT for n8n webhook
  - Call n8n with search parameters
- ó Test end-to-end flow (signup ’ create search ’ run ’ view leads)

### Current Blockers
None - ready to proceed with component development.

---

## = Phase 3 Status: Run Search Feature

**Status:** Ready to Implement
**Priority:** High (Core Feature)

### User Flow
1. User navigates to `/searches` page
2. User clicks "Run Now" button on saved search
3. Frontend calls Supabase Edge Function with `search_id`
4. Edge Function:
   - Verifies user has access to workspace
   - Fetches search details from database
   - Signs JWT token with search parameters
   - Calls n8n webhook with signed token
5. n8n workflow executes (15-30 seconds):
   - Verifies JWT signature
   - Searches Google Places
   - Filters franchises
   - Analyzes reviews
   - Fetches website HTML
   - Scores businesses
   - Saves qualified leads to Supabase
6. Frontend shows success toast
7. User navigates to `/leads` to view results

### Required Components

#### 1. Supabase Edge Function: `trigger-search`
**Location:** `supabase/functions/trigger-search/index.ts`

**Purpose:**
- Server-side JWT signing (cannot be done in browser)
- Secure n8n webhook authentication
- Verify user has access to workspace

**Inputs:**
```typescript
{
  search_id: string  // UUID of saved search
}
```

**Process:**
1. Get user from auth header
2. Fetch search details: `SELECT * FROM saved_searches WHERE id = $1`
3. Verify user has access via RLS (automatic)
4. Sign JWT with HS256:
   ```typescript
   {
     workspace_id: string,
     search_id: string,
     location: string,
     niche: string,
     iat: timestamp
   }
   ```
5. POST to n8n webhook: `{ token: "eyJhbGc..." }`
6. Return success response

**Environment Variables Required:**
- `N8N_WEBHOOK_URL` = https://crisnc100.app.n8n.cloud/webhook/find-leads
- `N8N_WEBHOOK_SECRET` = [secure random string]

**Deployment:**
```bash
supabase functions deploy trigger-search
supabase secrets set N8N_WEBHOOK_URL=https://crisnc100.app.n8n.cloud/webhook/find-leads
supabase secrets set N8N_WEBHOOK_SECRET=your-secret-here
```

#### 2. Frontend Hook: `useRunSearch`
**Location:** `src/hooks/useRunSearch.ts`

```typescript
export function useRunSearch() {
  const { workspace } = useWorkspace()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const mutation = useMutation({
    mutationFn: async (searchId: string) => {
      const { data, error } = await supabase.functions.invoke('trigger-search', {
        body: { search_id: searchId }
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast({ title: 'Search started!', description: 'Results will appear in 15-30 seconds.' })
      // Invalidate leads query to refetch when user navigates
      queryClient.invalidateQueries({ queryKey: ['leads', workspace?.id] })
    },
    onError: (error) => {
      toast({ title: 'Search failed', description: error.message, variant: 'destructive' })
    }
  })

  return mutation
}
```

#### 3. "Run Now" Button Component
**Location:** `src/components/features/searches/SearchRow.tsx`

```typescript
function RunNowButton({ searchId }: { searchId: string }) {
  const runSearch = useRunSearch()

  return (
    <Button
      onClick={() => runSearch.mutate(searchId)}
      disabled={runSearch.isPending}
      size="sm"
    >
      {runSearch.isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Running...
        </>
      ) : (
        <>
          <Play className="mr-2 h-4 w-4" />
          Run Now
        </>
      )}
    </Button>
  )
}
```

#### 4. n8n Webhook Update (JWT Verification)
**Location:** n8n workflow "GHL Lead Finder - AI Receptionist"

**Add as First Node (Code):**
```javascript
const jwt = require('jsonwebtoken');
const secret = $env.N8N_WEBHOOK_SECRET;
const { token } = $json;

try {
  const payload = jwt.verify(token, secret);

  return {
    json: {
      workspace_id: payload.workspace_id,
      search_id: payload.search_id,
      location: payload.location,
      niche: payload.niche
    }
  };
} catch (e) {
  throw new Error('Unauthorized: Invalid token');
}
```

**Update Subsequent Nodes:**
- Google Places Search: Use `{{ $json.niche }}` and `{{ $json.location }}`
- Format for Supabase: Include `{{ $json.workspace_id }}` and `{{ $json.search_id }}`

### Testing Plan
1. **Unit Test Edge Function:**
   ```bash
   curl -X POST https://iohktyjjktyyacxzgfkp.supabase.co/functions/v1/trigger-search \
     -H "Authorization: Bearer <user_jwt>" \
     -H "Content-Type: application/json" \
     -d '{"search_id": "<uuid>"}'
   ```

2. **Integration Test (End-to-End):**
   - Sign up new user
   - Create saved search
   - Click "Run Now"
   - Verify n8n receives JWT
   - Verify leads saved to Supabase
   - Verify leads appear in frontend

3. **Load Test:**
   - Create 5 saved searches
   - Run all 5 simultaneously
   - Verify no rate limit errors
   - Verify all leads saved correctly

### Security Considerations
-  JWT secret stored in Supabase secrets (never exposed)
-  n8n verifies JWT signature (prevents unauthorized searches)
-  RLS ensures users can only run searches in their workspaces
-  Supabase service role key only used in n8n (never in frontend)
-  User JWT passed to Edge Function (auth.getUser() verifies identity)

### Performance Expectations
- Edge Function response: <500ms
- n8n workflow execution: 15-30 seconds
- Total time from click to leads in database: ~30 seconds
- Frontend should show immediate feedback ("Search started!")
- Leads page should auto-refresh or show notification when complete

---

## ó Phase 4: GoHighLevel Integration (PENDING)

**Estimated Start:** After Phase 3 completion

### Planned Features
- OAuth2 flow for GHL authentication
- Store access/refresh tokens in `integrations` table
- Push qualified leads (score e7) to GHL Contacts
- Create Opportunities in specified pipeline/stage
- Add custom fields: Lead Score, Why Flagged, Niche, Service
- Add tags: niche:{gym}, service:{ai_receptionist}, area:{RDU}

### Integration Flow
1. User navigates to Settings ’ Integrations
2. Clicks "Connect GoHighLevel"
3. OAuth2 flow redirects to GHL
4. User authorizes access
5. Callback receives access/refresh tokens
6. Store in `integrations` table (workspace_id, provider='gohighlevel')
7. n8n workflow checks for integration before pushing
8. If integration exists and lead_score e min_score, upsert Contact + create Opportunity

---

## ó Phase 5: Billing & Production (PENDING)

**Estimated Start:** After Phase 4 completion

### Planned Features
- Stripe Checkout integration
- Subscription plans (Free, Pro, Agency)
- Monthly lead limits enforcement
- Customer portal for subscription management
- Usage tracking dashboard
- Upgrade/downgrade flows

### Production Checklist
- [ ] Environment variables in Vercel
- [ ] Supabase production mode
- [ ] n8n rate limiting
- [ ] Error monitoring (Sentry)
- [ ] Analytics (PostHog/Plausible)
- [ ] Custom domain setup
- [ ] SSL certificate
- [ ] Terms of Service & Privacy Policy
- [ ] GDPR compliance (data export/deletion)

---

## =Ú Documentation Files

| File | Purpose | Status |
|------|---------|--------|
| `PROJECT_PROGRESS.md` | This file - overall project status |  Active |
| `docs/Overview.md` | Architecture and build order |  Complete |
| `FRONTEND_BUILD_PLAN.md` | Detailed frontend build guide (2400+ lines) |  Complete |
| `supabase-schema.sql` | Database schema SQL |  Complete |
| `.env.local` | Environment variables (NOT committed) |  Complete |

---

## = Environment Variables

### Frontend (.env.local)
```bash
VITE_SUPABASE_URL=https://iohktyjjktyyacxzgfkp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Supabase Edge Functions (secrets)
```bash
N8N_WEBHOOK_URL=https://crisnc100.app.n8n.cloud/webhook/find-leads
N8N_WEBHOOK_SECRET=[secure random string]
```

### n8n Environment Variables
```bash
N8N_WEBHOOK_SECRET=[same as above]
SUPABASE_URL=https://iohktyjjktyyacxzgfkp.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[service role key - bypasses RLS]
GOOGLE_PLACES_API_KEY=AIzaSyAGomDu4dNoB11umS1SW7hlHq1yn8QptpU
```

---

## = Known Issues & Blockers

### Current Issues
None - all systems operational.

### Resolved Issues
1.  **Franchise filter false positives** (Oct 14) - Fixed with improved regex patterns
2.  **Website timeout causing workflow failures** (Oct 15) - Added `continueOnFail: true` and 5s timeout
3.  **Duplicate leads in database** (Oct 15) - Added unique constraint on `place_id` and upsert logic

---

## =Ê Project Metrics

### Database Stats
- **Total Workspaces:** 2
- **Total Members:** 2
- **Total Saved Searches:** 1
- **Total Leads:** 0 (ready for production data)
- **Total Integrations:** 0

### n8n Workflow Stats
- **Total Workflows:** 2 (1 active, 1 inactive)
- **Active Workflow:** "GHL Lead Finder - AI Receptionist"
- **Total Nodes:** 11
- **Average Execution Time:** 15-30 seconds
- **Success Rate:** 100% (test runs)

### Development Progress
- **Total Development Days:** 7 (Oct 12-18)
- **Backend Completion:** 90% (database + n8n done)
- **Frontend Completion:** 10% (setup done, components pending)
- **Overall Completion:** 65%

---

## <¯ Next Immediate Steps

### Priority 1: Complete Frontend Core (Week 1)
1. Build auth pages (Login, Signup)
2. Build protected routes
3. Build app layout with navbar
4. Build Saved Searches page
5. Build Leads page
6. Test auth flow end-to-end

### Priority 2: Implement Run Search (Week 2)
1. Create Supabase Edge Function (trigger-search)
2. Add JWT verification to n8n workflow
3. Build Run Now button with loading state
4. Test search execution end-to-end
5. Verify leads appear in database and UI

### Priority 3: Polish & Deploy (Week 3)
1. Add CSV export functionality
2. Add pagination to leads table
3. Add filters (score, niche, date)
4. Deploy frontend to Vercel
5. Test in production environment

---

## =Þ Support & Resources

### Key URLs
- **Supabase Dashboard:** https://supabase.com/dashboard/project/iohktyjjktyyacxzgfkp
- **n8n Cloud:** https://crisnc100.app.n8n.cloud
- **Test Webhook:** https://crisnc100.app.n8n.cloud/webhook-test/find-leads
- **Google Places API Console:** https://console.cloud.google.com

### Documentation References
- Supabase Docs: https://supabase.com/docs
- n8n Docs: https://docs.n8n.io
- Google Places API: https://developers.google.com/maps/documentation/places/web-service/overview
- React Query: https://tanstack.com/query/latest
- shadcn/ui: https://ui.shadcn.com

---

**Last Updated:** October 19, 2025
**Next Review:** After Phase 3 completion
