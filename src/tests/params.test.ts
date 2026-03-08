import { describe, it, expect } from 'vitest';
import webParams from '../tools/web/params.js';
import newsParams from '../tools/news/params.js';
import suggestParams from '../tools/suggest/params.js';
import spellcheckParams from '../tools/spellcheck/params.js';
import llmContextParams from '../tools/llm-context/params.js';

describe('Parameter schemas', () => {
  describe('Web search params', () => {
    it('parses valid query', () => {
      const result = webParams.safeParse({ query: 'test' });
      expect(result.success).toBe(true);
    });

    it('rejects empty query', () => {
      const result = webParams.safeParse({ query: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('News search params', () => {
    it('parses valid query with defaults', () => {
      const result = newsParams.safeParse({ query: 'breaking news' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.count).toBe(20);
        expect(result.data.safesearch).toBe('moderate');
      }
    });
  });

  describe('Suggest params', () => {
    it('parses valid query', () => {
      const result = suggestParams.safeParse({ query: 'brave' });
      expect(result.success).toBe(true);
    });

    it('defaults count to 5', () => {
      const result = suggestParams.safeParse({ query: 'test' });
      if (result.success) {
        expect(result.data.count).toBe(5);
      }
    });
  });

  describe('Spellcheck params', () => {
    it('parses valid query', () => {
      const result = spellcheckParams.safeParse({ query: 'searh' });
      expect(result.success).toBe(true);
    });
  });

  describe('LLM Context params', () => {
    it('parses valid query', () => {
      const result = llmContextParams.safeParse({ query: 'TypeScript testing' });
      expect(result.success).toBe(true);
    });

    it('defaults maximum_number_of_urls to 5', () => {
      const result = llmContextParams.safeParse({ query: 'test' });
      if (result.success) {
        expect(result.data.maximum_number_of_urls).toBe(5);
      }
    });
  });
});
