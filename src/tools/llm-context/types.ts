export interface LLMContextApiResponse {
  type: 'llm_context';
  query: LLMContextQuery;
  context: string;
  urls: LLMContextUrl[];
}

export interface LLMContextQuery {
  original: string;
  altered?: string;
}

export interface LLMContextUrl {
  url: string;
  title?: string;
  age?: string;
}
