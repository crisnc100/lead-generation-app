/**
 * Call Estimation Tests
 * 
 * Tests with edge cases and guardrails
 */

import { estimateCallVolume } from '../call-estimation/estimate';

describe('Call Estimation', () => {
  describe('Basic Calculation', () => {
    it('should calculate weekly calls for gym with 100 reviews', () => {
      const result = estimateCallVolume({
        review_count: 100,
        niche: 'gym',
        hours_open_per_week: 84, // 12 hours/day, 7 days
      });

      expect(result.weekly_call_volume_estimate).toBeGreaterThan(0);
      expect(result.call_estimate_confidence).toBe('high');
      expect(result.after_hours_calls_per_week).toBeGreaterThan(0);
      expect(result.missed_calls_per_week).toBeGreaterThan(0);
    });

    it('should calculate revenue loss for restaurant', () => {
      const result = estimateCallVolume({
        review_count: 250,
        niche: 'restaurant',
        hours_open_per_week: 70,
      });

      expect(result.estimated_monthly_revenue_loss).toBeGreaterThan(0);
      expect(result.call_estimate_confidence).toBe('high');
      expect(result.call_estimate_methodology).toContain('restaurant');
    });
  });

  describe('Guardrails', () => {
    it('should return zero for review count below minimum', () => {
      const result = estimateCallVolume({
        review_count: 3,
        niche: 'gym',
      });

      expect(result.weekly_call_volume_estimate).toBe(0);
      expect(result.estimated_monthly_revenue_loss).toBe(0);
      expect(result.call_estimate_confidence).toBe('low');
      expect(result.call_estimate_methodology).toContain('Insufficient review data');
    });

    it('should cap weekly calls at maximum', () => {
      const result = estimateCallVolume({
        review_count: 50000, // Extremely high review count
        niche: 'restaurant',
      });

      expect(result.weekly_call_volume_estimate).toBeLessThanOrEqual(10000);
      if (result.weekly_call_volume_estimate >= 10000) {
        expect(result.call_estimate_methodology).toContain('capped');
      }
    });

    it('should cap revenue loss at maximum', () => {
      const result = estimateCallVolume({
        review_count: 10000,
        niche: 'real_estate', // High order value
        hours_open_per_week: 40, // Lots of after-hours
      });

      expect(result.estimated_monthly_revenue_loss).toBeLessThanOrEqual(50000);
    });
  });

  describe('Confidence Levels', () => {
    it('should return high confidence for 100+ reviews', () => {
      const result = estimateCallVolume({
        review_count: 150,
        niche: 'gym',
      });

      expect(result.call_estimate_confidence).toBe('high');
      expect(result.call_estimate_methodology).toContain('±20%');
    });

    it('should return medium confidence for 20-99 reviews', () => {
      const result = estimateCallVolume({
        review_count: 50,
        niche: 'gym',
      });

      expect(result.call_estimate_confidence).toBe('medium');
      expect(result.call_estimate_methodology).toContain('±40%');
    });

    it('should return low confidence for <20 reviews', () => {
      const result = estimateCallVolume({
        review_count: 15,
        niche: 'gym',
      });

      expect(result.call_estimate_confidence).toBe('low');
      expect(result.call_estimate_methodology).toContain('±60%');
      expect(result.call_estimate_methodology).toContain('directional estimate');
    });
  });

  describe('Unknown Niche Handling', () => {
    it('should use default benchmark for unknown niche', () => {
      const result = estimateCallVolume({
        review_count: 100,
        niche: 'custom_niche_not_in_benchmarks',
      });

      expect(result.weekly_call_volume_estimate).toBeGreaterThan(0);
      expect(result.call_estimate_methodology).toContain('default industry benchmarks');
    });

    it('should degrade confidence for unknown niche', () => {
      const result = estimateCallVolume({
        review_count: 150, // Would normally be high confidence
        niche: 'unknown_niche',
      });

      // Should be medium or low due to unknown niche
      expect(['medium', 'low']).toContain(result.call_estimate_confidence);
    });
  });

  describe('After-Hours Calculation', () => {
    it('should calculate correct after-hours percentage', () => {
      const result = estimateCallVolume({
        review_count: 100,
        niche: 'gym',
        hours_open_per_week: 84, // 12 hours/day = 50% after-hours
      });

      expect(result.after_hours_calls_per_week).toBeGreaterThan(0);
    });

    it('should cap after-hours at 35% maximum', () => {
      const result = estimateCallVolume({
        review_count: 100,
        niche: 'gym',
        hours_open_per_week: 20, // Very few hours = high after-hours %
      });

      // After-hours should be capped at 35%
      const afterHoursPercent = result.after_hours_calls_per_week / result.weekly_call_volume_estimate;
      expect(afterHoursPercent).toBeLessThanOrEqual(0.35);
    });
  });
});

