# 🗺️ PRODUCT ROADMAP - GHL Lead Finder

**Project:** GoHighLevel Lead Finder - AI Receptionist SaaS
**Last Updated:** October 20, 2025
**Status:** Phase 3 Complete ✅ - Moving to Polish & Expansion

---

## 🎯 Vision & Strategy

**What We're Building:**
A multi-tenant SaaS platform that automatically finds and scores local businesses that need AI receptionist services. Users create "Saved Searches," click "Run Now," and get scored leads based on real signals.

**Target Market:**
- AI receptionist agencies
- GoHighLevel users selling AI voice services
- Marketing agencies targeting local businesses

**Go-to-Market Strategy:**
1. **Phase 1 (Current):** Health & Wellness vertical (gyms, yoga, martial arts)
2. **Phase 2 (Q1 2026):** Expand to Home Services (HVAC, plumbing, landscaping)
3. **Phase 3 (Q2 2026):** Professional Services (law firms, real estate, insurance)
4. **Phase 4 (Q3 2026):** Multi-vertical platform with custom scoring per industry

---

## 📊 Current Status Overview

| Milestone | Status | Completion Date |
|-----------|--------|-----------------|
| ✅ Core Pipeline Working | **DONE** | **Oct 20, 2025** |
| 🎨 UI/UX Polish | **IN PROGRESS** | Target: Oct 22-23 |
| 📊 Export & Refinement | NEXT | Target: Oct 24-27 |
| 🏢 Category Expansion | PLANNED | Target: Nov 2025 |
| 💰 Billing & Pricing | PLANNED | Target: Dec 2025 |
| 🔌 GHL Integration | PLANNED | Target: Jan 2026 |

**Overall Progress:** 85% of MVP Complete

---

## 🚀 PHASE 3.5: UI/UX Polish (NEXT - Oct 22-23)

**Priority:** 🔴 HIGH - Make it feel professional
**Estimated Time:** 2-3 days
**Goal:** Transform functional UI into polished, delightful experience

### Task Breakdown

#### 1. Hover States & Interactive Elements (4-6 hours)
**Problem:** Elements don't feel clickable, lack visual feedback

**Tasks:**
- [ ] Add `cursor-pointer` to all buttons, links, and clickable cards
- [ ] Hover effects on table rows (background color change)
- [ ] Hover effects on cards (subtle shadow lift)
- [ ] Smooth transitions (150-200ms) on all hover states
- [ ] Active/pressed states for buttons
- [ ] Disabled states with proper styling (opacity 0.5)

**Acceptance Criteria:**
- Every clickable element has cursor change
- Hover feedback is immediate (<150ms)
- Disabled buttons visually distinct

---

#### 2. Loading States & Animations (6-8 hours)
**Problem:** No feedback during data fetching, feels broken

**Tasks:**
- [ ] Skeleton loaders for tables (shimmer effect)
- [ ] Loading spinners with proper sizing and colors
- [ ] "Run Now" button progress indicator (0% → 100%)
  - Show Google Places search → Review analysis → Website scraping → Saving
- [ ] Fade-in animations for content (opacity 0 → 1, 300ms)
- [ ] Stagger animations for table rows (50ms delay per row)
- [ ] Success animation when leads appear (confetti or check icon)

**Acceptance Criteria:**
- User always knows what's happening
- Loading states feel smooth, not jarring
- Success states are celebratory

---

#### 3. Visual Polish (4-6 hours)
**Problem:** Spacing, colors, and hierarchy need refinement

**Tasks:**
- [ ] Consistent spacing (use Tailwind spacing scale: 4, 6, 8, 12, 16)
- [ ] Color contrast audit (WCAG AA minimum)
- [ ] Proper shadows (use Tailwind shadow-sm, shadow-md, shadow-lg)
- [ ] Icon sizing consistency (h-4 w-4 for inline, h-5 w-5 for standalone)
- [ ] Empty states with illustrations
  - Saved Searches page: "No searches yet" with icon
  - Leads page: "No leads yet, run a search!" with icon

**Acceptance Criteria:**
- Design feels cohesive
- Text is readable in all lighting conditions
- Empty states guide users to next action

---

#### 4. Micro-interactions (2-3 hours)
**Problem:** Actions feel mechanical, not delightful

**Tasks:**
- [ ] Toast notifications with slide-in animation
- [ ] Button press animation (scale 0.95 on click)
- [ ] Success toast with checkmark icon
- [ ] Error toast with warning icon
- [ ] Smooth page transitions (fade between routes)
- [ ] Copy-to-clipboard animation (checkmark appears)

**Acceptance Criteria:**
- Every action has feedback
- Animations are subtle, not distracting
- Users feel confident their action worked

