#!/usr/bin/env node
import { getOptions } from './config.js';
import { stdioServer } from './protocols/index.js';

async function main() {
  const options = getOptions();

  if (!options) {
    console.error('Invalid configuration');
    process.exit(1);
  }

  // default to stdio server unless http is explicitly requested
  if (options.transport === 'http') {
    // Delegate to the runtime-specific entrypoint for HTTP.
    // Bun exposes globalThis.Bun; Node.js does not.
    if ((globalThis as Record<string, unknown>).Bun !== undefined) {
      await import('./entrypoints/bun.js');
    } else {
      await import('./entrypoints/node.js');
    }
    return;
  }

  await stdioServer.start();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
