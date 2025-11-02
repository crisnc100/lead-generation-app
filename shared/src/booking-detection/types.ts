/**
 * Booking Detection Types
 */

export type BookingSystemTier = 'none' | 'basic' | 'intermediate' | 'advanced' | 'unknown';

export interface BookingDetectionResult {
  booking_provider: string | null;
  booking_system_tier: BookingSystemTier;
  booking_system_gaps: string[];
  booking_upgrade_opportunity: boolean;
}

export interface BookingDetectionInput {
  website_html: string;
}

