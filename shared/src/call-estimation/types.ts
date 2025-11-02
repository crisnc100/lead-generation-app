/**
 * Call Estimation Types
 */

export type CallEstimateConfidence = 'high' | 'medium' | 'low';

export interface CallEstimationResult {
  weekly_call_volume_estimate: number;
  after_hours_calls_per_week: number;
  missed_calls_per_week: number;
  estimated_monthly_revenue_loss: number;
  call_estimate_confidence: CallEstimateConfidence;
  call_estimate_methodology: string;
}

export interface CallEstimationInput {
  review_count: number;
  niche: string;
  hours_open_per_week?: number; // Calculated from Google Places hours if available
  average_order_value?: number; // Optional override
}

