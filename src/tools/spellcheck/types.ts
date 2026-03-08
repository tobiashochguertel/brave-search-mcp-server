export interface SpellcheckApiResponse {
  type: 'spellcheck';
  results: SpellcheckResult[];
}

export interface SpellcheckResult {
  query: string;
  altered_query?: string;
}
