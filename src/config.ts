import { LoggingLevel, LoggingLevelSchema } from '@modelcontextprotocol/sdk/types.js';
import { Command } from 'commander';
import dotenv from 'dotenv';
import { z } from 'zod';
import tools from './tools/index.js';

dotenv.config({ debug: false, quiet: true });

// Config schema for Smithery.ai
export const configSchema = z.object({
  braveApiKey: z
    .string()
    .describe('Default/fallback API key for the Brave Search API')
    .default(process.env.BRAVE_API_KEY ?? ''),
  // Per-subscription API keys (each Brave plan has its own key)
  braveSearchApiKey: z
    .string()
    .describe('API key for the Search plan (web, news, images, videos, local, llm-context)')
    .default(process.env.BRAVE_SEARCH_API_KEY ?? '')
    .optional(),
  braveAiApiKey: z
    .string()
    .describe('API key for the Free AI plan (summarizer)')
    .default(process.env.BRAVE_AI_API_KEY ?? '')
    .optional(),
  braveProAiApiKey: z
    .string()
    .describe('API key for the Pro AI plan (summarizer, deprecated plan)')
    .default(process.env.BRAVE_PRO_AI_API_KEY ?? '')
    .optional(),
  braveAnswersApiKey: z
    .string()
    .describe('API key for the Answers plan (chat completions / summarizer)')
    .default(process.env.BRAVE_ANSWERS_API_KEY ?? '')
    .optional(),
  braveAutosuggestApiKey: z
    .string()
    .describe('API key for the Autosuggest plan (/suggest/search)')
    .default(process.env.BRAVE_AUTOSUGGEST_API_KEY ?? '')
    .optional(),
  braveSpellcheckApiKey: z
    .string()
    .describe('API key for the Spellcheck plan (/spellcheck/search)')
    .default(process.env.BRAVE_SPELLCHECK_API_KEY ?? '')
    .optional(),
  enabledTools: z
    .array(z.string())
    .describe('Enforces a tool whitelist (cannot be used with disabledTools)')
    .optional(),
  disabledTools: z
    .array(z.string())
    .describe('Enforces a tool blacklist (cannot be used with enabledTools)')
    .optional(),
  loggingLevel: z
    .enum([
      'debug',
      'error',
      'info',
      'notice',
      'warning',
      'critical',
      'alert',
      'emergency',
    ] as const)
    .default('info')
    .describe('Desired logging level')
    .optional(),
  stateless: z
    .boolean()
    .default(false)
    .describe('Whether the server should be stateless')
    .optional(),
  braveApiBaseUrl: z
    .string()
    .url()
    .default(process.env.BRAVE_API_BASE_URL ?? 'https://api.search.brave.com')
    .describe('Base URL for the Brave Search API (override to use a compatible server)')
    .optional(),
});

export type SmitheryConfig = z.infer<typeof configSchema>;

type Configuration = {
  transport: 'stdio' | 'http';
  port: number;
  host: string;
  braveApiKey: string;
  // Per-subscription keys (each Brave subscription plan has its own key)
  braveSearchApiKey: string;
  braveAiApiKey: string;
  braveProAiApiKey: string;
  braveAnswersApiKey: string;
  braveAutosuggestApiKey: string;
  braveSpellcheckApiKey: string;
  braveApiBaseUrl: string;
  loggingLevel: LoggingLevel;
  enabledTools: string[];
  disabledTools: string[];
  stateless: boolean;
};

const state: Configuration & { ready: boolean } = {
  transport: 'stdio',
  port: 8080,
  host: '0.0.0.0',
  braveApiKey: process.env.BRAVE_API_KEY ?? '',
  braveSearchApiKey: process.env.BRAVE_SEARCH_API_KEY ?? '',
  braveAiApiKey: process.env.BRAVE_AI_API_KEY ?? '',
  braveProAiApiKey: process.env.BRAVE_PRO_AI_API_KEY ?? '',
  braveAnswersApiKey: process.env.BRAVE_ANSWERS_API_KEY ?? '',
  braveAutosuggestApiKey: process.env.BRAVE_AUTOSUGGEST_API_KEY ?? '',
  braveSpellcheckApiKey: process.env.BRAVE_SPELLCHECK_API_KEY ?? '',
  braveApiBaseUrl: process.env.BRAVE_API_BASE_URL ?? 'https://api.search.brave.com',
  loggingLevel: 'info',
  ready: false,
  enabledTools: [],
  disabledTools: [],
  stateless: false,
};

