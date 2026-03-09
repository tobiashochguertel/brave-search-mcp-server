import { serve } from '@hono/node-server';
import config, { getOptions } from '../config.js';
import { createApp } from '../protocols/http.js';

// Parse CLI args + env vars into config state
const opts = getOptions();
if (!opts) {
  process.exit(1);
}

const app = createApp();

serve({ fetch: app.fetch, port: config.port, hostname: config.host }, () => {
  console.log(`[Node.js] Server is running on http://${config.host}:${config.port}/mcp`);
});
