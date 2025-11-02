/**
 * Booking System Provider Detection
 * 
 * Version 1.1 - October 2025 (Fixed false positives)
 * 
 * Detects booking providers and identifies upgrade opportunities
 * Only matches actual embed signatures (script tags, iframes, data attributes)
 * to avoid false positives from generic links or text mentions
 */

export interface BookingProvider {
  name: string;
  tier: 'basic' | 'intermediate' | 'advanced';
  patterns: {
    // Script src patterns - must be in <script src="..."> tags
    scriptSrcPatterns: RegExp[];
    // Iframe src patterns - must be in <iframe src="..."> tags
    iframeSrcPatterns: RegExp[];
    // Data attributes - data-* attributes specific to the provider
    dataAttributes: RegExp[];
    // Class names - provider-specific CSS classes
    classNames: RegExp[];
  };
  gaps: string[]; // Known limitations that create upgrade opportunities
}

export const BOOKING_PROVIDERS: BookingProvider[] = [
  {
    name: 'Calendly',
    tier: 'basic',
    patterns: {
      scriptSrcPatterns: [
        /<script[^>]*src=["'][^"']*calendly\.com\/assets\/embed[^"']*["']/i,
        /<script[^>]*src=["'][^"']*calendly\.com\/widget[^"']*["']/i,
      ],
      iframeSrcPatterns: [
        /<iframe[^>]*src=["'][^"']*calendly\.com\/[^"']*["']/i,
      ],
      dataAttributes: [
        /<[^>]*\sdata-calendly[^>]*>/i,
        /<[^>]*\sdata-calendly-url[^>]*>/i,
      ],
      classNames: [
        /<[^>]*\sclass=["'][^"']*calendly-inline-widget[^"']*["'][^>]*>/i,
        /<[^>]*\sclass=["'][^"']*calendly-popup[^"']*["'][^>]*>/i,
      ],
    },
    gaps: [
      'No SMS reminders',
      'No phone integration',
      'No waitlist feature',
      'Limited customization',
    ],
  },
  {
    name: 'Acuity Scheduling',
    tier: 'intermediate',
    patterns: {
      scriptSrcPatterns: [
        /<script[^>]*src=["'][^"']*acuityscheduling\.com\/embed[^"']*["']/i,
        /<script[^>]*src=["'][^"']*acuityscheduling\.com\/.*\/widget[^"']*["']/i,
      ],
      iframeSrcPatterns: [
        /<iframe[^>]*src=["'][^"']*acuityscheduling\.com\/embed[^"']*["']/i,
      ],
      dataAttributes: [
        /<[^>]*\sdata-acuity[^>]*>/i,
        /<[^>]*\sdata-acuity-scheduling[^>]*>/i,
      ],
      classNames: [
        /<[^>]*\sclass=["'][^"']*acuity-scheduling[^"']*["'][^>]*>/i,
        /<[^>]*\sclass=["'][^"']*acuity-embed[^"']*["'][^>]*>/i,
      ],
    },
    gaps: [
      'No voice booking integration',
      'Limited automation',
    ],
  },
  {
    name: 'Mindbody',
    tier: 'advanced',
    patterns: {
      scriptSrcPatterns: [
        /<script[^>]*src=["'][^"']*mindbodyonline\.com\/.*\/widget[^"']*["']/i,
        /<script[^>]*src=["'][^"']*mindbody\.io\/.*\/embed[^"']*["']/i,
      ],
      iframeSrcPatterns: [
        /<iframe[^>]*src=["'][^"']*mindbodyonline\.com\/[^"']*["']/i,
      ],
      dataAttributes: [
        /<[^>]*\sdata-mindbody[^>]*>/i,
        /<[^>]*\sdata-mindbody-widget[^>]*>/i,
      ],
      classNames: [
        /<[^>]*\sclass=["'][^"']*mindbody-widget[^"']*["'][^>]*>/i,
        /<[^>]*\sclass=["'][^"']*mindbody-booking[^"']*["'][^>]*>/i,
      ],
    },
    gaps: [], // Advanced system, few gaps
  },
  {
    name: 'Square Appointments',
    tier: 'intermediate',
    patterns: {
      scriptSrcPatterns: [
        /<script[^>]*src=["'][^"']*squareup\.com\/appointments\/.*\/embed[^"']*["']/i,
      ],
      iframeSrcPatterns: [
        /<iframe[^>]*src=["'][^"']*squareup\.com\/appointments\/book[^"']*["']/i,
      ],
      dataAttributes: [
        /<[^>]*\sdata-square-appointments[^>]*>/i,
        /<[^>]*\sdata-square-booking[^>]*>/i,
      ],
      classNames: [
        /<[^>]*\sclass=["'][^"']*square-appointments[^"']*["'][^>]*>/i,
        /<[^>]*\sclass=["'][^"']*square-booking[^"']*["'][^>]*>/i,
      ],
    },
    gaps: [
      'No advanced routing',
      'Basic scheduling only',
      'Limited automation',
    ],
  },
  {
    name: 'Setmore',
    tier: 'basic',
    patterns: {
      scriptSrcPatterns: [
        /<script[^>]*src=["'][^"']*setmore\.com\/.*\/widget[^"']*["']/i,
      ],
      iframeSrcPatterns: [
        /<iframe[^>]*src=["'][^"']*setmore\.com\/.*\/book[^"']*["']/i,
      ],
      dataAttributes: [
        /<[^>]*\sdata-setmore[^>]*>/i,
        /<[^>]*\sdata-setmore-booking[^>]*>/i,
      ],
      classNames: [
        /<[^>]*\sclass=["'][^"']*setmore-widget[^"']*["'][^>]*>/i,
        /<[^>]*\sclass=["'][^"']*setmore-booking[^"']*["'][^>]*>/i,
      ],
    },
    gaps: [
      'Limited automation',
      'Basic features only',
      'No voice integration',
    ],
  },
  {
    name: 'Glofox',
    tier: 'advanced',
    patterns: {
      scriptSrcPatterns: [
        /<script[^>]*src=["'][^"']*glofox\.com\/.*\/widget[^"']*["']/i,
      ],
      iframeSrcPatterns: [
        /<iframe[^>]*src=["'][^"']*glofox\.com\/.*\/book[^"']*["']/i,
      ],
      dataAttributes: [
        /<[^>]*\sdata-glofox[^>]*>/i,
      ],
      classNames: [
        /<[^>]*\sclass=["'][^"']*glofox-widget[^"']*["'][^>]*>/i,
        /<[^>]*\sclass=["'][^"']*glofox-booking[^"']*["'][^>]*>/i,
      ],
    },
    gaps: [], // Advanced fitness management system
  },
  {
    name: 'Vagaro',
    tier: 'intermediate',
    patterns: {
      scriptSrcPatterns: [
        /<script[^>]*src=["'][^"']*vagaro\.com\/.*\/widget[^"']*["']/i,
      ],
      iframeSrcPatterns: [
        /<iframe[^>]*src=["'][^"']*vagaro\.com\/.*\/book[^"']*["']/i,
      ],
      dataAttributes: [
        /<[^>]*\sdata-vagaro[^>]*>/i,
      ],
      classNames: [
        /<[^>]*\sclass=["'][^"']*vagaro-widget[^"']*["'][^>]*>/i,
        /<[^>]*\sclass=["'][^"']*vagaro-booking[^"']*["'][^>]*>/i,
      ],
    },
    gaps: [
      'No voice booking',
      'Limited integration options',
    ],
  },
  {
    name: 'Zen Planner',
    tier: 'advanced',
    patterns: {
      scriptSrcPatterns: [
        /<script[^>]*src=["'][^"']*zenplanner\.com\/.*\/widget[^"']*["']/i,
      ],
      iframeSrcPatterns: [
        /<iframe[^>]*src=["'][^"']*zenplanner\.com\/.*\/book[^"']*["']/i,
      ],
      dataAttributes: [
        /<[^>]*\sdata-zen-planner[^>]*>/i,
      ],
      classNames: [
        /<[^>]*\sclass=["'][^"']*zen-planner-widget[^"']*["'][^>]*>/i,
        /<[^>]*\sclass=["'][^"']*zen-planner-booking[^"']*["'][^>]*>/i,
      ],
    },
    gaps: [], // Advanced system for fitness/wellness
  },
];

/**
 * Detect booking system from HTML
 * Only matches actual embed signatures to avoid false positives
 */
export function detectBookingSystem(html: string): {
  detected: boolean;
  provider: BookingProvider | null;
} {
  for (const provider of BOOKING_PROVIDERS) {
    // Check script src patterns
    for (const pattern of provider.patterns.scriptSrcPatterns) {
      if (pattern.test(html)) {
        return { detected: true, provider };
      }
    }

    // Check iframe src patterns
    for (const pattern of provider.patterns.iframeSrcPatterns) {
      if (pattern.test(html)) {
        return { detected: true, provider };
      }
    }

    // Check data attributes
    for (const pattern of provider.patterns.dataAttributes) {
      if (pattern.test(html)) {
        return { detected: true, provider };
      }
    }

    // Check class names
    for (const pattern of provider.patterns.classNames) {
      if (pattern.test(html)) {
        return { detected: true, provider };
      }
    }
  }

  return { detected: false, provider: null };
}

