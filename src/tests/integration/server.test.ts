import { describe, it, expect, beforeEach } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import tools from '../../tools/index.js';

function createTestServer(): McpServer {
  const server = new McpServer({ name: 'test-brave-search', version: '0.0.1' });
  for (const tool of Object.values(tools)) {
    tool.register(server);
  }
  return server;
}

describe('MCP Server integration', () => {
  let client: Client;
  let server: McpServer;

  beforeEach(async () => {
    server = createTestServer();
    client = new Client({ name: 'test-client', version: '0.0.1' });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([client.connect(clientTransport), server.connect(serverTransport)]);
  });

  it('lists all registered tools', async () => {
    const { tools: listedTools } = await client.listTools();
    const toolNames = listedTools.map((t) => t.name);

    expect(toolNames).toContain('brave_web_search');
    expect(toolNames).toContain('brave_news_search');
    expect(toolNames).toContain('brave_image_search');
    expect(toolNames).toContain('brave_video_search');
    expect(toolNames).toContain('brave_local_search');
    expect(toolNames).toContain('brave_summarizer');
    expect(toolNames).toContain('brave_autosuggest');
    expect(toolNames).toContain('brave_spellcheck');
    expect(toolNames).toContain('brave_llm_context');
  });

  it('lists exactly 9 tools', async () => {
    const { tools: listedTools } = await client.listTools();
    expect(listedTools).toHaveLength(9);
  });

  it('web search tool has correct description', async () => {
    const { tools: listedTools } = await client.listTools();
    const webTool = listedTools.find((t) => t.name === 'brave_web_search');
    expect(webTool).toBeDefined();
    expect(webTool!.description).toContain('Brave Search API');
  });

  it('llm context tool has required query parameter', async () => {
    const { tools: listedTools } = await client.listTools();
    const llmTool = listedTools.find((t) => t.name === 'brave_llm_context');
    expect(llmTool).toBeDefined();
    expect(llmTool!.inputSchema.required).toContain('query');
  });
});
