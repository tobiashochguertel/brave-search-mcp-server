# Dual Runtime: Node.js + Bun

This server runs on both **Node.js** and **[Bun](https://bun.sh)** using
[Hono](https://hono.dev) as the shared HTTP framework.

All business logic is in shared code; only the thin runtime entrypoints differ.

## Comparison

| | Node.js | Bun |
|---|---|---|
| Entrypoint | `src/entrypoints/node.ts` | `src/entrypoints/bun.ts` |
| HTTP adapter | `@hono/node-server` `serve()` | Native `export default { fetch }` |
| Start script | `npm run start:node` | `npm run start:bun` |
| Dev mode | `npm run dev:node` | `npm run dev:bun` (hot reload) |
| Docker image | `Dockerfile` | `Dockerfile.bun` |
| TypeScript | Requires compile step | Runs `.ts` directly |

## Architecture

```
                    ┌─────────────────────────────────────┐
                    │         Shared business logic        │
                    │  src/protocols/http.ts (Hono app)    │
                    │  src/server.ts (MCP tools)           │
                    │  src/config.ts                       │
                    └───────────────┬─────────────────────┘
                                    │ createApp()
                    ┌───────────────┼─────────────────────┐
                    │               │                     │
         ┌──────────▼──────┐   ┌───▼──────────────┐
         │  entrypoints/   │   │  entrypoints/     │
         │  node.ts        │   │  bun.ts           │
         │                 │   │                   │
         │ @hono/node-     │   │ export default    │
         │ server serve()  │   │ { fetch, port }   │
         └──────────┬──────┘   └───┬───────────────┘
                    │              │
              Node.js HTTP      Bun HTTP
              (port 8080)       (port 8080)
```

## Running locally

```bash
# Node.js (HTTP mode)
BRAVE_API_KEY=... BRAVE_MCP_TRANSPORT=http npm run start:node

# Bun (HTTP mode, hot reload)
BRAVE_API_KEY=... npm run dev:bun

# Auto-detect runtime (via index.ts)
BRAVE_API_KEY=... BRAVE_MCP_TRANSPORT=http npm start
```

## Runtime auto-detection

`src/index.ts` detects the runtime and dynamically imports the correct entrypoint:

```typescript
if ((globalThis as Record<string, unknown>).Bun !== undefined) {
  await import('./entrypoints/bun.js');
} else {
  await import('./entrypoints/node.js');
}
```

## Bun-specific optimisations

The Bun entrypoint uses native Bun HTTP options not available in `@hono/node-server`:

- **`reusePort: true`** — Allows multiple Bun processes to share the same port,
  improving multi-core utilisation
- **`idleTimeout`** — Configurable connection idle timeout
- **Global `crypto.randomUUID()`** — Avoids the `node:crypto` import overhead

For technical details see [`docs/spec/01-dual-runtime-architecture.md`](../spec/01-dual-runtime-architecture.md).

## Benchmark results

See [`bench-results.md`](../../bench-results.md) for the latest results.
See [`docs/runtime/02-benchmarking.md`](./02-benchmarking.md) for benchmark instructions.
