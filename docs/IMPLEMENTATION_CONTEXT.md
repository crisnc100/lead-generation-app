# GoHighLevel Leads - Implementation Context

**Last Updated:** October 31, 2025
**Status:** Phase 5 - Tier 1 Deep Research Features
**Current Sprint:** AI Detection, Call Estimation, Booking Analysis

---

## Table of Contents

1. [Project Vision](#project-vision)
2. [Architecture Overview](#architecture-overview)
3. [Current State](#current-state)
4. [Tier 1 Features (In Progress)](#tier-1-features-in-progress)
5. [Technical Stack](#technical-stack)
6. [Development Workflow](#development-workflow)
7. [Key Design Decisions](#key-design-decisions)
8. [Setup & Deployment](#setup--deployment)
9. [Testing Strategy](#testing-strategy)
10. [Monitoring & Feedback](#monitoring--feedback)
11. [Next Steps](#next-steps)

---

## Project Vision

### What We're Building

**A lead generation platform for people selling AI voice agent services to local businesses.**

This is NOT an AI agent builder. This is a **prospecting intelligence tool** that finds and qualifies businesses ready to buy AI receptionists, voice booking systems, and call automation.

### Target Users

- Solo entrepreneurs starting AI services businesses
- GoHighLevel agencies adding AI offerings
- ElevenLabs/Vapi/Bland.ai resellers needing qualified leads
- Sales professionals pivoting to AI space

### Core Value Proposition

> "We find businesses that need AI voice agents. You close the deals. 30-second setup with smart scoring that shows you WHY each lead is qualified."

### Business Model

**Subscription Tiers:**
- Free: 1 search, 50 leads/month
- Pro ($49/mo): 10 searches, 1,000 leads/month
- Agency ($199/mo): 50 searches, 5,000 leads/month

**Additional Revenue:**
- ElevenLabs/Vapi affiliate commissions
- Optional success fee (10% first month)
- Future: White-label licensing for agencies

---

## Architecture Overview

### High-Level Flow

```
User → Next.js Frontend (Vercel)
         ↓
    Supabase (Database + Auth + RLS)
         ↓
    n8n Workflows (Lead Discovery + Enrichment)
         ↓
    Shared TypeScript Library (Detection Logic)
         ↓
    Google Places API + Web Scraping
         ↓
    Enriched Leads → Supabase → Frontend
         ↓
    Optional: GoHighLevel (CRM Integration)
```

### Component Responsibilities

**Next.js Frontend (Vercel):**
- User authentication (Supabase Auth)
- Search management UI
- Lead browsing/filtering
- Scoring transparency (breakdowns, tooltips)
- Export functionality

**Supabase:**
- PostgreSQL database (multi-tenant)
- Row-level security (workspace isolation)
- Real-time subscriptions
- Authentication & authorization

**n8n Workflows:**
- Workflow orchestration (retries, error handling)
- Google Places API calls (batching, pagination)
- Website scraping (HTML fetching)
- Long-running jobs (30+ minute workflows)
- Scheduled execution (weekly refresh)

**Shared TypeScript Library:**
- AI receptionist detection logic
- Call volume estimation algorithms
- Booking system analysis
- Lead scoring engine
- Version-controlled, unit-tested

**External APIs:**
- Google Places API (business data, reviews)
- GoHighLevel API (CRM push - optional per user)
- ElevenLabs/Vapi (affiliate links, future features)

---

## Current State

### What's Built (Phase 1-4 Complete)

✅ **Multi-tenant database** (workspaces, members, RLS)
✅ **Saved searches** (niche, location, radius, service type)
✅ **15 industry templates** (gyms, restaurants, salons, etc.)
✅ **Lead scoring algorithm** (0-10 points based on signals)
✅ **Score transparency** (interactive popover showing breakdown)
✅ **Signal filters** (no booking, phone issues, late hours, etc.)
✅ **Chain/franchise filtering** (pattern-based, not hardcoded lists)
✅ **n8n workflow** (Google Places → Scrape → Score → Supabase)
✅ **Frontend UI** (searches, leads table, templates, scoring guide)
✅ **CSV export** functionality
✅ **Authentication** (Supabase Auth with workspace support)

### What's In Progress (Phase 5 - Tier 1)

🟡 **AI receptionist detection** (detect existing AI, avoid wasted pitches)
🟡 **After-hours call estimation** (quantify missed revenue)
🟡 **Booking system depth analysis** (provider detection, upgrade angles)
🟡 **Shared TypeScript library** (extract logic from n8n, version control)
🟡 **Enhanced UI** (methodology tooltips, feedback loop)

### What's Next (Phase 5 - Tier 2+)

⏸️ Pitch template library (email/call scripts per niche)
⏸️ Success tracking (lead status pipeline, win/loss analysis)
⏸️ Script generator (AI-powered pitch automation)
⏸️ Territory heatmaps (visual lead density)
⏸️ Competitor landscape analysis (adoption rate in area)

---

## Tier 1 Features (In Progress)

### Feature 1: AI Receptionist Detection

**Goal:** Avoid pitching businesses that already have AI voice agents.

**Detection Methods:**
1. **Provider script detection** (high confidence)
   - Scan website HTML for: Dialpad, CallRail, Smith.ai, ElevenLabs, Vapi, Bland.ai
   - Example: `<script src="dialpad.com/widget.js"></script>` → Detected

2. **Keyword matching** (medium confidence)
   - Requires 2+ keyword matches to reduce false positives
   - Keywords: "AI-powered phone", "AI receptionist", "automated answering", etc.

3. **Review mentions** (low confidence)
   - Reviews mentioning "automated system", "robot answered"
   - Requires manual verification

**Output Schema:**
```typescript
{
  has_ai_receptionist: boolean,
  ai_provider: string | null,              // "Dialpad AI", "ElevenLabs", etc.
  ai_detection_confidence: 'high' | 'medium' | 'low' | 'none',
  ai_detection_method: 'provider_script' | 'keyword_match' | 'review_mention' | 'none',
  ai_detection_signals: string[],          // ["Dialpad AI script found", ...]
  enrichment_metadata: {
    ai_detection: {
      version: 1,
      detected_at: "2025-01-31T10:00:00Z"
    }
  }
}
```

**Scoring Impact:**
- High confidence AI detected: -5 points (skip lead)
- Medium confidence: -2 points (deprioritize, flag for verification)
- Low confidence: 0 points (uncertain, no penalty)

**False Positive Target:** <10% error rate

---

### Feature 2: After-Hours Call Estimation

**Goal:** Quantify missed revenue opportunity to strengthen pitch.

**Methodology:**
```
Annual Customers = Reviews ÷ 0.01  (1% of customers leave reviews)
Annual Calls = Annual Customers × Calls_Per_Customer[niche]
Weekly Calls = Annual Calls ÷ 52
After-Hours % = MIN(0.35, (168 - Hours_Open_Per_Week) ÷ 168)
After-Hours Calls = Weekly Calls × After-Hours %
Missed Calls = After-Hours Calls × 0.80  (80% unanswered)
Missed Revenue = Missed Calls × 4 weeks × Avg_Order_Value × 0.50
```

**Industry Benchmarks:**
| Niche | Calls/Customer/Year | Avg Order Value |
|-------|---------------------|-----------------|
| Restaurant | 15 | $45 |
| Hair Salon | 10 | $65 |
| Barber Shop | 8 | $35 |
| Dental | 12 | $200 |
| Real Estate | 5 | $5,000 |
| Gym | 8 | $150 |

**Output Schema:**
```typescript
{
  weekly_call_volume_estimate: number,
  after_hours_calls_per_week: number,
  missed_calls_per_week: number,
  estimated_monthly_revenue_loss: number,
  call_estimate_confidence: 'high' | 'medium' | 'low',
  call_estimate_methodology: string  // Human-readable explanation
}
```

**Confidence Levels:**
- High (100+ reviews): ±20% accuracy
- Medium (20-99 reviews): ±40% accuracy
- Low (<20 reviews): ±60% accuracy

**Transparency:** Full methodology exposed in UI tooltips and documentation.

---

### Feature 3: Booking System Depth Analysis

**Goal:** Identify upgrade opportunities vs greenfield opportunities.

**Provider Detection:**
```typescript
{
  'calendly.com': { name: 'Calendly', tier: 'basic' },
  'acuityscheduling.com': { name: 'Acuity', tier: 'intermediate' },
  'mindbodyonline.com': { name: 'Mindbody', tier: 'advanced' },
  'squareup.com/appointments': { name: 'Square', tier: 'intermediate' },
  'setmore.com': { name: 'Setmore', tier: 'basic' }
}
```

**Known Gaps (per provider):**
- Calendly: No SMS reminders, no phone integration, no waitlist
- Setmore: Limited automation, basic features only
- Square: No advanced routing, basic scheduling

**Output Schema:**
```typescript
{
  booking_provider: string | null,
  booking_system_tier: 'none' | 'basic' | 'intermediate' | 'advanced' | 'unknown',
  booking_system_gaps: string[],
  booking_upgrade_opportunity: boolean
}
```

**Scoring Impact:**
- No system: +2 points (greenfield opportunity)
- Basic system: +1 point (upgrade angle)
- Advanced system: 0 points (complement angle, not replacement)

**Caveat:** Detection is best-effort. UI shows as informational badges, not firm judgments.

---

## Technical Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Hosting:** Vercel
- **UI Library:** shadcn/ui (Radix UI primitives + Tailwind)
- **State Management:** React Query (TanStack Query)
- **Styling:** Tailwind CSS
- **Charts:** Recharts (future: territory heatmaps)
- **Date Handling:** date-fns

### Backend
- **Database:** Supabase (PostgreSQL 15)
- **Auth:** Supabase Auth (email/password, social logins)
- **Security:** Row-level security (workspace isolation)
- **Real-time:** Supabase Realtime (lead updates)
- **API:** Supabase REST API + PostgREST

### Workflow Orchestration
- **Engine:** n8n (self-hosted or cloud)
- **Scheduling:** Cron Trigger (Sundays 9pm ET)
- **Webhooks:** On-demand "Run Now" trigger from frontend
- **Execution:** Long-running jobs (30+ min), built-in retries

### Shared Logic
- **Language:** TypeScript
- **Build Tool:** Rollup (bundler)
- **Output:** CommonJS (for n8n compatibility)
- **Testing:** Jest
- **Coverage Target:** 80% lines/functions

### External APIs
- **Google Places API:** Business search, details, reviews
- **Web Scraping:** Cheerio (HTML parsing) or Playwright (dynamic sites)
- **GoHighLevel API:** Contact/Opportunity creation (optional per user)
- **ElevenLabs/Vapi:** Affiliate links (future integrations)

### CI/CD
- **Version Control:** Git + GitHub
- **CI Pipeline:** GitHub Actions
- **Deployment:**
  - Frontend: Vercel (auto-deploy on push to main)
  - Database: Supabase migrations
  - n8n: Manual deployment via git pull + npm build
  - Shared lib: CI tests, manual deployment to n8n host

---

## Development Workflow

### Repository Structure

```
/goHighLevelLeads/
├── docs/
│   ├── Overview.md                    # Original spec
│   ├── PHASE_4_PROGRESS.md            # Phase 4 completion notes
│   ├── SCORING_ALGORITHM.md           # Scoring documentation
│   └── IMPLEMENTATION_CONTEXT.md      # This file
├── frontend/
│   ├── src/
│   │   ├── components/                # React components
│   │   ├── pages/                     # Next.js pages
│   │   ├── hooks/                     # React Query hooks
│   │   └── lib/                       # Utils, Supabase client
│   ├── package.json
│   └── next.config.js
├── shared/
│   ├── src/
│   │   ├── ai-detection/              # AI detection module
│   │   ├── call-estimation/           # Call estimation module
│   │   ├── booking-detection/         # Booking detection module
│   │   ├── scoring-engine/            # Lead scoring logic
│   │   ├── __tests__/                 # Unit tests
│   │   └── index.ts                   # Entry point (exports)
│   ├── dist/
│   │   └── index.js                   # Built bundle (CommonJS)
│   ├── package.json
│   ├── rollup.config.js
│   └── tsconfig.json
├── n8n-workflows/
│   ├── lead-enrichment.json           # Main workflow export
│   └── backfill-enrichment.json       # Re-enrichment workflow
├── scripts/
│   ├── backfill-enrichment.ts         # Manual re-enrichment script
│   └── deploy-shared-lib.sh           # Deployment automation
├── .github/
│   └── workflows/
│       ├── test-shared-lib.yml        # CI for shared library
│       └── test-frontend.yml          # CI for frontend
└── supabase/
    └── migrations/
        ├── 001_initial_schema.sql
        ├── 002_add_enrichment_fields.sql
        └── 003_create_enrichment_logs.sql
```

### Git Workflow

**Branches:**
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/ai-detection` - Feature branches
- `hotfix/detection-v2` - Urgent fixes

**Commit Convention:**
```
type(scope): Subject

[optional body]

Examples:
- feat(ai-detection): Add ElevenLabs provider detection
- fix(scoring): Correct after-hours percentage calculation
- docs(readme): Update setup instructions
- test(booking): Add fixture for Square Appointments
- chore(deps): Upgrade TypeScript to 5.3.3
```

### Code Review Checklist

**Before merging:**
- [ ] Tests pass (`npm test`)
- [ ] Coverage >80% for new code
- [ ] TypeScript builds without errors
- [ ] Linting passes (ESLint)
- [ ] Manual testing on staging
- [ ] Documentation updated
- [ ] Migration tested (if DB changes)

---

## Key Design Decisions

### Decision 1: Keep n8n for Orchestration (Not Migrate to Vercel)

**Context:** Considered moving workflows to Next.js API routes for simplicity.

**Decision:** Keep n8n, extract business logic to TypeScript.

**Rationale:**
- n8n handles long-running jobs (30+ min) natively
- Built-in retry logic, error handling, rate limiting
- Vercel has 10-60s timeout limits
- Would need separate queue infrastructure (BullMQ, Inngest, etc.)
- n8n UI provides execution visibility

**Tradeoff:** Two systems to maintain, but each does what it's best at.

---

### Decision 2: Shared TypeScript Library (Not Pure n8n)

**Context:** Original plan had all logic in n8n Function nodes (no version control).

**Decision:** Extract detection/scoring to TypeScript library, import in n8n.

**Rationale:**
- Version control (Git tracks all changes)
- Unit testing (Jest, fixtures)
- Code reuse (can use in frontend if needed)
- Type safety (TypeScript vs plain JS)
- CI validation (tests run on every commit)

**Implementation:** Rollup bundles to CommonJS, n8n requires it:
```javascript
const { detectAI } = require('/opt/n8n/repo/shared/dist/index.js');
```

---

### Decision 3: Focus on AI Voice Agents Only (Not Multi-Service)

**Context:** Considered expanding to AI marketing, chatbots, web refresh, SEO.

**Decision:** Laser focus on AI voice agents (receptionists, booking systems).

**Rationale:**
- Clear pain point: "Phone issues in reviews" is detectable and urgent
- Market timing: Voice AI just became affordable (ElevenLabs, Vapi launched recently)
- Higher ACV: $200-500/mo recurring vs one-time web projects
- Easier to sell: Specific problem with obvious solution
- Avoid dilution: Better to nail one thing than half-ass five things

**Future:** Can add chatbots (easy upsell) after validating voice agent market.

---

### Decision 4: Transparent Scoring Methodology

**Context:** Could hide scoring logic as "proprietary algorithm."

**Decision:** Expose full methodology in tooltips, docs, and UI.

**Rationale:**
- Builds trust ("I understand why this lead scored 8/10")
- Educational ("Now I know what signals matter")
- Actionable ("I can reference this in my pitch")
- Honest ("This is an estimate, not a guarantee")

**Disclaimer:** Always shown alongside estimates:
> "⚠️ This is an estimate based on industry benchmarks, not exact measurement. Use as conversation starter."

---

### Decision 5: JSONB for Enrichment Metadata

**Context:** Could add dedicated columns for every new signal.

**Decision:** Use `enrichment_metadata JSONB` for flexible/experimental data.

**Rationale:**
- Avoid schema churn (no migration for every new signal)
- Store detailed data (full detection results, debug info)
- Versioning support (track which algorithm version was used)
- Quick iteration (can add new fields without DB changes)

**Pattern:**
```typescript
// Top-level columns for critical/filtered fields:
has_ai_receptionist: boolean  // Used in WHERE clause

// JSONB for detailed/experimental data:
enrichment_metadata: {
  ai_detection: {
    version: 1,
    method: "provider_script",
    signals: ["Dialpad AI script found"],
    detected_at: "2025-01-31T10:00:00Z"
  }
}
```

---

## Setup & Deployment

### Local Development Setup

**Prerequisites:**
- Node.js 20+
- PostgreSQL (via Supabase local dev)
- n8n (Docker or cloud account)

**Steps:**

```bash
# 1. Clone repository
git clone https://github.com/yourusername/gohighlevel-leads.git
cd gohighlevel-leads

# 2. Install dependencies
cd frontend && npm install
cd ../shared && npm install

# 3. Set up environment variables
cp frontend/.env.example frontend/.env.local
# Fill in: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Run Supabase migrations
cd supabase
supabase db reset  # Creates tables, applies migrations

# 5. Build shared library
cd ../shared
npm run build
# Output: shared/dist/index.js

# 6. Start frontend dev server
cd ../frontend
npm run dev
# Open: http://localhost:3000

# 7. Set up n8n (separate terminal)
docker run -it --rm \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -v $(pwd)/shared/dist:/opt/n8n/shared:ro \
  n8nio/n8n

# Open: http://localhost:5678
# Import workflow from n8n-workflows/lead-enrichment.json
```

---

### Production Deployment

**Frontend (Vercel):**
```bash
# 1. Connect GitHub repo to Vercel
# 2. Configure environment variables in Vercel dashboard:
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - SUPABASE_SERVICE_ROLE_KEY (server-only)

# 3. Deploy automatically on push to main
git push origin main
# Vercel builds and deploys
```

**Shared Library (n8n Host):**
```bash
# On n8n server:
cd /opt/n8n
git clone https://github.com/yourusername/gohighlevel-leads.git repo
cd repo/shared
npm install
npm run build

# Update n8n environment:
# Add to docker-compose.yml or .env:
SHARED_LIB_PATH=/opt/n8n/repo/shared/dist/index.js

# Restart n8n (if env changed):
docker-compose restart n8n

# Future updates:
cd /opt/n8n/repo
git pull
cd shared
npm run build
# n8n automatically picks up new code on next execution
```

**Database Migrations:**
```bash
# Run migrations on production:
supabase db push

# Or via Supabase dashboard:
# Settings → Database → Run SQL
# Paste migration SQL
```

---

### Deployment Checklist

**Before deploying to production:**
- [ ] All tests pass (`npm test` in shared/)
- [ ] Build succeeds (`npm run build` in shared/)
- [ ] Staging deployment tested (run 20 test leads)
- [ ] Supabase migration tested on staging database
- [ ] RLS policies verified (test as non-admin user)
- [ ] n8n workflow tested with new shared lib
- [ ] Frontend env vars configured in Vercel
- [ ] Error monitoring set up (Sentry or similar)
- [ ] Backup database before schema changes
- [ ] Communication plan (notify users if downtime)

---

## Testing Strategy

### Unit Tests (Shared Library)

**Coverage Target:** 80% lines, 80% functions

**Test Files:**
```
shared/src/__tests__/
├── ai-detection.test.ts
├── call-estimation.test.ts
├── booking-detection.test.ts
└── scoring-engine.test.ts
```

**Fixture Management:**
```
shared/src/__tests__/fixtures/
├── dialpad-website.html       # Real Dialpad customer site
├── callrail-website.html      # Real CallRail site
├── elevenlabs-website.html    # ElevenLabs integration
├── no-ai-website.html         # False positive test
├── calendly-booking.html      # Calendly detection
└── mindbody-booking.html      # Advanced booking system
```

**Adding New Fixtures:**
```bash
# When n8n processes a problematic lead:
# 1. Export HTML from n8n execution log
# 2. Save to fixtures folder
curl https://example-problem-site.com > fixtures/example-problem.html

# 3. Write test case
test('handles edge case from example-problem site', () => {
  const html = readFileSync('fixtures/example-problem.html', 'utf-8');
  const result = detectAI(html, []);
  expect(result.confidence).toBe('low');
});

# 4. Commit
git add src/__tests__/fixtures/example-problem.html
git add src/__tests__/ai-detection.test.ts
git commit -m "test: Add fixture for edge case detection"
```

---

### Integration Tests (n8n Workflow)

**Manual Testing Workflow:**
```
1. Create test saved search in staging database
2. Trigger n8n workflow via webhook or manual execution
3. Verify execution completes without errors
4. Check Supabase for enriched leads:
   - has_ai_receptionist populated
   - call estimates present
   - booking provider detected
5. Review execution logs for any warnings
6. Test edge cases:
   - Lead with no website
   - Lead with broken/slow website
   - Lead with unusual review count (0, 10,000)
```

**Test Accounts:**
- Staging workspace: `test-workspace-id`
- Test user: `test@example.com`
- Test saved search: Durham gyms (known results)

---

### End-to-End Tests (Frontend)

**Critical User Flows:**
1. **Signup → Create Search → View Leads**
   - User signs up with email
   - Creates workspace
   - Uses template to create search
   - Triggers "Run Now"
   - Sees leads appear in table

2. **Filter & Export**
   - Apply signal filters (no AI, phone issues)
   - Review score breakdowns
   - Export to CSV
   - Verify CSV contains enrichment data

3. **Feedback Loop**
   - Click "Report Incorrect" on AI detection
   - Submit correction
   - Verify feedback saved to database

**Tools:** Playwright (future) or manual QA checklist

---

## Monitoring & Feedback

### Enrichment Logs Dashboard

**Purpose:** Track enrichment success rate and performance.

**Schema:**
```sql
CREATE TABLE enrichment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  enrichment_type TEXT,  -- 'ai_detection', 'call_estimation', 'booking_detection'
  success BOOLEAN,
  error_message TEXT,
  execution_time_ms INT,
  enrichment_version INT,
  source TEXT,  -- 'n8n' or 'backfill_script'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Dashboard Query:**
```sql
SELECT
  enrichment_type,
  COUNT(*) as total,
  SUM(CASE WHEN success THEN 1 ELSE 0 END) as successes,
  ROUND(100.0 * SUM(CASE WHEN success THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate,
  ROUND(AVG(execution_time_ms), 0) as avg_time_ms
FROM enrichment_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY enrichment_type;
```

---

### AI Detection Feedback Loop

**Purpose:** Track false positives, improve detection accuracy.

**Schema:**
```sql
CREATE TABLE ai_detection_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  detected_as_has_ai BOOLEAN,
  actual_has_ai BOOLEAN,  -- User correction
  detection_signals JSONB,
  detection_version INT,
  corrected_by UUID REFERENCES auth.users(id),
  corrected_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Weekly Review Process:**

**Every Monday (15-30 min):**

1. **Check error rate:**
```sql
SELECT
  detection_version,
  COUNT(*) as total,
  SUM(CASE WHEN detected_as_has_ai != actual_has_ai THEN 1 ELSE 0 END) as errors,
  ROUND(100.0 * SUM(CASE WHEN detected_as_has_ai != actual_has_ai THEN 1 ELSE 0 END) / COUNT(*), 2) as error_rate
FROM ai_detection_feedback
WHERE corrected_at > NOW() - INTERVAL '7 days'
GROUP BY detection_version;
```

2. **Decision tree:**
   - <10% error: ✅ No action needed
   - 10-20% error: ⚠️ Review cases, plan update
   - >20% error: 🚨 Hotfix required within 24 hours

3. **If update needed:**
   - Identify pattern (e.g., keyword too broad)
   - Create new version file (`providers-v2.ts`)
   - Update detection logic
   - Deploy via git pull + npm build
   - Document in CHANGELOG.md

---

### Performance Metrics

**Track:**
- Enrichment success rate (target: >95%)
- Average execution time per lead (target: <5 seconds)
- False positive rate (target: <10%)
- User-reported issues (review weekly)

**Tools:**
- Supabase dashboard (query logs)
- n8n execution history (workflow runs)
- GitHub Issues (bug reports)
- Custom analytics (future: Mixpanel/PostHog)

---

## Next Steps

### Immediate (Week 1-3): Tier 1 Features

**Week 1: AI Detection**
- [x] Create shared library scaffolding
- [ ] Build AI detection module with versioned providers
- [ ] Write unit tests with HTML fixtures
- [ ] Deploy to n8n host and test Function node require()
- [ ] Run Supabase migration (add enrichment columns)
- [ ] Update n8n workflow to call detection module
- [ ] Test end-to-end with 20 real leads

**Week 2: Call Estimation + Booking Detection**
- [ ] Create call estimation module with documented benchmarks
- [ ] Create booking detection module with provider patterns
- [ ] Integrate into n8n workflow
- [ ] Create backfill script for re-enriching existing leads
- [ ] Run backfill on staging (test with 50 leads)

**Week 3: Scoring + UX Polish**
- [ ] Update scoring algorithm with new signals
- [ ] Add UI tooltips showing methodology
- [ ] Add "Report Incorrect" feedback UI
- [ ] Create enrichment dashboard in Supabase
- [ ] Set up GitHub Actions CI pipeline
- [ ] Document weekly monitoring routine
- [ ] Run production backfill (all existing leads)

---

### Short-Term (Week 4-6): Sales Enablement

**Week 4: Validation & Iteration**
- [ ] Review false positive rate from first week
- [ ] Collect user feedback on call estimates
- [ ] Tune detection rules if needed
- [ ] Add 10+ new industry templates (real estate, legal, auto repair)

**Week 5-6: Pitch Assistance**
- [ ] Build pitch template library (10 templates per niche)
- [ ] Create dynamic script generator (GPT-4/Claude API)
- [ ] Add lead detail page with pitch insights
- [ ] Integrate ElevenLabs affiliate links

---

### Medium-Term (Month 2-3): Success Tracking

- [ ] Lead status pipeline (New → Contacted → Demo → Won/Lost)
- [ ] Win/loss analysis dashboard
- [ ] Pattern recognition ("Phone issues = 35% close rate")
- [ ] ROI tracking per saved search
- [ ] Email templates for outreach

---

### Long-Term (Month 4+): Scale & Differentiation

- [ ] Territory heatmaps (visual lead density)
- [ ] Competitor landscape analysis (adoption rate)
- [ ] Phone call testing (Twilio integration, IVR detection)
- [ ] Chrome extension (Google Maps overlay)
- [ ] White-label licensing for agencies
- [ ] Multi-language support (expand beyond US/Canada)

---

## Appendix

### Environment Variables Reference

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...  # Server-only!
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/run-now
N8N_WEBHOOK_JWT_SECRET=your-secret-key
```

**n8n (docker-compose.yml or .env):**
```bash
SHARED_LIB_PATH=/opt/n8n/repo/shared/dist/index.js
NODE_FUNCTION_ALLOW_EXTERNAL=/opt/n8n/repo/shared/dist/*
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
GOOGLE_PLACES_API_KEY=AIza...
```

---

### Useful Commands

**Shared Library:**
```bash
cd shared
npm run build          # Build CommonJS bundle
npm test               # Run unit tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

**Frontend:**
```bash
cd frontend
npm run dev            # Dev server (localhost:3000)
npm run build          # Production build
npm run lint           # ESLint check
npm run type-check     # TypeScript check
```

**Database:**
```bash
supabase db reset      # Reset to migrations
supabase db push       # Apply migrations to remote
supabase migration new add_feature  # Create migration
```

**n8n:**
```bash
# Export workflow
n8n export:workflow --id=123 --output=workflows/

# Import workflow
n8n import:workflow --input=workflows/lead-enrichment.json

# Execute workflow manually
n8n execute --id=123
```

---

### Key Contacts & Resources

**Project Lead:** [Your Name]
**Repository:** https://github.com/yourusername/gohighlevel-leads
**Staging Environment:** https://staging-leads.vercel.app
**Production:** https://leads.yourdomain.com
**Supabase Dashboard:** https://app.supabase.com/project/your-project
**n8n Instance:** https://your-n8n.com

**Documentation:**
- [Supabase Docs](https://supabase.com/docs)
- [n8n Docs](https://docs.n8n.io)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)
- [GoHighLevel API](https://highlevel.stoplight.io)

---

**End of Implementation Context**

*This document should be updated as major decisions are made or architecture changes. Last updated: January 31, 2025*
