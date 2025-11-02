/**
 * Call Volume Estimation Module
 * 
 * Estimates call volume and missed revenue opportunity
 * based on review count and industry benchmarks.
 * 
 * Methodology:
 * 1. Annual Customers = Reviews ÷ 0.01 (1% of customers leave reviews)
 * 2. Annual Calls = Annual Customers × Calls_Per_Customer[niche]
 * 3. Weekly Calls = Annual Calls ÷ 52
 * 4. After-Hours % = MIN(0.35, (168 - Hours_Open_Per_Week) ÷ 168)
 * 5. After-Hours Calls = Weekly Calls × After-Hours %
 * 6. Missed Calls = After-Hours Calls × 0.80 (80% unanswered)
 * 7. Missed Revenue = Missed Calls × 4 weeks × Avg_Order_Value × 0.50
 * 
 * Guardrails:
 * - Min review count: 5 (below this, estimates are unreliable)
 * - Max weekly calls: 10,000 (caps unrealistic estimates)
 * - Max revenue loss: $50,000/month (caps unrealistic estimates)
 * - Confidence degrades for very low review counts
 * - Uses fallback benchmark for unknown niches
 */

import { CallEstimationResult, CallEstimationInput, CallEstimateConfidence } from './types';
import { getBenchmark, DEFAULT_BENCHMARK } from './benchmarks';

const REVIEW_RATE = 0.01; // 1% of customers leave reviews
const MISSED_CALL_RATE = 0.80; // 80% of after-hours calls go unanswered
const WEEKS_PER_MONTH = 4;
const CONVERSION_RATE = 0.50; // 50% of missed calls would convert if answered

// Guardrails
const MIN_REVIEW_COUNT = 5; // Below this, estimates are unreliable
const MAX_WEEKLY_CALLS = 10000; // Cap unrealistic estimates
const MAX_MONTHLY_REVENUE_LOSS = 50000; // Cap unrealistic estimates

export function estimateCallVolume(input: CallEstimationInput): CallEstimationResult {
  const { review_count, niche, hours_open_per_week, average_order_value } = input;

  // Guardrail: Minimum review count
  if (review_count < MIN_REVIEW_COUNT) {
    return {
      weekly_call_volume_estimate: 0,
      after_hours_calls_per_week: 0,
      missed_calls_per_week: 0,
      estimated_monthly_revenue_loss: 0,
      call_estimate_confidence: 'low',
      call_estimate_methodology: `Insufficient review data (${review_count} reviews). Minimum ${MIN_REVIEW_COUNT} reviews required for reliable estimates.`,
    };
  }

  // Get industry benchmarks (fallback to default if niche unknown)
  const benchmark = getBenchmark(niche);
  const isUnknownNiche = benchmark.niche === DEFAULT_BENCHMARK.niche && niche.toLowerCase() !== 'default';
  const avgOrderValue = average_order_value || benchmark.average_order_value;

  // Step 1: Calculate annual customers
  const annualCustomers = review_count / REVIEW_RATE;

  // Step 2: Calculate annual calls
  const annualCalls = annualCustomers * benchmark.calls_per_customer_per_year;

  // Step 3: Calculate weekly calls
  let weeklyCallVolume = annualCalls / 52;

  // Guardrail: Cap weekly calls
  if (weeklyCallVolume > MAX_WEEKLY_CALLS) {
    weeklyCallVolume = MAX_WEEKLY_CALLS;
  }

  // Step 4: Calculate after-hours percentage
  // Default to 35% if hours not provided (assumes business open ~60 hours/week)
  const hoursOpen = hours_open_per_week || 60;
  const totalHoursPerWeek = 168; // 24 * 7
  const afterHoursPercentage = Math.min(0.35, Math.max(0, (totalHoursPerWeek - hoursOpen) / totalHoursPerWeek));

  // Step 5: Calculate after-hours calls
  const afterHoursCallsPerWeek = weeklyCallVolume * afterHoursPercentage;

  // Step 6: Calculate missed calls (80% of after-hours go unanswered)
  const missedCallsPerWeek = afterHoursCallsPerWeek * MISSED_CALL_RATE;

  // Step 7: Calculate monthly revenue loss
  let monthlyRevenueLoss = missedCallsPerWeek * WEEKS_PER_MONTH * avgOrderValue * CONVERSION_RATE;

  // Guardrail: Cap revenue loss
  if (monthlyRevenueLoss > MAX_MONTHLY_REVENUE_LOSS) {
    monthlyRevenueLoss = MAX_MONTHLY_REVENUE_LOSS;
  }

  // Determine confidence level based on review count
  let confidence: CallEstimateConfidence;
  if (review_count >= 100) {
    confidence = 'high';
  } else if (review_count >= 20) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  // Degrade confidence for unknown niches
  if (isUnknownNiche && confidence === 'high') {
    confidence = 'medium';
  } else if (isUnknownNiche) {
    confidence = 'low';
  }

  // Build methodology explanation
  const methodology = buildMethodology({
    review_count,
    annualCustomers,
    annualCalls,
    weeklyCallVolume,
    afterHoursPercentage,
    afterHoursCallsPerWeek,
    missedCallsPerWeek,
    monthlyRevenueLoss,
    avgOrderValue,
    niche: benchmark.niche,
    confidence,
    isUnknownNiche,
    wasCapped: weeklyCallVolume >= MAX_WEEKLY_CALLS || monthlyRevenueLoss >= MAX_MONTHLY_REVENUE_LOSS,
  });

  return {
    weekly_call_volume_estimate: Math.round(weeklyCallVolume),
    after_hours_calls_per_week: Math.round(afterHoursCallsPerWeek),
    missed_calls_per_week: Math.round(missedCallsPerWeek),
    estimated_monthly_revenue_loss: Math.round(monthlyRevenueLoss),
    call_estimate_confidence: confidence,
    call_estimate_methodology: methodology,
  };
}

