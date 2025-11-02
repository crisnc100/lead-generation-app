/**
 * Booking Detection Tests
 * 
 * Tests with real HTML fixtures to catch false positives
 */

import { analyzeBookingSystem } from '../booking-detection/analyze';

describe('Booking Detection', () => {
  describe('Provider Detection (High Confidence)', () => {
    it('should detect Calendly from script embed', () => {
      const html = `
        <html>
          <head>
            <script src="https://assets.calendly.com/assets/embed/embed.js"></script>
          </head>
          <body>
            <div class="calendly-inline-widget" data-calendly-url="https://calendly.com/john"></div>
          </body>
        </html>
      `;
      
      const result = analyzeBookingSystem({ website_html: html });
      
      expect(result.booking_provider).toBe('Calendly');
      expect(result.booking_system_tier).toBe('basic');
      expect(result.booking_upgrade_opportunity).toBe(true);
      expect(result.booking_system_gaps.length).toBeGreaterThan(0);
    });

    it('should detect Mindbody from iframe', () => {
      const html = `
        <html>
          <body>
            <iframe src="https://mindbodyonline.com/widget/book?business=123"></iframe>
          </body>
        </html>
      `;
      
      const result = analyzeBookingSystem({ website_html: html });
      
      expect(result.booking_provider).toBe('Mindbody');
      expect(result.booking_system_tier).toBe('advanced');
      expect(result.booking_upgrade_opportunity).toBe(false);
    });

    it('should detect Square Appointments from data attribute', () => {
      const html = `
        <html>
          <body>
            <div data-square-appointments="true"></div>
          </body>
        </html>
      `;
      
      const result = analyzeBookingSystem({ website_html: html });
      
      expect(result.booking_provider).toBe('Square Appointments');
      expect(result.booking_system_tier).toBe('intermediate');
      expect(result.booking_upgrade_opportunity).toBe(true);
    });
  });

  describe('False Positive Prevention', () => {
    it('should NOT detect from generic link text', () => {
      const html = `
        <html>
          <body>
            <p>Check out <a href="https://example.com">Calendly</a> for scheduling.</p>
            <p>We recommend using calendly.com for appointments.</p>
          </body>
        </html>
      `;
      
      const result = analyzeBookingSystem({ website_html: html });
      
      expect(result.booking_provider).toBeNull();
      expect(result.booking_system_tier).toBe('none');
    });

    it('should NOT detect from blog post mentioning provider', () => {
      const html = `
        <html>
          <body>
            <article>
              <h1>Best Scheduling Tools</h1>
              <p>Calendly is a popular choice for small businesses.</p>
              <p>Acuity Scheduling offers more features.</p>
            </article>
          </body>
        </html>
      `;
      
      const result = analyzeBookingSystem({ website_html: html });
      
      expect(result.booking_provider).toBeNull();
    });

    it('should NOT detect from code example in tutorial', () => {
      const html = `
        <html>
          <body>
            <article>
              <h1>How to Embed Calendly</h1>
              <pre><code>&lt;div class="calendly-inline-widget"&gt;&lt;/div&gt;</code></pre>
              <p>This shows how to use Calendly's widget...</p>
            </article>
          </body>
        </html>
      `;
      
      const result = analyzeBookingSystem({ website_html: html });
      
      expect(result.booking_provider).toBeNull();
    });

    it('should NOT detect from JavaScript string literal', () => {
      const html = `
        <html>
          <body>
            <script>
              const markup = '<div class="calendly-inline-widget"></div>';
              const example = '<div data-calendly-url="https://calendly.com/john"></div>';
            </script>
          </body>
        </html>
      `;
      
      const result = analyzeBookingSystem({ website_html: html });
      
      expect(result.booking_provider).toBeNull();
    });

    it('should NOT detect from JSON-LD structured data', () => {
      const html = `
        <html>
          <head>
            <script type="application/ld+json">
              {
                "description": "Example with calendly-inline-widget class"
              }
            </script>
          </head>
        </html>
      `;
      
      const result = analyzeBookingSystem({ website_html: html });
      
      expect(result.booking_provider).toBeNull();
    });

    it('should detect actual embed even with script tags present', () => {
      const html = `
        <html>
          <body>
            <script>
              // Some analytics code
            </script>
            <div class="calendly-inline-widget" data-calendly-url="https://calendly.com/john"></div>
          </body>
        </html>
      `;
      
      const result = analyzeBookingSystem({ website_html: html });
      
      expect(result.booking_provider).toBe('Calendly');
    });

    it('should detect script embed even with inline scripts present', () => {
      const html = `
        <html>
          <body>
            <script>
              // Some inline code
              const example = '<div class="calendly-widget"></div>';
            </script>
            <script src="https://assets.calendly.com/assets/embed/embed.js"></script>
          </body>
        </html>
      `;
      
      const result = analyzeBookingSystem({ website_html: html });
      
      expect(result.booking_provider).toBe('Calendly');
    });

    it('should NOT detect from footer link', () => {
      const html = `
        <html>
          <body>
            <footer>
              <p>Powered by <a href="https://setmore.com">Setmore</a></p>
            </footer>
          </body>
        </html>
      `;
      
      const result = analyzeBookingSystem({ website_html: html });
      
      // Should not detect unless it's an actual embed
      expect(result.booking_provider).toBeNull();
    });
  });

  describe('Tier Detection', () => {
    it('should identify basic tier providers', () => {
      const html = `
        <html>
          <body>
            <div class="setmore-widget"></div>
          </body>
        </html>
      `;
      
      const result = analyzeBookingSystem({ website_html: html });
      
      expect(result.booking_provider).toBe('Setmore');
      expect(result.booking_system_tier).toBe('basic');
      expect(result.booking_upgrade_opportunity).toBe(true);
    });

    it('should identify advanced tier providers', () => {
      const html = `
        <html>
          <body>
            <div class="mindbody-widget"></div>
          </body>
        </html>
      `;
      
      const result = analyzeBookingSystem({ website_html: html });
      
      expect(result.booking_provider).toBe('Mindbody');
      expect(result.booking_system_tier).toBe('advanced');
      expect(result.booking_upgrade_opportunity).toBe(false);
    });
  });

  describe('Gap Detection', () => {
    it('should return gaps for basic providers', () => {
      const html = `
        <html>
          <body>
            <script src="https://calendly.com/widget.js"></script>
          </body>
        </html>
      `;
      
      const result = analyzeBookingSystem({ website_html: html });
      
      expect(result.booking_provider).toBe('Calendly');
      expect(result.booking_system_gaps.length).toBeGreaterThan(0);
      expect(result.booking_system_gaps).toContain('No SMS reminders');
    });

    it('should return empty gaps for advanced providers', () => {
      const html = `
        <html>
          <body>
            <div class="mindbody-booking"></div>
          </body>
        </html>
      `;
      
      const result = analyzeBookingSystem({ website_html: html });
      
      expect(result.booking_provider).toBe('Mindbody');
      expect(result.booking_system_gaps.length).toBe(0);
    });
  });

  describe('No Booking System', () => {
    it('should return none for clean website', () => {
      const html = `
        <html>
          <body>
            <h1>Local Business</h1>
            <p>Call us at 555-1234 to book</p>
          </body>
        </html>
      `;
      
      const result = analyzeBookingSystem({ website_html: html });
      
      expect(result.booking_provider).toBeNull();
      expect(result.booking_system_tier).toBe('none');
      expect(result.booking_upgrade_opportunity).toBe(false);
    });
  });
});

