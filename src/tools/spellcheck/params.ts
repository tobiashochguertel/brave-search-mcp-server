import { z } from 'zod';

export const params = z.object({
  query: z.string().max(400).describe('The text to spellcheck (max 400 chars)'),
  country: z.string().default('us').describe('The 2-character country code for locale').optional(),
  lang: z.string().default('en').describe('The language code for spellcheck').optional(),
});

export type SpellcheckParams = z.infer<typeof params>;

export default params;