interface MethodologyParams {
  review_count: number;
  annualCustomers: number;
  annualCalls: number;
  weeklyCallVolume: number;
  afterHoursPercentage: number;
  afterHoursCallsPerWeek: number;
  missedCallsPerWeek: number;
  monthlyRevenueLoss: number;
  avgOrderValue: number;
  niche: string;
  confidence: CallEstimateConfidence;
  isUnknownNiche: boolean;
  wasCapped: boolean;
}

function buildMethodology(params: MethodologyParams): string {
  const {
    review_count,
    annualCustomers,
    weeklyCallVolume,
    afterHoursPercentage,
    afterHoursCallsPerWeek,
    missedCallsPerWeek,
    monthlyRevenueLoss,
    avgOrderValue,
    niche,
    confidence,
    isUnknownNiche,
    wasCapped,
  } = params;

  const accuracy = confidence === 'high' ? '±20%' : confidence === 'medium' ? '±40%' : '±60%';
  
  let methodology = `Based on ${review_count} reviews (assuming 1% review rate = ${Math.round(annualCustomers)} annual customers)`;
  
  if (isUnknownNiche) {
    methodology += ` and default industry benchmarks (niche "${niche}" not in benchmark table)`;
  } else {
    methodology += ` and ${niche} industry benchmarks`;
  }
  
  methodology += `, we estimate ${Math.round(weeklyCallVolume)} calls/week. With ${(afterHoursPercentage * 100).toFixed(0)}% after-hours (${Math.round(afterHoursCallsPerWeek)} calls/week), approximately ${Math.round(missedCallsPerWeek)} calls/week go unanswered (80% missed rate). At $${avgOrderValue} avg order value with 50% conversion, this represents ~$${Math.round(monthlyRevenueLoss)}/month in missed revenue.`;
  
  if (wasCapped) {
    methodology += ' Note: Estimate capped at maximum realistic values.';
  }
  
  methodology += ` Estimated accuracy: ${accuracy}.`;
  
  if (confidence === 'low') {
    methodology += ' Low confidence - use as directional estimate only.';
  }

  return methodology;
}

