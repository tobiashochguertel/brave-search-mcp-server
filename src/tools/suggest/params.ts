import { z } from 'zod';

export const params = z.object({
  query: z.string().max(400).describe('The search query (max 400 chars)'),
  country: z
    .string()
    .default('us')
    .describe('The 2-character country code for localization')
    .optional(),
  lang: z.string().default('en').describe('The language code for suggestions').optional(),
  count: z
    .number()
    .int()
    .min(1)
    .max(20)
    .default(5)
    .describe('Number of suggestions to return (1-20, default 5)')
    .optional(),
  rich: z
    .boolean()
    .default(false)
    .describe('Whether to return rich suggestions with additional metadata')
    .optional(),
});

export type SuggestParams = z.infer<typeof params>;

export default params;
