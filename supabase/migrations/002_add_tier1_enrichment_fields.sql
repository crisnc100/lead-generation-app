-- =====================================================
-- Migration: Add Tier 1 Enrichment Fields
-- =====================================================
-- Adds fields for AI detection, call estimation, and booking analysis
-- Date: 2025-10-31
-- =====================================================

-- Add AI detection fields
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS has_ai_receptionist BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ai_provider TEXT,
ADD COLUMN IF NOT EXISTS ai_detection_confidence TEXT CHECK (ai_detection_confidence IN ('high', 'medium', 'low', 'none')),
ADD COLUMN IF NOT EXISTS ai_detection_method TEXT CHECK (ai_detection_method IN ('provider_script', 'keyword_match', 'review_mention', 'none'));

-- Add call estimation fields
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS weekly_call_volume_estimate INTEGER,
ADD COLUMN IF NOT EXISTS after_hours_calls_per_week INTEGER,
ADD COLUMN IF NOT EXISTS missed_calls_per_week INTEGER,
ADD COLUMN IF NOT EXISTS estimated_monthly_revenue_loss NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS call_estimate_confidence TEXT CHECK (call_estimate_confidence IN ('high', 'medium', 'low')),
ADD COLUMN IF NOT EXISTS call_estimate_methodology TEXT;

-- Add booking system depth analysis fields
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS booking_provider TEXT,
ADD COLUMN IF NOT EXISTS booking_system_tier TEXT CHECK (booking_system_tier IN ('none', 'basic', 'intermediate', 'advanced', 'unknown')),
ADD COLUMN IF NOT EXISTS booking_system_gaps TEXT[],
ADD COLUMN IF NOT EXISTS booking_upgrade_opportunity BOOLEAN DEFAULT false;

-- Add enrichment metadata JSONB field for flexible storage
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS enrichment_metadata JSONB DEFAULT '{}'::jsonb;

-- Create indexes for filtering
CREATE INDEX IF NOT EXISTS idx_leads_has_ai_receptionist ON leads(has_ai_receptionist);
CREATE INDEX IF NOT EXISTS idx_leads_booking_tier ON leads(booking_system_tier);
CREATE INDEX IF NOT EXISTS idx_leads_call_estimate_confidence ON leads(call_estimate_confidence);

-- Add comments for documentation
COMMENT ON COLUMN leads.has_ai_receptionist IS 'Whether business already has AI receptionist (detected via script/keyword analysis)';
COMMENT ON COLUMN leads.ai_provider IS 'Name of detected AI provider (e.g., Dialpad AI, ElevenLabs)';
COMMENT ON COLUMN leads.ai_detection_confidence IS 'Confidence level: high (script found), medium (keywords), low (reviews), none';
COMMENT ON COLUMN leads.weekly_call_volume_estimate IS 'Estimated weekly call volume based on review count and industry benchmarks';
COMMENT ON COLUMN leads.estimated_monthly_revenue_loss IS 'Estimated monthly revenue lost from missed after-hours calls';
COMMENT ON COLUMN leads.booking_provider IS 'Detected booking system provider (e.g., Calendly, Mindbody)';
COMMENT ON COLUMN leads.booking_system_tier IS 'Tier of booking system: none, basic, intermediate, advanced';
COMMENT ON COLUMN leads.booking_system_gaps IS 'Array of known limitations/gaps in current booking system';
COMMENT ON COLUMN leads.enrichment_metadata IS 'Flexible JSONB field for detailed enrichment data and versioning';