export function isToolPermittedByUser(toolName: string): boolean {
  return state.enabledTools.length > 0
    ? state.enabledTools.includes(toolName)
    : state.disabledTools.includes(toolName) === false;
}

export function getOptions(): Configuration | false {
  const program = new Command()
    .option(
      '--brave-api-key <string>',
      'Default/fallback Brave API key',
      process.env.BRAVE_API_KEY ?? ''
    )
    .option(
      '--brave-search-api-key <string>',
      'API key for Search plan (web, news, images, videos, local, llm-context)',
      process.env.BRAVE_SEARCH_API_KEY ?? ''
    )
    .option(
      '--brave-ai-api-key <string>',
      'API key for Free AI plan (summarizer)',
      process.env.BRAVE_AI_API_KEY ?? ''
    )
    .option(
      '--brave-pro-ai-api-key <string>',
      'API key for Pro AI plan (summarizer, deprecated)',
      process.env.BRAVE_PRO_AI_API_KEY ?? ''
    )
    .option(
      '--brave-answers-api-key <string>',
      'API key for Answers plan (chat completions)',
      process.env.BRAVE_ANSWERS_API_KEY ?? ''
    )
    .option(
      '--brave-autosuggest-api-key <string>',
      'API key for Autosuggest plan',
      process.env.BRAVE_AUTOSUGGEST_API_KEY ?? ''
    )
    .option(
      '--brave-spellcheck-api-key <string>',
      'API key for Spellcheck plan',
      process.env.BRAVE_SPELLCHECK_API_KEY ?? ''
    )
    .option('--logging-level <string>', 'Logging level', process.env.BRAVE_MCP_LOG_LEVEL ?? 'info')
    .option(
      '--transport <stdio|http>',
      'transport type',
      process.env.BRAVE_MCP_TRANSPORT ?? 'stdio'
    )
    .option(
      '--enabled-tools <names...>',
      'tools to enable',
      process.env.BRAVE_MCP_ENABLED_TOOLS?.trim().split(' ') ?? []
    )
    .option(
      '--disabled-tools <names...>',
      'tools to disable',
      process.env.BRAVE_MCP_DISABLED_TOOLS?.trim().split(' ') ?? []
    )
    .option(
      '--port <number>',
      'desired port for HTTP transport',
      process.env.BRAVE_MCP_PORT ?? '8080'
    )
    .option(
      '--host <string>',
      'desired host for HTTP transport',
      process.env.BRAVE_MCP_HOST ?? '0.0.0.0'
    )
    .option(
      '--stateless <boolean>',
      'whether the server should be stateless',
      process.env.BRAVE_MCP_STATELESS === 'true' ? true : false
    )
    .option(
      '--brave-api-base-url <string>',
      'Base URL for the Brave Search API',
      process.env.BRAVE_API_BASE_URL ?? 'https://api.search.brave.com'
    )
    .allowUnknownOption()
    .parse(process.argv);

  const options = program.opts();
  const toolNames = Object.values(tools).map((tool) => tool.name);

  // Validate tool inclusion configuration
  const enabledTools = options.enabledTools.filter((t: string) => t.trim().length > 0);
  const disabledTools = options.disabledTools.filter((t: string) => t.trim().length > 0);

  if (enabledTools.length > 0 && disabledTools.length > 0) {
    console.error('Error: --enabled-tools and --disabled-tools cannot be used together');
    return false;
  }

  if (
    [...enabledTools, ...disabledTools].some(
      (t) => t.trim().length > 0 && !toolNames.includes(t.trim())
    )
  ) {
    console.error(`Invalid tool name used. Must be one of: ${toolNames.join(', ')}`);
    return false;
  }

  // Validate all other options
  if (!['stdio', 'http'].includes(options.transport)) {
    console.error(
      `Invalid --transport value: '${options.transport}'. Must be one of: stdio, http.`
    );
    return false;
  }

  if (!LoggingLevelSchema.options.includes(options.loggingLevel)) {
    console.error(
      `Invalid --logging-level value: '${options.loggingLevel}'. Must be one of: ${LoggingLevelSchema.options.join(', ')}`
    );
    return false;
  }

  if (!options.braveApiKey && !options.braveSearchApiKey) {
    console.error(
      'Error: At least one API key is required. Set BRAVE_API_KEY as default, or use subscription-specific keys. Get keys at https://brave.com/search/api/.'
    );
    return false;
  }

  if (options.transport === 'http') {
    if (options.port < 1 || options.port > 65535) {
      console.error(
        `Invalid --port value: '${options.port}'. Must be a valid port number between 1 and 65535.`
      );
      return false;
    }

    if (!options.host) {
      console.error('Error: --host is required');
      return false;
    }
  }

  // Normalize stateless to boolean (CLI passes it as string)
  options.stateless = options.stateless === true || options.stateless === 'true';

  // Update state
  state.braveApiKey = options.braveApiKey;
  state.braveSearchApiKey = options.braveSearchApiKey ?? '';
  state.braveAiApiKey = options.braveAiApiKey ?? '';
  state.braveProAiApiKey = options.braveProAiApiKey ?? '';
  state.braveAnswersApiKey = options.braveAnswersApiKey ?? '';
  state.braveAutosuggestApiKey = options.braveAutosuggestApiKey ?? '';
  state.braveSpellcheckApiKey = options.braveSpellcheckApiKey ?? '';
  state.braveApiBaseUrl = options.braveApiBaseUrl;
  state.transport = options.transport;
  state.port = options.port;
  state.host = options.host;
  state.loggingLevel = options.loggingLevel;
  state.enabledTools = options.enabledTools;
  state.disabledTools = options.disabledTools;
  state.stateless = options.stateless;
  state.ready = true;

  return options as Configuration;
}

