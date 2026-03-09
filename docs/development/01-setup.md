# Development Setup

## Prerequisites

- **Node.js** 22.x or higher
- **npm** 10+
- **[Bun](https://bun.sh)** 1.3+ _(optional — required only for Bun runtime and benchmarking)_
- A Brave Search API key

### Install Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

## Clone & install

```bash
git clone https://github.com/tobiashochguertel/brave-search-mcp-server.git
cd brave-search-mcp-server
npm install
```

## Build

```bash
npm run build      # compile TypeScript → dist/
npm run watch      # watch + rebuild on changes
```

## Run locally (HTTP mode)

```bash
# Node.js entrypoint
BRAVE_API_KEY=... BRAVE_MCP_TRANSPORT=http npm run start:node

# Bun entrypoint (no compile step, hot reload)
BRAVE_API_KEY=... npm run dev:bun

# Auto-detect runtime
BRAVE_API_KEY=... BRAVE_MCP_TRANSPORT=http npm start
```

## Inspect with MCP Inspector

```bash
# Build first
npm run build

# Start inspector (STDIO mode)
npx @modelcontextprotocol/inspector node dist/index.js

# HTTP mode — use inspector UI flag --transport http
npm run inspector:http
```

## Smithery local dev

```bash
npm run smithery:build
npm run smithery:dev
```

## Taskfile

All common tasks are available via [Task](https://taskfile.dev):

```bash
task --list         # show all available tasks
task build          # build TypeScript
task lint           # run Prettier check
task format         # auto-format
task test           # unit tests
task test:e2e       # end-to-end tests (requires API keys)
task docker:build   # build Node.js Docker image
task docker:build:bun  # build Bun Docker image
task bench:report   # run Node.js vs Bun benchmark
```

See [Scripts reference](./03-scripts.md) for the full list.
