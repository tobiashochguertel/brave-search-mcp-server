# Benchmarking

Compare Node.js vs Bun performance using the included `scripts/benchmark.ts`.

## Quick benchmark (local, no Docker)

```bash
# Terminal 1 — start Node.js server
BRAVE_API_KEY=... BRAVE_MCP_TRANSPORT=http BRAVE_MCP_PORT=3001 node dist/entrypoints/node.js

# Terminal 2 — start Bun server
BRAVE_API_KEY=... BRAVE_MCP_TRANSPORT=http BRAVE_MCP_PORT=3002 bun src/entrypoints/bun.ts

# Terminal 3 — run benchmark
task bench:report
```

## All-in-one (local)

```bash
npm run build          # compile first
task bench:local:full  # start both servers + benchmark + stop
```

## Docker benchmark

```bash
task bench:docker:full
# builds both images, starts compose, runs benchmark, stops
```

## Benchmark script options

| Env var | Default | Description |
|---|---|---|
| `NODE_URL` | `http://localhost:3001` | Node.js server URL |
| `BUN_URL` | `http://localhost:3002` | Bun server URL |
| `BENCH_DURATION` | `20` | Duration per scenario in seconds |
| `BENCH_CONNECTIONS` | `100` | Concurrent connections |
| `BENCH_PIPELINING` | `10` | HTTP pipelining factor |
| `BENCH_OUTPUT` | `bench-results.md` | Output file path |

```bash
NODE_URL=http://localhost:3001 BUN_URL=http://localhost:3002 \
  BENCH_DURATION=30 BENCH_CONNECTIONS=200 \
  task bench:report
```

## Scenarios

| Scenario | Endpoint | Connections | Pipelining | What it measures |
|---|---|---|---|---|
| Raw HTTP throughput | `GET /ping` | 100 | 10 | HTTP layer overhead, Hono middleware |
| MCP protocol latency | `POST /mcp` (initialize) | 10 | 1 | JSON parsing, session management, MCP handshake |

## Interpreting results

- **req/s** — requests processed per second (higher is better)
- **p50 latency** — median response time
- **p99 latency** — tail latency (important for real-world feel)
- **Bun speedup** — Bun req/s ÷ Node.js req/s

> Results vary by machine, load, and available CPU cores.
> For a fair comparison, use `docker-compose.benchmark.yml` which applies equal
> CPU and memory resource limits to both containers.

## Latest results

See [`bench-results.md`](../../bench-results.md) in the project root.

## Architecture context

See [`docs/spec/03-benchmarking.md`](../spec/03-benchmarking.md) for the benchmark design spec.
