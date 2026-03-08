import type { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';
import params, { type LLMContextParams } from './params.js';
import API from '../../BraveAPI/index.js';
import { type McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export const name = 'brave_llm_context';

export const annotations: ToolAnnotations = {
  title: 'Brave LLM Context',
  openWorldHint: true,
};

export const description = `
    Retrieves structured web context optimized for LLM consumption using the Brave LLM Context API.
    Returns clean, deduplicated text snippets from top web results, ideal for augmenting LLM responses
    with fresh, grounded web information (Retrieval-Augmented Generation).

    When to use:
        - Augmenting LLM answers with current web information (RAG)
        - Grounding responses with up-to-date facts
        - Retrieving context for a query without full web search formatting

    Returns a concatenated context string and list of source URLs.
`;

export const execute = async (inputParams: LLMContextParams) => {
  const response = await API.issueRequest<'llmContext'>('llmContext', inputParams);

  const content = [];

  content.push({
    type: 'text' as const,
    text: response.context,
  });

  if (response.urls && response.urls.length > 0) {
    content.push({
      type: 'text' as const,
      text: 'Sources:\n' + response.urls.map((u) => `- ${u.title ?? u.url}: ${u.url}`).join('\n'),
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
