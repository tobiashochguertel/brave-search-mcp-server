import type { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';
import params, { type SpellcheckParams } from './params.js';
import API from '../../BraveAPI/index.js';
import { stringify } from '../../utils.js';
import { type McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export const name = 'brave_spellcheck';

export const annotations: ToolAnnotations = {
  title: 'Brave Spellcheck',
  openWorldHint: false,
};

export const description = `
    Checks the spelling of a query using the Brave Spellcheck API and returns the corrected query.

    When to use:
        - Correcting user typos before performing a search
        - Normalizing queries for better search results

    Returns the original query and optionally an altered/corrected version.
`;

export const execute = async (inputParams: SpellcheckParams) => {
  const response = await API.issueRequest<'spellcheck'>('spellcheck', inputParams);

  return {
    content: response.results.map((result) => ({
      type: 'text' as const,
      text: stringify({
        query: result.query,
        altered_query: result.altered_query,
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