export function setOptions(options: SmitheryConfig) {
  return Object.assign(state, options);
}

export function getBraveApiBaseUrl(): string {
  return state.braveApiBaseUrl;
}

/**
 * Returns the appropriate API key for a given endpoint.
 *
 * Brave Search API uses separate subscription plans, each requiring its own key:
 * - Search plan      (BRAVE_SEARCH_API_KEY): web, news, images, videos, local, llm-context
 * - Answers plan     (BRAVE_ANSWERS_API_KEY): chat completions (brave_answers tool)
 * - Pro AI plan      (BRAVE_PRO_AI_API_KEY): summarizer (deprecated plan)
 * - Free AI plan     (BRAVE_AI_API_KEY):     summarizer (free tier)
 * - Autosuggest plan (BRAVE_AUTOSUGGEST_API_KEY): suggest
 * - Spellcheck plan  (BRAVE_SPELLCHECK_API_KEY): spellcheck
 *
 * Falls back to BRAVE_API_KEY if a subscription-specific key is not configured.
 */
export function getApiKeyForEndpoint(
  endpoint: keyof import('./BraveAPI/types.js').Endpoints
): string {
  switch (endpoint) {
    case 'web':
    case 'news':
    case 'images':
    case 'videos':
    case 'localPois':
    case 'localDescriptions':
    case 'llmContext':
      return state.braveSearchApiKey || state.braveApiKey;
    case 'answers':
      // Answers plan is primary; fallback to proAi → freeAi → default
      return (
        state.braveAnswersApiKey ||
        state.braveProAiApiKey ||
        state.braveAiApiKey ||
        state.braveApiKey
      );
    case 'summarizer':
      // Pro AI key takes priority; fallback chain: proAi → answers → freeAi → default
      return (
        state.braveProAiApiKey ||
        state.braveAnswersApiKey ||
        state.braveAiApiKey ||
        state.braveApiKey
      );
    case 'suggest':
      return state.braveAutosuggestApiKey || state.braveApiKey;
    case 'spellcheck':
      return state.braveSpellcheckApiKey || state.braveApiKey;
    default:
      return state.braveApiKey;
  }
}

export default state;
