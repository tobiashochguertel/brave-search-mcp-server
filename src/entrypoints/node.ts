import { serve } from '@hono/node-server';
import { createApp } from '../protocols/http.js';
import config from '../config.js';

const app = createApp();

serve({ fetch: app.fetch, port: config.port, hostname: config.host }, () => {
  console.log(`[Node.js] Server is running on http://${config.host}:${config.port}/mcp`);
});
