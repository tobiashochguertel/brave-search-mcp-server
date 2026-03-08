/** OpenAI-compatible chat completions response from Brave Answers API. */
export interface AnswersApiResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: AnswersChoice[];
  usage?: AnswersUsage;
}

export interface AnswersChoice {
  index: number;
  message: {
    role: 'assistant';
    content: string;
  };
  finish_reason: 'stop' | 'length' | null;
}

export interface AnswersUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/** Brave-specific params merged into the OpenAI request body. */
export interface AnswersRequestBody {
  messages: { role: 'user'; content: string }[];
  model: 'brave';
  /** Use true when enable_citations or enable_entities are set; handled transparently by the API client. */
  stream?: boolean;
  country?: string;
  language?: string;
  /** Inline citations from web sources. Internally uses Brave SSE streaming, assembled before returning. */
  enable_citations?: boolean;
  /** Structured entity data in the answer. Internally uses Brave SSE streaming, assembled before returning. */
  enable_entities?: boolean;
  enable_research?: boolean;
}
