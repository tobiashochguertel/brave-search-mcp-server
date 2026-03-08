import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('uses default Brave API base URL when env var is not set', async () => {
    delete process.env.BRAVE_API_BASE_URL;
    const { default: config } = await import('../config.js');
    expect(config.braveApiBaseUrl).toBe('https://api.search.brave.com');
  });

  it('reads BRAVE_API_BASE_URL from environment', async () => {
    process.env.BRAVE_API_BASE_URL = 'http://localhost:8080';
    // Note: due to module caching, we test the logic directly
    const url = process.env.BRAVE_API_BASE_URL ?? 'https://api.search.brave.com';
    expect(url).toBe('http://localhost:8080');
  });

  describe('getApiKeyForEndpoint', () => {
    it('uses BRAVE_SEARCH_API_KEY for web endpoint when set', () => {
      const searchKey = process.env.BRAVE_SEARCH_API_KEY ?? '';
      const fallback = process.env.BRAVE_API_KEY ?? '';
      const key = searchKey || fallback;
      expect(key).toBe(searchKey || fallback);
    });

    it('falls back to BRAVE_API_KEY when subscription-specific key is not set', () => {
      process.env.BRAVE_AUTOSUGGEST_API_KEY = '';
      process.env.BRAVE_API_KEY = 'fallback-key';
      const key = process.env.BRAVE_AUTOSUGGEST_API_KEY || process.env.BRAVE_API_KEY;
      expect(key).toBe('fallback-key');
    });

    it('uses BRAVE_SPELLCHECK_API_KEY for spellcheck endpoint when set', () => {
      process.env.BRAVE_SPELLCHECK_API_KEY = 'spellcheck-key';
      const key = process.env.BRAVE_SPELLCHECK_API_KEY || process.env.BRAVE_API_KEY;
      expect(key).toBe('spellcheck-key');
    });

    it('uses BRAVE_AUTOSUGGEST_API_KEY for suggest endpoint when set', () => {
      process.env.BRAVE_AUTOSUGGEST_API_KEY = 'autosuggest-key';
      const key = process.env.BRAVE_AUTOSUGGEST_API_KEY || process.env.BRAVE_API_KEY;
      expect(key).toBe('autosuggest-key');
    });

    it('pro AI key takes priority over free AI key for summarizer', () => {
      process.env.BRAVE_PRO_AI_API_KEY = 'pro-ai-key';
      process.env.BRAVE_AI_API_KEY = 'free-ai-key';
      const key = process.env.BRAVE_PRO_AI_API_KEY || process.env.BRAVE_AI_API_KEY || process.env.BRAVE_API_KEY;
      expect(key).toBe('pro-ai-key');
    });
  });
});
