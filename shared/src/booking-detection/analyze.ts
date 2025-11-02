/**
 * Booking System Depth Analysis Module
 * 
 * Detects booking providers and identifies upgrade opportunities
 */

import { BookingDetectionResult, BookingDetectionInput, BookingSystemTier } from './types';
import { detectBookingSystem } from './providers';

/**
 * Strip script and style tags to avoid false positives from string literals
 * Example: <script>const html = '<div class="calendly-widget"></div>';</script>
 * Should not match because it's inside a JavaScript string, not actual HTML
 * 
 * IMPORTANT: We preserve script tags WITH src attributes (actual embeds),
 * only stripping inline scripts (without src).
 */
function stripCodeBlocks(html: string): string {
  // Remove inline script tags (those without src attribute) and their content
  // This catches: <script>const html = '...';</script>
  // But preserves: <script src="https://calendly.com/widget.js"></script>
  let cleaned = html.replace(/<script(?![^>]*\ssrc=)[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // Remove style tags and their content
  cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Remove JSON-LD script tags (structured data)
  cleaned = cleaned.replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');
  
  return cleaned;
}

export function analyzeBookingSystem(input: BookingDetectionInput): BookingDetectionResult {
  const { website_html } = input;

  // Strip code blocks to avoid false positives from string literals
  const cleanedHtml = stripCodeBlocks(website_html);

  const detection = detectBookingSystem(cleanedHtml);

  if (!detection.detected) {
    return {
      booking_provider: null,
      booking_system_tier: 'none',
      booking_system_gaps: [],
      booking_upgrade_opportunity: false, // No system = greenfield opportunity (handled in scoring)
    };
  }

  const provider = detection.provider!;
  const tier = provider.tier as BookingSystemTier;
  const gaps = provider.gaps;
  const upgradeOpportunity = tier === 'basic' || tier === 'intermediate';

  return {
    booking_provider: provider.name,
    booking_system_tier: tier,
    booking_system_gaps: gaps,
    booking_upgrade_opportunity: upgradeOpportunity,
  };
}