---

### Testing Checklist
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile (responsive design)
- [ ] Test with slow 3G connection (loading states)
- [ ] Test keyboard navigation (tab order)
- [ ] Test screen reader (accessibility)

---

## 📊 PHASE 4: Export & Refinement (Oct 24-27)

**Priority:** 🔴 HIGH - Core functionality users expect
**Estimated Time:** 3-4 days
**Goal:** Make leads actionable and scoring accurate

### 1. Export Functionality ⭐ CRITICAL (1-2 days)

**Current State:**
- ✅ CSV export implemented in code
- ❌ Not tested thoroughly
- ❌ No Excel (.xlsx) option

**Tasks:**
- [ ] Test CSV export with real data
- [ ] Add Excel (.xlsx) export option
  - Use library: `xlsx` or `exceljs`
  - Format with proper column widths
  - Include hyperlinks for websites
- [ ] Add "Export Filtered Results" option
  - Only export leads that match current filters
  - Show count before exporting
- [ ] Add date range selector before export
  - "Export leads from last 7 days"
  - "Export all leads"
  - "Export custom date range"
- [ ] Include all relevant fields:
  - Name, Phone, Email, Website
  - Address, City, State
  - Rating, Review Count
  - Lead Score, Why Flagged
  - Has Booking, Has Chat, Phone Issues
  - Date Added

**Acceptance Criteria:**
- User can export to CSV and Excel
- Export respects current filters
- All data is formatted properly
- File downloads immediately

---

### 2. Scoring Algorithm Refinement (1-2 days)

**Current State:**
- ✅ Basic scoring works (0-12 points)
- ❌ Not tested across multiple niches
- ❌ Thresholds might be too strict/loose

**Tasks:**
- [ ] Run test searches for different niches:
  - Gyms in Durham, NC
  - Yoga studios in Charlotte, NC
  - Martial arts in Raleigh, NC
  - Pilates studios in Asheville, NC
- [ ] Analyze score distribution
  - What % of businesses qualify (target: 20-30%)?
  - Are high-quality leads scoring high?
  - Are low-quality leads scoring low?
- [ ] Adjust scoring weights if needed:
  - Current: Phone complaints +4, Booking +3, No booking +3, No chat +2
  - Maybe: Review signals more valuable than website?
- [ ] Add visual score breakdown in UI
  - Show which signals contributed to score
  - Example: "Score: 9 = Phone issues (+4) + No booking (+3) + Local (+1) + Not mobile (+1)"
- [ ] Document scoring logic in UI (tooltip or help modal)

**Acceptance Criteria:**
- 20-30% of businesses qualify as leads
- High-quality leads score 8+
- Low-quality leads score <7
- Users understand why a business was flagged

---

### 3. Search Criteria Expansion (1 day)

**Current State:**
- ✅ Free-text niche input
- ❌ No pre-defined templates
- ❌ No radius options

**Tasks:**
- [ ] Add niche dropdown with templates:
  - **Gyms & Fitness Centers**
  - **Yoga Studios**
  - **Martial Arts** (Jiu-Jitsu, Karate, Taekwondo, MMA)
  - **Pilates Studios**
  - **CrossFit Boxes**
  - **Dance Studios**
  - **Cycling Studios**
  - **Personal Training Studios**
  - Custom (user types their own)
- [ ] Add radius selector:
  - 5 miles
  - 10 miles (default)
  - 20 miles
  - 50 miles
- [ ] Add min/max review count filters:
  - Only businesses with 10+ reviews
  - Only businesses with <200 reviews (exclude huge chains)
- [ ] Add min/max rating filters:
  - Rating between 3.5 and 4.7 (sweet spot)

**Acceptance Criteria:**
- Users can select from common niches
- Radius affects search results
- Filters help narrow down ideal leads

---

## 🏢 PHASE 5: Category Expansion (Nov 2025)

**Priority:** 🟡 MEDIUM - Grow beyond fitness
**Estimated Time:** 1-2 weeks
**Goal:** Support multiple industries with customized scoring

### Current Category: Health & Wellness

**Supported Niches:**
- ✅ Gyms & Fitness Centers
- ✅ Yoga Studios
- ⏳ Martial Arts
- ⏳ Pilates
- ⏳ Med Spas
- ⏳ Chiropractors
- ⏳ Physical Therapy
- ⏳ Massage Therapy

### New Categories to Add

#### 1. Home Services
**Target:** HVAC, plumbers, electricians, landscaping

**Why good for AI receptionist:**
- High call volume (24/7 emergencies)
- Appointment scheduling critical
- Often small businesses (2-10 employees)
- Low tech adoption

