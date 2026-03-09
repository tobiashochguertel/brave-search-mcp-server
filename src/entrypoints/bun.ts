import { createApp } from '../protocols/http.js';
import config from '../config.js';

const app = createApp();

console.log(`[Bun] Server is running on http://${config.host}:${config.port}/mcp`);

export default {
  port: config.port,
  hostname: config.host,
  fetch: app.fetch,
};
