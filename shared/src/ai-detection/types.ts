/**
 * AI Detection Types
 * 
 * Defines types for AI receptionist detection results
 */

export type AIDetectionConfidence = 'high' | 'medium' | 'low' | 'none';
export type AIDetectionMethod = 'provider_script' | 'keyword_match' | 'review_mention' | 'none';

export interface AIDetectionResult {
  has_ai_receptionist: boolean;
  ai_provider: string | null;
  ai_detection_confidence: AIDetectionConfidence;
  ai_detection_method: AIDetectionMethod;
  ai_detection_signals: string[];
  enrichment_metadata: {
    ai_detection: {
      version: number;
      detected_at: string;
    };
  };
}

export interface AIDetectionInput {
  website_html: string;
  reviews?: string[];
  business_name?: string;
}

