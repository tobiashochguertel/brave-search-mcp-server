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
  stream: false;
  country?: string;
  language?: string;
  /** Requires stream: true — not supported in this non-streaming implementation. */
  enable_citations?: boolean;
  /** Requires stream: true — not supported in this non-streaming implementation. */
  enable_entities?: boolean;
  enable_research?: boolean;
}
