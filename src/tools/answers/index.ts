import type { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';
import params, { type AnswersParams } from './params.js';
import API from '../../BraveAPI/index.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export const name = 'brave_answers';

export const annotations: ToolAnnotations = {
  title: 'Brave AI Answers',
  openWorldHint: true,
};

export const description = `
    Provides AI-generated answers backed by real-time web search using the Brave Answers API.
    Returns grounded, verifiable answers with optional inline citations and entity data.

    When to use:
        - Answering factual questions with cited sources
        - Research queries requiring up-to-date information
        - Getting AI-synthesized answers backed by live web search

    Parameters:
        - enable_citations: Add inline source citations to the answer
        - enable_entities: Include structured entity data (people, places, things)
        - enable_research: Multi-search research mode for thorough answers (slower, higher cost)

    Requires a Brave Answers plan API key (BRAVE_ANSWERS_API_KEY).
`;

export const execute = async (inputParams: AnswersParams) => {
  const { query, country, language, enable_research, enable_citations, enable_entities } = inputParams;

  // Citations and entities require Brave's streaming mode; BraveAPI assembles the SSE chunks transparently.
  const needsStreaming = enable_citations === true || enable_entities === true;

  const response = await API.issueRequest<'answers'>('answers', {
    messages: [{ role: 'user', content: query }],
    model: 'brave',
    stream: needsStreaming ? true : false,
    ...(country !== undefined && { country }),
    ...(language !== undefined && { language }),
    ...(enable_research !== undefined && { enable_research }),
    ...(enable_citations !== undefined && { enable_citations }),
    ...(enable_entities !== undefined && { enable_entities }),
  });

  const content: { type: 'text'; text: string }[] = [];

  const answer = response.choices?.[0]?.message?.content ?? '';

  if (answer) {
    content.push({ type: 'text', text: answer });
  } else {
    content.push({ type: 'text', text: 'No answer returned.' });
  }

  if (response.usage) {
    const { prompt_tokens, completion_tokens, total_tokens } = response.usage;
    content.push({
      type: 'text',
      text: `\n*Tokens used: ${prompt_tokens} in / ${completion_tokens} out / ${total_tokens} total*`,
    });
  }

  return { content };
};

export const register = (mcpServer: McpServer) => {
  mcpServer.registerTool(
    name,
    {
      title: name,
      description,
      inputSchema: params.shape,
      annotations,
    },
    execute
  );
};

export default { name, description, annotations, inputSchema: params.shape, execute, register };
