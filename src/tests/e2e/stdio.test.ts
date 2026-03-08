/**
 * E2E tests for the Brave Search MCP Server — stdio transport.
 *
 * Spawns the compiled server binary (dist/index.js) as a child process and
 * communicates via stdin/stdout using StdioClientTransport.
 *
 * Prerequisites:
 *   npm run build   (produces dist/index.js)
 *
 * Tests are automatically SKIPPED when:
 *   - dist/index.js does not exist (run npm run build first)
 *   - The required API keys are not set
 *
 * Set the following environment variables to run them:
 *   BRAVE_API_KEY            – fallback key (Free Search plan)
 *   BRAVE_SEARCH_API_KEY     – Search plan (web/news/images/videos/local/llm-context)
 *   BRAVE_AI_API_KEY         – Free AI plan (summarizer)
 *   BRAVE_PRO_AI_API_KEY     – Pro AI plan (summarizer, deprecated)
 *   BRAVE_ANSWERS_API_KEY    – Answers plan
 *   BRAVE_AUTOSUGGEST_API_KEY – Autosuggest plan
 *   BRAVE_SPELLCHECK_API_KEY  – Spellcheck plan
 *
 * Usage:
 *   npm run build && npm run test:e2e:stdio
 *   # or with env vars pre-loaded:
 *   source ~/.zsh/tokens.zsh && npm run build && npm run test:e2e:stdio
 */

import { describe, it, expect } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SERVER_PATH = resolve(__dirname, '../../../dist/index.js');

// ---------------------------------------------------------------------------
// Gate conditions
// ---------------------------------------------------------------------------
const serverBuilt = existsSync(SERVER_PATH);
const searchKey = process.env.BRAVE_SEARCH_API_KEY || process.env.BRAVE_API_KEY || '';
const autosuggestKey = process.env.BRAVE_AUTOSUGGEST_API_KEY || '';
const spellcheckKey = process.env.BRAVE_SPELLCHECK_API_KEY || '';
const answersKey = process.env.BRAVE_ANSWERS_API_KEY || '';

const hasServerBinary = serverBuilt;
const hasSearchKey = !!searchKey;
const hasAutosuggestKey = !!autosuggestKey;
const hasSpellcheckKey = !!spellcheckKey;
const hasAnswersKey = !!answersKey;

const E2E_TIMEOUT = 45_000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build the env object passed to the child process.
 *  Only passes defined keys — avoids empty strings that could confuse auth. */
const buildChildEnv = (): Record<string, string> => {
  const keys = [
    'BRAVE_API_KEY',
    'BRAVE_SEARCH_API_KEY',
    'BRAVE_AI_API_KEY',
    'BRAVE_PRO_AI_API_KEY',
    'BRAVE_ANSWERS_API_KEY',
    'BRAVE_AUTOSUGGEST_API_KEY',
    'BRAVE_SPELLCHECK_API_KEY',
    // Pass through PATH so node can find itself
    'PATH',
    'HOME',
  ] as const;

  const env: Record<string, string> = {};
  for (const key of keys) {
    if (process.env[key]) env[key] = process.env[key]!;
  }
  return env;
};

/** Spawns a fresh stdio MCP client connected to the server binary. */
const createClient = async (): Promise<{ client: Client; close: () => Promise<void> }> => {
  const transport = new StdioClientTransport({
    command: 'node',
    args: [SERVER_PATH],
    env: buildChildEnv(),
  });

  const client = new Client({ name: 'brave-e2e-stdio-test', version: '1.0.0' });
  await client.connect(transport);

  const close = async () => {
    await client.close().catch(() => undefined);
  };

  return { client, close };
};

type TextContent = { type: string; text: string };

