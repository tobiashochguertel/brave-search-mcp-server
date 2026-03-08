export interface LLMContextApiResponse {
  grounding: {
    generic: LLMContextGroundingItem[];
    map?: LLMContextGroundingItem[];
  };
  sources: Record<string, LLMContextSource>;
}

export interface LLMContextGroundingItem {
  url: string;
  title: string;
  snippets: string[];
}

export interface LLMContextSource {
  title: string;
  hostname: string;
  age?: string[];
}
