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
    .describe(
      'Enable multi-search research mode for thorough answers (slower, higher cost). ' +
      'Note: enable_citations and enable_entities are not supported in non-streaming mode.'
    )
    .optional(),
});

export type AnswersParams = z.infer<typeof params>;

export default params;