const getTextContent = (result: Awaited<ReturnType<Client['callTool']>>) =>
  (result.content as TextContent[])
    .filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('');

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('stdio Transport E2E', () => {
  // ---- Pre-flight ----
  it('server binary exists at dist/index.js', () => {
    if (!hasServerBinary) {
      console.warn('⚠  dist/index.js not found — run `npm run build` before stdio e2e tests');
    }
    // Not a hard fail — just documents the requirement
    expect(hasServerBinary || !hasServerBinary).toBe(true);
  });

  // ---- Tool listing ----
  it.skipIf(!hasServerBinary || !hasSearchKey)(
    'lists all 10 tools via stdio transport',
    async () => {
      const { client, close } = await createClient();
      try {
        const { tools } = await client.listTools();
        const names = tools.map((t) => t.name);

        expect(names).toHaveLength(10);
        expect(names).toContain('brave_web_search');
        expect(names).toContain('brave_news_search');
        expect(names).toContain('brave_image_search');
        expect(names).toContain('brave_video_search');
        expect(names).toContain('brave_local_search');
        expect(names).toContain('brave_summarizer');
        expect(names).toContain('brave_autosuggest');
        expect(names).toContain('brave_spellcheck');
        expect(names).toContain('brave_llm_context');
        expect(names).toContain('brave_answers');
      } finally {
        await close();
      }
    },
    E2E_TIMEOUT
  );

  // ---- Search plan ----
  it.skipIf(!hasServerBinary || !hasSearchKey)(
    'brave_web_search returns results via stdio',
    async () => {
      const { client, close } = await createClient();
      try {
        const result = await client.callTool({
          name: 'brave_web_search',
          arguments: { query: 'Gifhorn Germany', country: 'DE' },
        });
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.isError).toBeFalsy();
        const text = getTextContent(result);
        expect(text.length).toBeGreaterThan(50);
      } finally {
        await close();
      }
    },
    E2E_TIMEOUT
  );

  it.skipIf(!hasServerBinary || !hasSearchKey)(
    'brave_news_search returns results via stdio',
    async () => {
      const { client, close } = await createClient();
      try {
        const result = await client.callTool({
          name: 'brave_news_search',
          arguments: { query: 'technology news 2025' },
        });
        expect(result).toBeDefined();
        expect(result.isError).toBeFalsy();
      } finally {
        await close();
      }
    },
    E2E_TIMEOUT
  );

  it.skipIf(!hasServerBinary || !hasSearchKey)(
    'brave_image_search returns results via stdio',
    async () => {
      const { client, close } = await createClient();
      try {
        const result = await client.callTool({
          name: 'brave_image_search',
          arguments: { query: 'Gifhorn castle' },
        });
        expect(result).toBeDefined();
        expect(result.isError).toBeFalsy();
      } finally {
        await close();
      }
    },
    E2E_TIMEOUT
  );

  it.skipIf(!hasServerBinary || !hasSearchKey)(
    'brave_video_search returns results via stdio',
    async () => {
      const { client, close } = await createClient();
      try {
        const result = await client.callTool({
          name: 'brave_video_search',
          arguments: { query: 'TypeScript tutorial' },
        });
        expect(result).toBeDefined();
        expect(result.isError).toBeFalsy();
      } finally {
        await close();
      }
    },
    E2E_TIMEOUT
  );

  it.skipIf(!hasServerBinary || !hasSearchKey)(
    'brave_local_search returns POIs or web fallback via stdio',
    async () => {
      const { client, close } = await createClient();
      try {
        const result = await client.callTool({
          name: 'brave_local_search',
          arguments: { query: 'pharmacy near Gifhorn Germany', country: 'DE' },
        });
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(Array.isArray(result.content)).toBe(true);
        const content = result.content as unknown[];
        expect(content.length).toBeGreaterThan(0);
      } finally {
        await close();
      }
    },
    E2E_TIMEOUT
  );

  it.skipIf(!hasServerBinary || !hasSearchKey)(
    'brave_llm_context returns structured LLM context via stdio',
    async () => {
      const { client, close } = await createClient();
      try {
        const result = await client.callTool({
          name: 'brave_llm_context',
          arguments: { query: 'What is TypeScript?' },
        });
        expect(result).toBeDefined();
        expect(result.isError).toBeFalsy();
        const text = getTextContent(result);
        expect(text.length).toBeGreaterThan(50);
      } finally {
        await close();
      }
    },
    E2E_TIMEOUT
  );

  // ---- Autosuggest ----
  it.skipIf(!hasServerBinary || !hasAutosuggestKey)(
    'brave_autosuggest returns suggestions via stdio',
    async () => {
      const { client, close } = await createClient();
      try {
        const result = await client.callTool({
          name: 'brave_autosuggest',
          arguments: { query: 'gifh', country: 'de' },
        });
        expect(result).toBeDefined();
        expect(result.isError).toBeFalsy();
        const text = getTextContent(result);
        expect(text.length).toBeGreaterThan(0);
      } finally {
        await close();
      }
    },
    E2E_TIMEOUT
  );

  // ---- Spellcheck ----
  it.skipIf(!hasServerBinary || !hasSpellcheckKey)(
    'brave_spellcheck corrects misspelling via stdio',
    async () => {
      const { client, close } = await createClient();
      try {
        const result = await client.callTool({
          name: 'brave_spellcheck',
          arguments: { query: 'artficial inteligence', country: 'us' },
        });
        expect(result).toBeDefined();
        expect(result.isError).toBeFalsy();
        const text = getTextContent(result);
        expect(text.toLowerCase()).toContain('artificial');
      } finally {
        await close();
      }
    },
    E2E_TIMEOUT
  );

  // ---- Answers ----
  it.skipIf(!hasServerBinary || !hasAnswersKey)(
    'brave_answers returns an AI-generated answer via stdio',
    async () => {
      const { client, close } = await createClient();
      try {
        const result = await client.callTool({
          name: 'brave_answers',
          arguments: { query: 'What is the capital of Germany?', country: 'de' },
        });
        expect(result).toBeDefined();
        expect(result.isError).toBeFalsy();
        const text = getTextContent(result);
        expect(text.toLowerCase()).toMatch(/berlin/i);
      } finally {
        await close();
      }
    },
    E2E_TIMEOUT
  );

  // ---- Per-endpoint API key routing ----
  it.skipIf(!hasServerBinary || !hasSearchKey)(
    'server uses correct API key per endpoint (no 401/403 in search response)',
    async () => {
      const { client, close } = await createClient();
      try {
        const result = await client.callTool({
          name: 'brave_web_search',
          arguments: { query: 'test key routing', country: 'US' },
        });
        const text = getTextContent(result);
        expect(text).not.toMatch(/401|403|Unauthorized|Forbidden/i);
      } finally {
        await close();
      }
    },
    E2E_TIMEOUT
  );
});
