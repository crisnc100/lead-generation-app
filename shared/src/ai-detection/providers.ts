/**
 * AI Provider Detection Patterns
 * 
 * Version 1.1 - October 2025 (Fixed false positives)
 * 
 * Detects AI voice agent providers by scanning website HTML for:
 * - Script tags with confirmed embed URLs (not just domain mentions)
 * - Iframe embeds
 * - Data attributes and class names specific to integrations
 * 
 * IMPORTANT: Only matches actual embed signatures, not generic domain references
 */

export interface AIProvider {
  name: string;
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
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    name: 'Dialpad AI',
    patterns: {
      scriptSrcPatterns: [
        /<script[^>]*src=["'][^"']*dialpad\.com\/widget[^"']*["']/i,
        /<script[^>]*src=["'][^"']*dialpad\.com\/.*\/embed[^"']*["']/i,
      ],
      iframeSrcPatterns: [
        /<iframe[^>]*src=["'][^"']*dialpad\.com\/widget[^"']*["']/i,
      ],
      dataAttributes: [
        /<[^>]*\sdata-dialpad[^>]*>/i,
        /<[^>]*\sdata-dialpad-widget[^>]*>/i,
      ],
      classNames: [
        /<[^>]*\sclass=["'][^"']*dialpad-widget[^"']*["'][^>]*>/i,
        /<[^>]*\sclass=["'][^"']*dialpad-embed[^"']*["'][^>]*>/i,
      ],
    },
  },
  {
    name: 'ElevenLabs',
    patterns: {
      scriptSrcPatterns: [
        /<script[^>]*src=["'][^"']*elevenlabs\.io\/.*\/embed[^"']*["']/i,
        /<script[^>]*src=["'][^"']*api\.elevenlabs\.io\/.*\/voice[^"']*["']/i,
      ],
      iframeSrcPatterns: [
        /<iframe[^>]*src=["'][^"']*elevenlabs\.io\/.*\/embed[^"']*["']/i,
      ],
      dataAttributes: [
        /<[^>]*\sdata-elevenlabs[^>]*>/i,
        /<[^>]*\sdata-elevenlabs-voice[^>]*>/i,
      ],
      classNames: [
        /<[^>]*\sclass=["'][^"']*elevenlabs-voice[^"']*["'][^>]*>/i,
        /<[^>]*\sclass=["'][^"']*elevenlabs-widget[^"']*["'][^>]*>/i,
      ],
    },
  },
  {
    name: 'Vapi',
    patterns: {
      scriptSrcPatterns: [
        /<script[^>]*src=["'][^"']*widget\.vapi\.ai[^"']*["']/i,
        /<script[^>]*src=["'][^"']*vapi\.ai\/.*\/widget[^"']*["']/i,
      ],
      iframeSrcPatterns: [
        /<iframe[^>]*src=["'][^"']*widget\.vapi\.ai[^"']*["']/i,
      ],
      dataAttributes: [
        /<[^>]*\sdata-vapi[^>]*>/i,
        /<[^>]*\sdata-vapi-widget[^>]*>/i,
      ],
      classNames: [
        /<[^>]*\sclass=["'][^"']*vapi-widget[^"']*["'][^>]*>/i,
        /<[^>]*\sclass=["'][^"']*vapi-voice[^"']*["'][^>]*>/i,
      ],
    },
  },
  {
    name: 'Bland.ai',
    patterns: {
      scriptSrcPatterns: [
        /<script[^>]*src=["'][^"']*bland\.ai\/.*\/embed[^"']*["']/i,
        /<script[^>]*src=["'][^"']*api\.bland\.ai\/.*\/widget[^"']*["']/i,
      ],
      iframeSrcPatterns: [
        /<iframe[^>]*src=["'][^"']*bland\.ai\/.*\/embed[^"']*["']/i,
      ],
      dataAttributes: [
        /<[^>]*\sdata-bland[^>]*>/i,
        /<[^>]*\sdata-bland-ai[^>]*>/i,
      ],
      classNames: [
        /<[^>]*\sclass=["'][^"']*bland-widget[^"']*["'][^>]*>/i,
        /<[^>]*\sclass=["'][^"']*bland-voice[^"']*["'][^>]*>/i,
      ],
    },
  },
  {
    name: 'CallRail',
    patterns: {
      scriptSrcPatterns: [
        /<script[^>]*src=["'][^"']*js\.callrail\.com[^"']*["']/i,
        /<script[^>]*src=["'][^"']*tracking\.callrail\.com[^"']*["']/i,
      ],
      iframeSrcPatterns: [],
      dataAttributes: [
        /<[^>]*\sdata-callrail[^>]*>/i,
        /<[^>]*\sdata-callrail-number[^>]*>/i,
      ],
      classNames: [
        /<[^>]*\sclass=["'][^"']*callrail-number[^"']*["'][^>]*>/i,
        /<[^>]*\sclass=["'][^"']*callrail-tracking[^"']*["'][^>]*>/i,
      ],
    },
  },
  {
    name: 'Smith.ai',
    patterns: {
      scriptSrcPatterns: [
        /<script[^>]*src=["'][^"']*smith\.ai\/.*\/widget[^"']*["']/i,
        /<script[^>]*src=["'][^"']*api\.smith\.ai\/.*\/embed[^"']*["']/i,
      ],
      iframeSrcPatterns: [
        /<iframe[^>]*src=["'][^"']*smith\.ai\/.*\/widget[^"']*["']/i,
      ],
      dataAttributes: [
        /<[^>]*\sdata-smith-ai[^>]*>/i,
        /<[^>]*\sdata-smithai[^>]*>/i,
      ],
      classNames: [
        /<[^>]*\sclass=["'][^"']*smith-ai-widget[^"']*["'][^>]*>/i,
        /<[^>]*\sclass=["'][^"']*smithai-widget[^"']*["'][^>]*>/i,
      ],
    },
  },
  {
    name: 'OpenAI Voice',
    patterns: {
      scriptSrcPatterns: [
        /<script[^>]*src=["'][^"']*api\.openai\.com\/v1\/audio[^"']*["']/i,
      ],
      iframeSrcPatterns: [],
      dataAttributes: [
        /<[^>]*\sdata-openai-voice[^>]*>/i,
      ],
      classNames: [
        /<[^>]*\sclass=["'][^"']*openai-voice[^"']*["'][^>]*>/i,
        /<[^>]*\sclass=["'][^"']*whisper-voice[^"']*["'][^>]*>/i,
      ],
    },
  },
  {
    name: 'Twilio Voice AI',
    patterns: {
      scriptSrcPatterns: [
        /<script[^>]*src=["'][^"']*media\.twilio\.com\/voice[^"']*["']/i,
      ],
      iframeSrcPatterns: [],
      dataAttributes: [
        /<[^>]*\sdata-twilio-voice[^>]*>/i,
      ],
      classNames: [
        /<[^>]*\sclass=["'][^"']*twilio-voice[^"']*["'][^>]*>/i,
        /<[^>]*\sclass=["'][^"']*twilio-voice-client[^"']*["'][^>]*>/i,
      ],
    },
  },
];

/**
 * AI-related keywords for medium confidence detection
 * Requires 2+ matches to reduce false positives
 */
export const AI_KEYWORDS = [
  'AI-powered phone',
  'AI receptionist',
  'AI voice assistant',
  'automated answering',
  'virtual receptionist',
  'AI call handling',
  'intelligent answering',
  'conversational AI',
  'voice AI',
  'AI phone system',
  'chatbot phone',
  'automated phone system',
];

/**
 * Review phrases that suggest AI usage (low confidence)
 */
export const AI_REVIEW_PHRASES = [
  'robot answered',
  'automated system',
  'AI answered',
  'computer answered',
  'automated phone',
  'not a real person',
];

