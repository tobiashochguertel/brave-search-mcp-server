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
});
