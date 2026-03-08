export interface SuggestApiResponse {
  type: 'suggest';
  query: string;
  results: SuggestResult[];
}

export interface SuggestResult {
  query: string;
  is_entity?: boolean;
  title?: string;
  description?: string;
  img?: string;
}
