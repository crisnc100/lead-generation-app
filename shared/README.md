# @ghl-leads/shared

Shared TypeScript library for lead detection and enrichment logic.

## Purpose

This library contains the core business logic for:
- AI receptionist detection
- Call volume estimation
- Booking system analysis
- Lead scoring

It's designed to be:
- Version-controlled (Git tracks all changes)
- Unit tested (Jest, fixtures)
- Type-safe (TypeScript)
- Reusable (can be used in n8n and potentially frontend)

## Structure

```
shared/
├── src/
│   ├── ai-detection/      # AI detection logic
│   ├── call-estimation/   # Call volume estimation
│   ├── booking-detection/ # Booking system analysis
│   ├── scoring-engine/    # Lead scoring logic
│   ├── __tests__/         # Unit tests
│   └── index.ts           # Entry point
├── dist/                  # Built bundle (CommonJS)
└── package.json
```

## Build

```bash
npm install
npm run build
```

Output: `dist/index.js` (CommonJS bundle for n8n)

## Test

```bash
npm test
npm run test:watch
npm run test:coverage
```

## Usage in n8n

```javascript
const { detectAI, estimateCallVolume, detectBookingSystem } = require('/opt/n8n/repo/shared/dist/index.js');

// In n8n Function node
const html = $json.website_html;
const reviewCount = $json.review_count;
const niche = $json.niche;

const aiResult = detectAI(html, []);
const callEstimate = estimateCallVolume(reviewCount, niche);
const bookingResult = detectBookingSystem(html);
```

## Development Workflow

1. Make changes in `src/`
2. Run `npm run build` to compile
3. Run `npm test` to verify tests pass
4. Deploy to n8n host (git pull + npm build)
5. n8n automatically picks up new code on next execution

## Versioning

- Version 1.0.0: Initial release with AI detection, call estimation, booking detection
- Future versions will increment based on breaking changes

