# Testing

## Unit tests

```bash
npm test                 # run unit tests once
npm run test:watch       # watch mode
npm run test:coverage    # with coverage report

# Via Taskfile
task test
task test:watch
task test:coverage
```

Tests live in `src/tests/`. E2e tests are excluded from the default run.

## End-to-end tests

E2e tests make **real API calls** against the Brave Search API. Set the appropriate
environment variables before running:

```bash
export BRAVE_API_KEY=...
export BRAVE_SEARCH_API_KEY=...
export BRAVE_AI_API_KEY=...
export BRAVE_ANSWERS_API_KEY=...
export BRAVE_AUTOSUGGEST_API_KEY=...
export BRAVE_SPELLCHECK_API_KEY=...
```

```bash
npm run test:e2e         # HTTP + stdio transports
npm run test:e2e:http    # HTTP transport only
npm run test:e2e:stdio   # stdio transport only

# Via Taskfile
task test:e2e
task test:e2e:http
task test:e2e:stdio
task test:all            # unit + e2e
```

Tests without a matching API key are automatically skipped (`it.skipIf`).

## Test coverage

The test suite covers:

| Area | Type |
|---|---|
| Tool parameter schemas | Unit |
| Tool list / registration | Unit |
| Config parsing (env + CLI) | Unit |
| HTTP server (ping + initialize) | Integration |
| All 10 tools via HTTP transport | E2e |
| All 10 tools via stdio transport | E2e |

## Running via Claude Desktop

For manual testing, point Claude Desktop at your local build:

```json
{
  "mcpServers": {
    "brave-search-dev": {
      "command": "node",
      "args": ["/path/to/brave-search-mcp-server/dist/index.js"],
      "env": { "BRAVE_API_KEY": "YOUR_KEY_HERE" }
    }
  }
}
```

## Running via Smithery.AI

1. Acquire a [smithery.ai](https://smithery.ai) account and API key
2. Run:
   ```bash
   npm run smithery:build
   npm run smithery:dev
   ```
