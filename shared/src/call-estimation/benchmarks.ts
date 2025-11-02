/**
 * Industry Benchmarks for Call Estimation
 * 
 * Based on industry research and assumptions:
 * - Average customers per year = Reviews ÷ 0.01 (1% of customers leave reviews)
 * - Calls per customer per year varies by industry
 * - Average order value varies by industry
 */

export interface IndustryBenchmark {
  niche: string;
  calls_per_customer_per_year: number;
  average_order_value: number;
}

export const INDUSTRY_BENCHMARKS: IndustryBenchmark[] = [
  {
    niche: 'restaurant',
    calls_per_customer_per_year: 15,
    average_order_value: 45,
  },
  {
    niche: 'hair_salon',
    calls_per_customer_per_year: 10,
    average_order_value: 65,
  },
  {
    niche: 'barber',
    calls_per_customer_per_year: 8,
    average_order_value: 35,
  },
  {
    niche: 'dental',
    calls_per_customer_per_year: 12,
    average_order_value: 200,
  },
  {
    niche: 'real_estate',
    calls_per_customer_per_year: 5,
    average_order_value: 5000,
  },
  {
    niche: 'gym',
    calls_per_customer_per_year: 8,
    average_order_value: 150,
  },
  {
    niche: 'yoga',
    calls_per_customer_per_year: 8,
    average_order_value: 120,
  },
  {
    niche: 'spa',
    calls_per_customer_per_year: 10,
    average_order_value: 180,
  },
  {
    niche: 'chiropractor',
    calls_per_customer_per_year: 12,
    average_order_value: 150,
  },
  {
    niche: 'plumber',
    calls_per_customer_per_year: 6,
    average_order_value: 300,
  },
  {
    niche: 'hvac',
    calls_per_customer_per_year: 6,
    average_order_value: 350,
  },
  {
    niche: 'electrician',
    calls_per_customer_per_year: 5,
    average_order_value: 400,
  },
  {
    niche: 'landscaping',
    calls_per_customer_per_year: 4,
    average_order_value: 250,
  },
  {
    niche: 'roofing',
    calls_per_customer_per_year: 3,
    average_order_value: 800,
  },
];

/**
 * Default benchmark (used when niche not found)
 */
export const DEFAULT_BENCHMARK: IndustryBenchmark = {
  niche: 'default',
  calls_per_customer_per_year: 8,
  average_order_value: 100,
};

/**
 * Get benchmark for a specific niche
 */
export function getBenchmark(niche: string): IndustryBenchmark {
  const normalizedNiche = niche.toLowerCase().replace(/\s+/g, '_');
  
  const benchmark = INDUSTRY_BENCHMARKS.find(
    b => b.niche === normalizedNiche || normalizedNiche.includes(b.niche)
  );

  return benchmark || DEFAULT_BENCHMARK;
}

