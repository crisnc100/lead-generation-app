/**
 * AI Receptionist Detection Module
 * 
 * Detects if a business already has an AI voice agent/receptionist
 * to avoid wasted pitches.
 * 
 * Detection Methods (in order of confidence):
 * 1. Provider script detection (high confidence)
 * 2. Keyword matching (medium confidence - requires 2+ matches)
 * 3. Review mentions (low confidence)
 */

import { AIDetectionResult, AIDetectionInput, AIDetectionConfidence, AIDetectionMethod } from './types';
import { AI_PROVIDERS, AI_KEYWORDS, AI_REVIEW_PHRASES } from './providers';

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

/**
 * Main AI detection function
 * 
 * @param input - Website HTML, reviews, and business name
 * @returns Detection result with confidence level and provider
 */
export function detectAI(input: AIDetectionInput): AIDetectionResult {
  const { website_html, reviews = [], business_name = '' } = input;
  
  // Strip code blocks to avoid false positives from string literals
  const cleanedHtml = stripCodeBlocks(website_html);
  
  const signals: string[] = [];
  let detectedProvider: string | null = null;
  let confidence: AIDetectionConfidence = 'none';
  let method: AIDetectionMethod = 'none';

  // Method 1: Provider script detection (highest confidence)
  const providerResult = detectProviderScript(cleanedHtml);
  if (providerResult.detected) {
    detectedProvider = providerResult.provider;
    confidence = 'high';
    method = 'provider_script';
    signals.push(`${providerResult.provider} script found`);
  }

  // Method 2: Keyword matching (medium confidence - requires 2+ matches)
  if (confidence === 'none') {
    const keywordMatches = detectKeywords(cleanedHtml, business_name);
    if (keywordMatches.count >= 2) {
      confidence = 'medium';
      method = 'keyword_match';
      signals.push(`Found ${keywordMatches.count} AI-related keywords: ${keywordMatches.matches.join(', ')}`);
    }
  }

  // Method 3: Review mentions (low confidence)
  if (confidence === 'none' && reviews.length > 0) {
    const reviewMatches = detectReviewMentions(reviews);
    if (reviewMatches.length > 0) {
      confidence = 'low';
      method = 'review_mention';
      signals.push(`Reviews mention AI: ${reviewMatches.join(', ')}`);
    }
  }

  return {
    has_ai_receptionist: confidence !== 'none',
    ai_provider: detectedProvider,
    ai_detection_confidence: confidence,
    ai_detection_method: method,
    ai_detection_signals: signals,
    enrichment_metadata: {
      ai_detection: {
        version: 1,
        detected_at: new Date().toISOString(),
      },
    },
  };
}

/**
 * Detect AI provider by scanning for actual embed signatures
 * Only matches script tags, iframes, data attributes, and class names
 * to avoid false positives from blog posts or generic references
 */
function detectProviderScript(html: string): { detected: boolean; provider: string | null } {
  for (const provider of AI_PROVIDERS) {
    // Check script src patterns (must be in <script src="..."> tags)
    for (const pattern of provider.patterns.scriptSrcPatterns) {
      if (pattern.test(html)) {
        return { detected: true, provider: provider.name };
      }
    }

    // Check iframe src patterns (must be in <iframe src="..."> tags)
    for (const pattern of provider.patterns.iframeSrcPatterns) {
      if (pattern.test(html)) {
        return { detected: true, provider: provider.name };
      }
    }

    // Check data attributes (data-* attributes)
    for (const pattern of provider.patterns.dataAttributes) {
      if (pattern.test(html)) {
        return { detected: true, provider: provider.name };
      }
    }

    // Check class names (must be in class="..." attribute)
    for (const pattern of provider.patterns.classNames) {
      if (pattern.test(html)) {
        return { detected: true, provider: provider.name };
      }
    }
  }

  return { detected: false, provider: null };
}

/**
 * Detect AI-related keywords in HTML and business name
 * Returns count and matches
 */
function detectKeywords(html: string, businessName: string): { count: number; matches: string[] } {
  const searchText = `${html} ${businessName}`.toLowerCase();
  const matches: string[] = [];

  for (const keyword of AI_KEYWORDS) {
    if (searchText.includes(keyword.toLowerCase())) {
      matches.push(keyword);
    }
  }

  return {
    count: matches.length,
    matches,
  };
}

/**
 * Detect AI mentions in reviews
 */
function detectReviewMentions(reviews: string[]): string[] {
  const matches: string[] = [];
  const lowerReviews = reviews.map(r => r.toLowerCase());

  for (const review of lowerReviews) {
    for (const phrase of AI_REVIEW_PHRASES) {
      if (review.includes(phrase.toLowerCase())) {
        matches.push(phrase);
        break; // Only count each review once
      }
    }
  }

  return matches;
}

