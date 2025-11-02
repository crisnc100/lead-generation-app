/**
 * AI Detection Tests
 * 
 * Tests with real HTML fixtures to catch false positives
 */

import { detectAI } from '../ai-detection/detect';

describe('AI Detection', () => {
  describe('Provider Script Detection (High Confidence)', () => {
    it('should detect Dialpad AI from script tag', () => {
      const html = `
        <html>
          <head>
            <script src="https://dialpad.com/widget/embed.js"></script>
          </head>
        </html>
      `;
      
      const result = detectAI({ website_html: html });
      
      expect(result.has_ai_receptionist).toBe(true);
      expect(result.ai_provider).toBe('Dialpad AI');
      expect(result.ai_detection_confidence).toBe('high');
      expect(result.ai_detection_method).toBe('provider_script');
    });

    it('should detect ElevenLabs from iframe embed', () => {
      const html = `
        <html>
          <body>
            <iframe src="https://elevenlabs.io/voice/embed/abc123"></iframe>
          </body>
        </html>
      `;
      
      const result = detectAI({ website_html: html });
      
      expect(result.has_ai_receptionist).toBe(true);
      expect(result.ai_provider).toBe('ElevenLabs');
      expect(result.ai_detection_confidence).toBe('high');
    });

    it('should detect CallRail from data attribute', () => {
      const html = `
        <html>
          <body>
            <div data-callrail-number="1234567890"></div>
          </body>
        </html>
      `;
      
      const result = detectAI({ website_html: html });
      
      expect(result.has_ai_receptionist).toBe(true);
      expect(result.ai_provider).toBe('CallRail');
    });

    it('should NOT detect from generic domain mention in blog post', () => {
      const html = `
        <html>
          <body>
            <article>
              <p>We compared Dialpad vs other phone systems...</p>
              <p>Check out calendly.com for scheduling options.</p>
            </article>
          </body>
        </html>
      `;
      
      const result = detectAI({ website_html: html });
      
      expect(result.has_ai_receptionist).toBe(false);
      expect(result.ai_provider).toBeNull();
    });

    it('should NOT detect from code example in tutorial', () => {
      const html = `
        <html>
          <body>
            <article>
              <h1>How to Use Dialpad</h1>
              <pre><code>&lt;div data-dialpad-widget="123"&gt;&lt;/div&gt;</code></pre>
              <p>In this example, we show how to embed Dialpad...</p>
            </article>
          </body>
        </html>
      `;
      
      const result = detectAI({ website_html: html });
      
      expect(result.has_ai_receptionist).toBe(false);
      expect(result.ai_provider).toBeNull();
    });

    it('should NOT detect from JavaScript string literal', () => {
      const html = `
        <html>
          <body>
            <script>
              const markup = '<div class="dialpad-widget"></div>';
              const example = '<div data-dialpad-widget="123"></div>';
            </script>
          </body>
        </html>
      `;
      
      const result = detectAI({ website_html: html });
      
      expect(result.has_ai_receptionist).toBe(false);
      expect(result.ai_provider).toBeNull();
    });

    it('should NOT detect from JSON-LD structured data', () => {
      const html = `
        <html>
          <head>
            <script type="application/ld+json">
              {
                "description": "Example with data-dialpad-widget attribute"
              }
            </script>
          </head>
        </html>
      `;
      
      const result = detectAI({ website_html: html });
      
      expect(result.has_ai_receptionist).toBe(false);
    });

    it('should detect actual script embed even with inline scripts present', () => {
      const html = `
        <html>
          <body>
            <script>
              // Some analytics code
              const config = { provider: 'dialpad' };
            </script>
            <script src="https://dialpad.com/widget/embed.js"></script>
          </body>
        </html>
      `;
      
      const result = detectAI({ website_html: html });
      
      expect(result.has_ai_receptionist).toBe(true);
      expect(result.ai_provider).toBe('Dialpad AI');
    });
  });

  describe('Keyword Matching (Medium Confidence)', () => {
    it('should detect with 2+ keyword matches', () => {
      const html = `
        <html>
          <body>
            <h1>AI Receptionist Services</h1>
            <p>Our AI voice assistant handles all calls automatically.</p>
          </body>
        </html>
      `;
      
      const result = detectAI({ website_html: html, business_name: 'AI Phone Solutions' });
      
      expect(result.has_ai_receptionist).toBe(true);
      expect(result.ai_detection_confidence).toBe('medium');
      expect(result.ai_detection_method).toBe('keyword_match');
    });

    it('should NOT detect with only 1 keyword match', () => {
      const html = `
        <html>
          <body>
            <p>We offer AI solutions for businesses.</p>
          </body>
        </html>
      `;
      
      const result = detectAI({ website_html: html });
      
      expect(result.has_ai_receptionist).toBe(false);
    });
  });

  describe('Review Mentions (Low Confidence)', () => {
    it('should detect from review mentioning robot', () => {
      const reviews = [
        'Great service but robot answered the phone',
        'Good food, friendly staff',
      ];
      
      const result = detectAI({ website_html: '', reviews });
      
      expect(result.has_ai_receptionist).toBe(true);
      expect(result.ai_detection_confidence).toBe('low');
      expect(result.ai_detection_method).toBe('review_mention');
    });
  });

  describe('No Detection', () => {
    it('should return no detection for clean website', () => {
      const html = `
        <html>
          <body>
            <h1>Local Gym</h1>
            <p>Call us at 555-1234</p>
            <p>Book online at our website</p>
          </body>
        </html>
      `;
      
      const result = detectAI({ website_html: html });
      
      expect(result.has_ai_receptionist).toBe(false);
      expect(result.ai_provider).toBeNull();
      expect(result.ai_detection_confidence).toBe('none');
    });
  });
});

