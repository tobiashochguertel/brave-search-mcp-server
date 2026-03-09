import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import config from '../config.js';
import createMcpServer from '../server.js';

const transports = new Map<string, WebStandardStreamableHTTPServerTransport>();

const getTransport = async (req: Request): Promise<WebStandardStreamableHTTPServerTransport> => {
  const sessionId = req.headers.get('mcp-session-id') ?? undefined;

  if (sessionId && transports.has(sessionId)) {
    return transports.get(sessionId)!;
  }

  let transport: WebStandardStreamableHTTPServerTransport;

  if (config.stateless) {
    transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  } else {
    transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
      onsessioninitialized: (id) => {
        transports.set(id, transport);
      },
      onsessionclosed: (id) => {
        transports.delete(id);
      },
    });
  }

  const mcpServer = createMcpServer();
  await mcpServer.connect(transport);
  return transport;
};

export const createApp = () => {
  const app = new Hono();

  // Health check — intentionally before CORS middleware to skip that overhead
  app.get('/ping', (c) => c.json({ message: 'pong' }));

  app.use(
    '*',
    cors({
      origin: '*',
      allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'mcp-session-id', 'Last-Event-ID', 'mcp-protocol-version'],
      exposeHeaders: ['mcp-session-id', 'mcp-protocol-version'],
    })
  );

  app.all('/mcp', async (c) => {
    try {
      const transport = await getTransport(c.req.raw);
      return transport.handleRequest(c.req.raw);
    } catch (error) {
      console.error(error);
      return c.json(
        { id: null, jsonrpc: '2.0', error: { code: -32603, message: 'Internal server error' } },
        500
      );
    }
  });

  return app;
};

const start = () => {
  if (!config.ready) {
    console.error('Invalid configuration');
    process.exit(1);
  }
  // Server bootstrap is handled by the runtime-specific entrypoint (node.ts or bun.ts).
  // This function is called from index.ts which then imports the correct entrypoint.
};

export default { start, createApp };
