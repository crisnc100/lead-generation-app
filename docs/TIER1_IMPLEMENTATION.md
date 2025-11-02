# Tier 1 Implementation - Next Steps

## Completed ✅

1. ✅ Shared library structure created
2. ✅ AI detection module (with script stripping to prevent false positives)
3. ✅ Call estimation module (with guardrails)
4. ✅ Booking detection module (with script stripping)
5. ✅ Database migration for enrichment fields
6. ✅ JWT expiration added to trigger-search edge function
7. ✅ Comprehensive test coverage

## Critical Fixes Applied ✅

1. ✅ **AI Detection**: Patterns anchored to actual HTML tag contexts
2. ✅ **Booking Detection**: Patterns anchored to actual HTML tag contexts  
3. ✅ **Script Stripping**: Inline scripts removed to prevent false positives from string literals
4. ✅ **Call Estimation**: Guardrails added (min/max caps, unknown niche handling)
5. ✅ **JWT Security**: Expiration added (1 hour)

## Next Steps - n8n Integration

### 1. Update n8n Workflow to Verify JWT Expiration

The n8n workflow needs to verify the `exp` claim. Add this to the JWT verification node:

```javascript
const jwt = require('jsonwebtoken');
const secret = $env.N8N_WEBHOOK_SECRET;
const { token } = $json;

try {
  const payload = jwt.verify(token, secret);
  
  // Verify expiration
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    throw new Error('Token expired');
  }
  
  return {
    json: {
      workspace_id: payload.workspace_id,
      search_id: payload.search_id,
      location: payload.location,
      niche: payload.niche,
      radius_miles: payload.radius_miles,
      service: payload.service,
      min_score: payload.min_score
    }
  };
} catch (e) {
  throw new Error('Unauthorized: Invalid or expired token');
}
```

### 2. Deploy Shared Library to n8n Host

```bash
# On n8n server
cd /opt/n8n/repo/shared
npm install
npm run build
```

### 3. Update n8n Workflow to Use Shared Library

In the n8n workflow, add Function nodes that use the shared library:

**AI Detection Node:**
```javascript
const { detectAI } = require('/opt/n8n/repo/shared/dist/index.js');

const html = $json.website_html;
const reviews = $json.reviews || [];
const businessName = $json.name;

const aiResult = detectAI({
  website_html: html,
  reviews: reviews,
  business_name: businessName
});

return {
  json: {
    ...$json,
    has_ai_receptionist: aiResult.has_ai_receptionist,
    ai_provider: aiResult.ai_provider,
    ai_detection_confidence: aiResult.ai_detection_confidence,
    ai_detection_method: aiResult.ai_detection_method,
    ai_detection_signals: aiResult.ai_detection_signals,
    enrichment_metadata: aiResult.enrichment_metadata
  }
};
```

**Call Estimation Node:**
```javascript
const { estimateCallVolume } = require('/opt/n8n/repo/shared/dist/index.js');

const reviewCount = $json.review_count || 0;
const niche = $json.niche || 'default';
const hoursOpen = $json.hours_open_per_week; // Calculate from Google Places hours

const callEstimate = estimateCallVolume({
  review_count: reviewCount,
  niche: niche,
  hours_open_per_week: hoursOpen
});

return {
  json: {
    ...$json,
    weekly_call_volume_estimate: callEstimate.weekly_call_volume_estimate,
    after_hours_calls_per_week: callEstimate.after_hours_calls_per_week,
    missed_calls_per_week: callEstimate.missed_calls_per_week,
    estimated_monthly_revenue_loss: callEstimate.estimated_monthly_revenue_loss,
    call_estimate_confidence: callEstimate.call_estimate_confidence,
    call_estimate_methodology: callEstimate.call_estimate_methodology
  }
};
```

**Booking Detection Node:**
```javascript
const { analyzeBookingSystem } = require('/opt/n8n/repo/shared/dist/index.js');

const html = $json.website_html;

const bookingResult = analyzeBookingSystem({
  website_html: html
});

return {
  json: {
    ...$json,
    booking_provider: bookingResult.booking_provider,
    booking_system_tier: bookingResult.booking_system_tier,
    booking_system_gaps: bookingResult.booking_system_gaps,
    booking_upgrade_opportunity: bookingResult.booking_upgrade_opportunity
  }
};
```

### 4. Run Database Migration

```sql
-- Run in Supabase SQL Editor
\i supabase/migrations/002_add_tier1_enrichment_fields.sql
```

### 5. Test End-to-End

1. Run a test search from frontend
2. Verify n8n workflow executes successfully
3. Check Supabase leads table for enrichment fields
4. Verify false positives are prevented (test with known problematic sites)

## Testing Checklist

- [ ] Run `npm test` in `shared/` directory - all tests pass
- [ ] Build shared library: `npm run build` - no errors
- [ ] Deploy to n8n host
- [ ] Update n8n workflow with shared library imports
- [ ] Add JWT expiration verification to n8n
- [ ] Run database migration
- [ ] Test with 20 real leads
- [ ] Verify false positives are prevented

## Documentation

All code is documented with:
- Version numbers (1.1 for fixed detection patterns)
- Methodology explanations
- Guardrail descriptions
- Test coverage for edge cases

