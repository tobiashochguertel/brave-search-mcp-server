import type { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';
import params, { type SuggestParams } from './params.js';
import API from '../../BraveAPI/index.js';
import { stringify } from '../../utils.js';
import { type McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export const name = 'brave_autosuggest';

export const annotations: ToolAnnotations = {
  title: 'Brave Autosuggest',
  openWorldHint: true,
};

export const description = `
    Returns search query suggestions from the Brave Autosuggest API. Use this to help users
    discover related queries or correct spelling as they type.

    When to use:
        - Providing query completion suggestions
        - Discovering related search terms
        - Improving search UX with real-time suggestions

    Returns a list of suggested queries, optionally with rich metadata (title, description, image).
`;

export const execute = async (inputParams: SuggestParams) => {
  const response = await API.issueRequest<'suggest'>('suggest', inputParams);

  return {
    content: response.results.map((result) => ({
      type: 'text' as const,
      text: stringify({
        query: result.query,
        is_entity: result.is_entity,
        title: result.title,
        description: result.description,
      }),
    })),
  };
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