**Scoring Adjustments:**
- Phone complaints more valuable (+5 points)
- After-hours availability signal (+3 points)
- Online booking less critical (+1 point)

**Example Niches:**
- HVAC companies
- Plumbers
- Electricians
- Landscaping companies
- Roofing contractors
- Pest control

---

#### 2. Professional Services
**Target:** Law firms, accountants, real estate agents

**Why good for AI receptionist:**
- Client intake process (lead capture)
- Appointment scheduling
- Phone screening needed

**Scoring Adjustments:**
- No website contact form (+3 points)
- No online booking (+2 points)
- Old website (+2 points)

**Example Niches:**
- Law firms
- Accounting firms
- Real estate agents
- Insurance agents
- Financial advisors

---

#### 3. Beauty & Personal Care
**Target:** Hair salons, barber shops, nail salons

**Why good for AI receptionist:**
- Appointment-heavy
- Often small businesses
- No-show problem (AI can send reminders)

**Scoring Adjustments:**
- No online booking (+4 points)
- Phone complaints (+3 points)
- No chat widget (+2 points)

**Example Niches:**
- Hair salons
- Barber shops
- Nail salons
- Med spas
- Tattoo shops

---

#### 4. Food & Dining (Lower Priority)
**Target:** Restaurants, cafes, food trucks

**Why lower priority:**
- Reservation systems are common
- Margins are thin (less budget for AI)
- Higher churn

**Example Niches:**
- Restaurants
- Cafes
- Food trucks
- Catering companies

---

### Implementation Plan

**Database Changes:**
```sql
-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text, -- lucide icon name
  scoring_config jsonb, -- category-specific scoring weights
  created_at timestamptz DEFAULT now()
);

-- Create niches table
CREATE TABLE niches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id),
  name text NOT NULL,
  description text,
  example_queries text[], -- ["gyms", "fitness centers"]
  created_at timestamptz DEFAULT now()
);
```

**Frontend Changes:**
- Category selector (tabs or dropdown)
- Niche selector filtered by category
- Display category-specific scoring logic

**n8n Workflow Changes:**
- Accept `category_id` in JWT payload
- Fetch category scoring config from Supabase
- Apply category-specific weights in scoring node

**Timeline:**
- Week 1: Database schema + seed data
- Week 1: Frontend category/niche selector
- Week 2: n8n scoring customization
- Week 2: Test with 3-4 new categories

---

## 💰 PHASE 6: Pricing & Billing (Dec 2025)

**Priority:** 🟡 MEDIUM - Monetization
**Estimated Time:** 1 week
**Goal:** Launch paid plans and track usage

### Pricing Tiers

| Plan | Price | Searches | Leads/Month |
|------|-------|----------|-------------|
| **Free** | $0 | 1 | 50 |
| **Pro** | $49/mo | 10 | 1,000 |
| **Agency** | $149/mo | 50 | 5,000 |

### Features to Build

**1. Stripe Integration (2-3 days)**
- [ ] Set up Stripe account
- [ ] Create products and prices in Stripe Dashboard
- [ ] Implement Stripe Checkout
- [ ] Handle webhook events (payment success, subscription cancelled)
- [ ] Store subscription status in `workspaces.plan` field

**2. Usage Tracking (1-2 days)**
- [ ] Track searches run per month
- [ ] Track leads created per month
- [ ] Display usage in Settings page
  - "You've used 3 of 10 searches this month"
  - "You've generated 247 of 1,000 leads this month"
- [ ] Enforce limits in n8n workflow
  - Check before running search
  - Return error if limit exceeded

**3. Customer Portal (1 day)**
- [ ] Link to Stripe Customer Portal
- [ ] Allow users to:
  - Update payment method
  - View invoices
  - Cancel subscription
  - Upgrade/downgrade plan

**4. Upgrade/Downgrade Flows (1 day)**
- [ ] Show upgrade prompts when limits hit
- [ ] Prorate charges for mid-cycle upgrades
- [ ] Handle downgrades at end of billing period

**5. Admin Dashboard (Future)**
- [ ] View all customers
- [ ] Track MRR (Monthly Recurring Revenue)
- [ ] See churn metrics

---

## 🔌 PHASE 7: GoHighLevel Integration (Jan 2026)

**Priority:** 🔵 LOW - Advanced feature
**Estimated Time:** 1 week
**Goal:** Push qualified leads directly to GHL

### Features to Build

**1. OAuth2 Flow (2-3 days)**
- [ ] Register OAuth app in GHL
- [ ] Build OAuth callback endpoint
- [ ] Store access/refresh tokens in `integrations` table
- [ ] Handle token refresh

