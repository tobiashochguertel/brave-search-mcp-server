# Docker

## Images

| Image | Runtime | Dockerfile | Description |
|---|---|---|---|
| `brave-search-mcp-server:node` | Node.js LTS | `Dockerfile` | Standard multi-stage build |
| `brave-search-mcp-server:bun` | Bun | `Dockerfile.bun` | Single-stage, faster startup, ~2× MCP throughput |

## Build

```bash
# Node.js image
docker build -t brave-search-mcp-server:node .

# Bun image
docker build -f Dockerfile.bun -t brave-search-mcp-server:bun .

# Via Taskfile
task docker:build
task docker:build:bun
```

## Run

```bash
# Node.js
docker run -e BRAVE_API_KEY=... -p 8080:8080 brave-search-mcp-server:node

# Bun
docker run -e BRAVE_API_KEY=... -p 8080:8080 brave-search-mcp-server:bun
```

Pass additional API keys with multiple `-e` flags:

```bash
docker run \
  -e BRAVE_API_KEY=... \
  -e BRAVE_SEARCH_API_KEY=... \
  -e BRAVE_ANSWERS_API_KEY=... \
  -p 8080:8080 \
  brave-search-mcp-server:node
```

## Docker Compose (development)

```bash
# Start (HTTP mode, Node.js)
docker-compose up --build

# Stop
docker-compose down

# Logs
docker-compose logs -f
```

## Docker Compose (benchmark — Node.js vs Bun)

```bash
# Start both runtimes on separate ports
docker compose -f docker-compose.benchmark.yml up --build -d
# Node.js → http://localhost:3001
# Bun     → http://localhost:3002

# Run benchmark
task bench:report

# Stop
docker compose -f docker-compose.benchmark.yml down
```

## Runtime auto-detection

The default `Dockerfile` (Node.js) starts `dist/index.js`, which auto-detects the runtime:
- **Node.js**: imports `src/entrypoints/node.ts`
- **Bun**: imports `src/entrypoints/bun.ts`

`Dockerfile.bun` invokes `bun src/entrypoints/bun.ts` directly (no TypeScript compile step needed).

## Lint Dockerfiles

```bash
task docker:lint  # runs hadolint on both Dockerfiles
```
