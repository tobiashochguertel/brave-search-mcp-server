import config, { getOptions } from '../config.js';
import { createApp } from '../protocols/http.js';

// Parse CLI args + env vars into config state
const opts = getOptions();
if (!opts) {
  process.exit(1);
}

const app = createApp();

console.log(`[Bun] Server is running on http://${config.host}:${config.port}/mcp`);

export default {
  port: config.port,
  hostname: config.host,
  fetch: app.fetch,
  reusePort: true,
  idleTimeout: 30,
};
