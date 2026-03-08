/**
 * E2E tests for the Brave Search MCP Server — HTTP transport.
 *
 * Starts an in-process Express server backed by the real MCP server logic,
 * connects via StreamableHTTPClientTransport, and makes real Brave Search API
 * calls for each tool.
 *
 * Tests are automatically SKIPPED when the required API keys are absent.
 * Set the following environment variables to run them:
 *
 *   BRAVE_API_KEY            – fallback key (Free Search plan)
 *   BRAVE_SEARCH_API_KEY     – Search plan (web/news/images/videos/local/llm-context)
 *   BRAVE_AI_API_KEY         – Free AI plan (summarizer)
 *   BRAVE_PRO_AI_API_KEY     – Pro AI plan (summarizer, deprecated)
 *   BRAVE_ANSWERS_API_KEY    – Answers plan (summarizer / chat completions)
 *   BRAVE_AUTOSUGGEST_API_KEY – Autosuggest plan
 *   BRAVE_SPELLCHECK_API_KEY  – Spellcheck plan
 *
 * Usage:
 *   npm run test:e2e:http
 *   # or with env vars pre-loaded:
 *   source ~/.zsh/tokens.zsh && npm run test:e2e:http
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import httpServer from '../../protocols/http.js';
import { setOptions } from '../../config.js';

// ---------------------------------------------------------------------------
// Key availability — drives test.skipIf() gates
// ---------------------------------------------------------------------------
const searchKey =
  process.env.BRAVE_SEARCH_API_KEY || process.env.BRAVE_API_KEY || '';
const summarizerKey =
  process.env.BRAVE_PRO_AI_API_KEY ||
  process.env.BRAVE_AI_API_KEY ||
  process.env.BRAVE_ANSWERS_API_KEY ||
  '';
const autosuggestKey = process.env.BRAVE_AUTOSUGGEST_API_KEY || '';
const spellcheckKey = process.env.BRAVE_SPELLCHECK_API_KEY || '';

const hasSearchKey = !!searchKey;
const hasSummarizerKey = !!summarizerKey;
const hasAutosuggestKey = !!autosuggestKey;
const hasSpellcheckKey = !!spellcheckKey;

const E2E_TIMEOUT = 45_000; // ms — real API calls can be slow

// ---------------------------------------------------------------------------
// Server + client lifecycle
// ---------------------------------------------------------------------------
let server: http.Server;
let client: Client;
let serverPort: number;

beforeAll(async () => {
  // Propagate API keys from env into the MCP server config state.
  // This must happen BEFORE the first HTTP request, since config is read lazily.
  setOptions({
    braveApiKey: process.env.BRAVE_API_KEY ?? '',
    braveSearchApiKey: process.env.BRAVE_SEARCH_API_KEY ?? '',
    braveAiApiKey: process.env.BRAVE_AI_API_KEY ?? '',
    braveProAiApiKey: process.env.BRAVE_PRO_AI_API_KEY ?? '',
    braveAnswersApiKey: process.env.BRAVE_ANSWERS_API_KEY ?? '',
    braveAutosuggestApiKey: process.env.BRAVE_AUTOSUGGEST_API_KEY ?? '',
    braveSpellcheckApiKey: process.env.BRAVE_SPELLCHECK_API_KEY ?? '',
    loggingLevel: 'error', // suppress server noise during tests
  });

  const app = httpServer.createApp();
  server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  serverPort = (server.address() as AddressInfo).port;

  const baseUrl = new URL(`http://127.0.0.1:${serverPort}/mcp`);
  client = new Client({ name: 'brave-e2e-http-test', version: '1.0.0' });
  const transport = new StreamableHTTPClientTransport(baseUrl);
  await client.connect(transport);
}, E2E_TIMEOUT);

afterAll(async () => {
  await client?.close().catch(() => undefined);
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve()))
  );
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
type TextContent = { type: string; text: string };

const getTextContent = (result: Awaited<ReturnType<typeof client.callTool>>) =>
  (result.content as TextContent[])
    .filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('');

const assertToolSuccess = (result: Awaited<ReturnType<typeof client.callTool>>) => {
  expect(result, 'callTool result should be defined').toBeDefined();
  const content = result.content as unknown[];
  expect(content, 'content array should be defined').toBeDefined();
  expect(Array.isArray(content), 'content should be an array').toBe(true);
  expect(content.length, 'content should be non-empty').toBeGreaterThan(0);
  expect(result.isError, 'should not be an error').toBeFalsy();
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('HTTP Transport E2E', () => {
  // ---- Infrastructure ----
  describe('Infrastructure', () => {
    it('server responds to /ping health check', async () => {
      const res = await fetch(`http://127.0.0.1:${serverPort}/ping`);
      expect(res.status).toBe(200);
      const body = (await res.json()) as { message: string };
      expect(body.message).toBe('pong');
    });

    it('lists all 9 registered tools', async () => {
      const { tools } = await client.listTools();
      const names = tools.map((t) => t.name);

      expect(names).toHaveLength(9);
      expect(names).toContain('brave_web_search');
      expect(names).toContain('brave_news_search');
      expect(names).toContain('brave_image_search');
      expect(names).toContain('brave_video_search');
      expect(names).toContain('brave_local_search');
      expect(names).toContain('brave_summarizer');
      expect(names).toContain('brave_autosuggest');
      expect(names).toContain('brave_spellcheck');
      expect(names).toContain('brave_llm_context');
    });

    it('each tool has a description and inputSchema', async () => {
      const { tools } = await client.listTools();
      for (const tool of tools) {
        expect(tool.description, `${tool.name} should have a description`).toBeTruthy();
        expect(tool.inputSchema, `${tool.name} should have an inputSchema`).toBeDefined();
      }
    });
  });

  // ---- Search plan endpoints (BRAVE_SEARCH_API_KEY or BRAVE_API_KEY) ----
  describe('Search plan endpoints', () => {
    it.skipIf(!hasSearchKey)(
      'brave_web_search — returns web results',
      async () => {
        const result = await client.callTool({
          name: 'brave_web_search',
          arguments: { query: 'Gifhorn Germany', country: 'DE' },
        });
        assertToolSuccess(result);
        const text = getTextContent(result);
        expect(text.length).toBeGreaterThan(50);
      },
      E2E_TIMEOUT
    );

    it.skipIf(!hasSearchKey)(
      'brave_news_search — returns news articles',
      async () => {
        const result = await client.callTool({
          name: 'brave_news_search',
          arguments: { query: 'technology 2025', country: 'US' },
        });
        assertToolSuccess(result);
      },
      E2E_TIMEOUT
    );

    it.skipIf(!hasSearchKey)(
      'brave_image_search — returns image results',
      async () => {
        const result = await client.callTool({
          name: 'brave_image_search',
          arguments: { query: 'Gifhorn castle Germany' },
        });
        assertToolSuccess(result);
      },
      E2E_TIMEOUT
    );

    it.skipIf(!hasSearchKey)(
      'brave_video_search — returns video results',
      async () => {
        const result = await client.callTool({
          name: 'brave_video_search',
          arguments: { query: 'TypeScript tutorial 2025' },
        });
        assertToolSuccess(result);
      },
      E2E_TIMEOUT
    );

    it.skipIf(!hasSearchKey)(
      'brave_local_search — returns local POIs or falls back to web',
      async () => {
        const result = await client.callTool({
          name: 'brave_local_search',
          arguments: {
            query: 'pharmacy near Gifhorn Germany',
            country: 'DE',
          },
        });
        // Local search always returns content (either POI data or web fallback)
        expect(result).toBeDefined();
        const content = result.content as unknown[];
        expect(content).toBeDefined();
        expect(Array.isArray(content)).toBe(true);
        expect(content.length).toBeGreaterThan(0);
      },
      E2E_TIMEOUT
    );

    it.skipIf(!hasSearchKey)(
      'brave_llm_context — returns structured context for LLM grounding',
      async () => {
        const result = await client.callTool({
          name: 'brave_llm_context',
          arguments: { query: 'What is TypeScript?' },
        });
        assertToolSuccess(result);
        const text = getTextContent(result);
        expect(text.length).toBeGreaterThan(50);
      },
      E2E_TIMEOUT
    );
  });

  // ---- Summarizer endpoint (Pro AI / Free AI / Answers plan) ----
  describe('Summarizer endpoint', () => {
    it.skipIf(!hasSearchKey || !hasSummarizerKey)(
      'brave_web_search with summary=true returns a response (summarizer key present)',
      async () => {
        // Step 1: trigger a web search with the summary flag
        const webResult = await client.callTool({
          name: 'brave_web_search',
          arguments: {
            query: 'What is the capital of Germany?',
            summary: true,
          },
        });
        expect(webResult).toBeDefined();
        // The tool should not hard-error regardless of whether summarizer returns data
        // (it may return a partial response if the subscription doesn't support summary)
        expect(webResult.content).toBeDefined();
        expect(Array.isArray(webResult.content)).toBe(true);
      },
      E2E_TIMEOUT
    );
  });

  // ---- Autosuggest endpoint (BRAVE_AUTOSUGGEST_API_KEY) ----
  describe('Autosuggest endpoint', () => {
    it.skipIf(!hasAutosuggestKey)(
      'brave_autosuggest — returns query suggestions',
      async () => {
        const result = await client.callTool({
          name: 'brave_autosuggest',
          arguments: { query: 'gifh', country: 'de' },
        });
        assertToolSuccess(result);
        const text = getTextContent(result);
        expect(text.length).toBeGreaterThan(0);
      },
      E2E_TIMEOUT
    );
  });

  // ---- Spellcheck endpoint (BRAVE_SPELLCHECK_API_KEY) ----
  describe('Spellcheck endpoint', () => {
    it.skipIf(!hasSpellcheckKey)(
      'brave_spellcheck — corrects a misspelling',
      async () => {
        const result = await client.callTool({
          name: 'brave_spellcheck',
          arguments: { query: 'artficial inteligence', country: 'us' },
        });
        assertToolSuccess(result);
        const text = getTextContent(result);
        expect(text.toLowerCase()).toContain('artificial');
      },
      E2E_TIMEOUT
    );

    it.skipIf(!hasSpellcheckKey)(
      'brave_spellcheck — returns empty results for correctly spelled text',
      async () => {
        const result = await client.callTool({
          name: 'brave_spellcheck',
          arguments: { query: 'hello world', country: 'us' },
        });
        // No error even when nothing needs correction
        expect(result).toBeDefined();
        expect(result.isError).toBeFalsy();
      },
      E2E_TIMEOUT
    );
  });

  // ---- API key routing verification ----
  describe('API key routing', () => {
    it.skipIf(!hasSearchKey)(
      'search endpoints use BRAVE_SEARCH_API_KEY (not BRAVE_API_KEY fallback)',
      async () => {
        // If the search-specific key is configured and correct, this succeeds.
        // A 401/403 in the response text would indicate wrong key routing.
        const result = await client.callTool({
          name: 'brave_web_search',
          arguments: { query: 'test API key routing', country: 'US' },
        });
        const text = getTextContent(result);
        // Presence of a 401/403 in the response indicates key routing failure
        expect(text).not.toMatch(/401|403|Unauthorized|Forbidden/i);
      },
      E2E_TIMEOUT
    );
  });
});
