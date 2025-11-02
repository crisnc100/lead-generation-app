/**
 * @ghl-leads/shared
 * 
 * Shared TypeScript library for lead detection and enrichment logic.
 * Used by n8n workflows and potentially frontend.
 */

// AI Detection Module
export * from './ai-detection';
export * from './ai-detection/types';
export * from './ai-detection/detect';
export * from './ai-detection/providers';

// Call Estimation Module
export * from './call-estimation';
export * from './call-estimation/types';
export * from './call-estimation/estimate';
export * from './call-estimation/benchmarks';

// Booking Detection Module
export * from './booking-detection';
export * from './booking-detection/types';
export * from './booking-detection/analyze';
export * from './booking-detection/providers';

// Scoring Engine (to be implemented)
// export * from './scoring-engine';

