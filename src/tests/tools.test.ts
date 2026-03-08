import { describe, it, expect } from 'vitest';
import { name as webName } from '../tools/web/index.js';
import { name as newsName } from '../tools/news/index.js';
import { name as imagesName } from '../tools/images/index.js';
import { name as videosName } from '../tools/videos/index.js';
import { name as suggestName } from '../tools/suggest/index.js';
import { name as spellcheckName } from '../tools/spellcheck/index.js';
import { name as llmContextName } from '../tools/llm-context/index.js';

describe('Tool names', () => {
  it('web search tool has correct name', () => {
    expect(webName).toBe('brave_web_search');
  });

  it('news search tool has correct name', () => {
    expect(newsName).toBe('brave_news_search');
  });

  it('images search tool has correct name', () => {
    expect(imagesName).toBe('brave_image_search');
  });

  it('videos search tool has correct name', () => {
    expect(videosName).toBe('brave_video_search');
  });

  it('autosuggest tool has correct name', () => {
    expect(suggestName).toBe('brave_autosuggest');
  });

  it('spellcheck tool has correct name', () => {
    expect(spellcheckName).toBe('brave_spellcheck');
  });

  it('llm context tool has correct name', () => {
    expect(llmContextName).toBe('brave_llm_context');
  });
});
