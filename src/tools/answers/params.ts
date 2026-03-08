import { z } from 'zod';

export const params = z.object({
  query: z
    .string()
    .min(1)
    .max(2000)
    .describe('The question or prompt to answer (max 2000 chars)'),
  country: z
    .string()
    .length(2)
    .default('us')
    .describe('2-letter country code for localized search context (e.g. "us", "de")')
    .optional(),
  language: z
    .string()
    .default('en')
    .describe('Language code for the response (e.g. "en", "de")')
    .optional(),
  enable_research: z
    .boolean()
    .default(false)
    .describe('Enable multi-search research mode for thorough answers (slower, higher cost).')
    .optional(),
  enable_citations: z
    .boolean()
    .default(false)
    .describe('Include inline citations from web sources in the answer. Streaming is handled internally.')
    .optional(),
  enable_entities: z
    .boolean()
    .default(false)
    .describe('Include structured entity data in the answer. Streaming is handled internally.')
    .optional(),
});

export type AnswersParams = z.infer<typeof params>;

export default params;