**2. Contact Creation (1-2 days)**
- [ ] Map lead fields to GHL Contact fields
- [ ] Upsert by phone/email (avoid duplicates)
- [ ] Add custom fields:
  - Lead Score
  - Why Flagged
  - Niche
  - Service
  - Review Count
  - Rating

**3. Opportunity Creation (1-2 days)**
- [ ] Create Opportunity for qualified leads (score ≥7)
- [ ] Link to Contact
- [ ] Set pipeline and stage
- [ ] Set monetary value (customizable per user)

**4. Tags (1 day)**
- [ ] Add tags to Contacts:
  - `niche:gym`
  - `service:ai_receptionist`
  - `area:durham_nc`
  - `lead_source:lead_finder`

**5. Settings UI (1 day)**
- [ ] "Connect GoHighLevel" button
- [ ] Show connection status
- [ ] Configure:
  - Default pipeline
  - Default stage
  - Default opportunity value
  - Auto-push enabled/disabled

---

## 📅 30/60/90 Day Plan

### Next 7 Days (Oct 20-27, 2025)
**Focus:** Polish & Refinement

**Week 1 Goals:**
- ✅ Complete UI/UX polish
- ✅ Excel export working
- ✅ Scoring tested across multiple niches
- ✅ Search templates added

**Daily Breakdown:**
- **Day 1-2 (Oct 20-21):** Hover states, loading animations, visual polish
- **Day 3-4 (Oct 22-23):** Micro-interactions, toast notifications, empty states
- **Day 5 (Oct 24):** Excel export implementation
- **Day 6-7 (Oct 25-26):** Test searches, refine scoring, add templates

---

### Next 30 Days (Oct 20 - Nov 20, 2025)
**Focus:** Core Feature Completion

**Milestones:**
- ✅ UI/UX polished (Oct 22-23)
- ✅ Export & refinement complete (Oct 24-27)
- 🎯 3 new categories added (Nov 1-7)
- 🎯 Category-specific scoring (Nov 8-14)
- 🎯 Beta testing with 5 users (Nov 15-20)

---

### Next 60 Days (Oct 20 - Dec 20, 2025)
**Focus:** Monetization Launch

**Milestones:**
- ✅ All Phase 3-5 features complete
- 🎯 Stripe integration live (Dec 1-7)
- 🎯 Usage tracking enforced (Dec 8-10)
- 🎯 First paid customer (Dec 15)
- 🎯 10 paying customers (Dec 20)

---

### Next 90 Days (Oct 20 - Jan 20, 2026)
**Focus:** Scale & Integration

**Milestones:**
- 🎯 50 paying customers
- 🎯 GoHighLevel integration live
- 🎯 5 categories supported
- 🎯 $5k MRR (Monthly Recurring Revenue)

---

## 🎯 Success Metrics

### Product Metrics
- **Active Users:** Target 100 in Q4 2025
- **Searches Run:** Target 500/month by Jan 2026
- **Leads Generated:** Target 10,000/month by Jan 2026
- **Conversion Rate:** Free → Pro: 10%+

### Business Metrics
- **MRR (Monthly Recurring Revenue):** $5k by Jan 2026
- **Customer Acquisition Cost (CAC):** <$100
- **Lifetime Value (LTV):** $500+
- **LTV/CAC Ratio:** 5:1+
- **Churn Rate:** <5% monthly

### User Satisfaction
- **Net Promoter Score (NPS):** 50+
- **Lead Quality:** 80%+ of leads are "good fit"
- **Time Saved:** 10+ hours/week per user

---

## 🚧 Known Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Google Places API cost blows up | High | Medium | Implement rate limiting, cache results |
| Users don't convert Free → Pro | High | Medium | Add usage tracking dashboard, show value |
| Lead quality varies by niche | Medium | High | Category-specific scoring, user feedback loop |
| n8n rate limits or downtime | Medium | Low | Build in retry logic, queue system |
| Competitors copy our idea | Medium | High | Focus on execution speed, build moat with integrations |

---

## 📞 Support & Maintenance Plan

### Bug Fixes
- **P0 (Critical):** Fix within 4 hours
- **P1 (High):** Fix within 24 hours
- **P2 (Medium):** Fix within 1 week
- **P3 (Low):** Fix in next sprint

### Feature Requests
- Collect via in-app feedback button
- Prioritize by user votes + business impact
- Ship high-impact features every 2 weeks

### Customer Support
- Email support: support@leadfinder.com
- Response time: <24 hours
- Live chat (future): After 100 customers

---

**Last Updated:** October 20, 2025
**Next Review:** November 1, 2025
**Questions?** Contact the team
