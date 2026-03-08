import { z } from 'zod';

export const params = z.object({
  query: z.string().max(400).describe('The query to retrieve LLM context for (max 400 chars)'),
  country: z.string().default('us').describe('The 2-character country code').optional(),
  search_lang: z.string().default('en').describe('Language for search results').optional(),
  ui_lang: z
    .string()
    .default('en-US')
    .describe('UI language preference (language_code-country_code)')
    .optional(),
  safesearch: z
    .union([z.literal('off'), z.literal('moderate'), z.literal('strict')])
    .default('moderate')
    .describe('Safe search level')
    .optional(),
  freshness: z
    .union([z.literal('pd'), z.literal('pw'), z.literal('pm'), z.literal('py'), z.string()])
    .describe('Date range filter')
    .optional(),
  text_decorations: z
    .boolean()
    .default(false)
    .describe('Whether to include text decorations')
    .optional(),
  extra_snippets: z
    .boolean()
    .default(false)
    .describe('Whether to include extra snippets')
    .optional(),
  maximum_number_of_urls: z
    .number()
    .int()
    .min(1)
    .max(20)
    .default(5)
    .describe('Maximum number of URLs to include in context (1-20)')
    .optional(),
  maximum_number_of_snippets: z
    .number()
    .int()
    .min(1)
    .max(50)
    .default(20)
    .describe('Maximum number of total snippets (1-50)')
    .optional(),
  maximum_number_of_snippets_per_url: z
    .number()
    .int()
    .min(1)
    .max(50)
    .default(5)
    .describe('Maximum snippets per URL (1-50)')
    .optional(),
  enable_local: z
    .boolean()
    .default(false)
    .describe('Whether to include local business results in context')
    .optional(),
  maximum_number_of_tokens: z
    .number()
    .int()
    .min(100)
    .max(32000)
    .describe('Maximum number of tokens in the context response')
    .optional(),
});

export type LLMContextParams = z.infer<typeof params>;

export default params;
