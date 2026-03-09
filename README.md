# Brave Search MCP Server (Community Fork)

> **This is a community fork** of the [official Brave Search MCP Server](https://github.com/brave/brave-search-mcp-server) by Brave Software.
> It extends the original with **full coverage of all Brave Search API endpoints**:
> autosuggest, spellcheck, LLM context grounding, and AI answers (including streaming for citations and entities).
> A custom `BRAVE_API_BASE_URL` setting lets you route all traffic through a caching proxy (e.g. [brave-search-cli](https://github.com/tobiashochguertel/dotfiles)).
> **Dual-runtime support**: runs on both Node.js and [Bun](https://bun.sh) — Bun delivers ~2× higher throughput and ~5× faster startup.
>
> Fork maintained by [@tobiashochguertel](https://github.com/tobiashochguertel).

An MCP server implementation that integrates the Brave Search API, providing comprehensive search capabilities including web search, local business search, image search, video search, news search, AI-powered summarization, autosuggest, spellcheck, LLM context grounding, and AI answers. This project supports both STDIO and HTTP transports, with STDIO as the default mode.

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/tobiashochguertel/brave-search-mcp-server)

## Migration

### 1.x to 2.x

#### Default transport now STDIO

To follow established MCP conventions, the server now defaults to STDIO. If you would like to continue using HTTP, you will need to set the `BRAVE_MCP_TRANSPORT` environment variable to `http`, or provide the runtime argument `--transport http` when launching the server.

#### Response structure of `brave_image_search`

Version 1.x of the MCP server would return base64-encoded image data along with image URLs. This dramatically slowed down the response, as well as consumed unnecessarily context in the session. Version 2.x removes the base64-encoded data, and returns a response object that more closely reflects the original Brave Search API response. The updated output schema is defined in [`src/tools/images/schemas/output.ts`](https://github.com/brave/brave-search-mcp-server/blob/main/src/tools/images/schemas/output.ts).

## Tools

### Web Search (`brave_web_search`)
Performs comprehensive web searches with rich result types and advanced filtering options.

**Parameters:**
- `query` (string, required): Search terms (max 400 chars, 50 words)
- `country` (string, optional): Country code (default: "US")
- `search_lang` (string, optional): Search language (default: "en")
- `ui_lang` (string, optional): UI language (default: "en-US")
- `count` (number, optional): Results per page (1-20, default: 10)
- `offset` (number, optional): Pagination offset (max 9, default: 0)
- `safesearch` (string, optional): Content filtering ("off", "moderate", "strict", default: "moderate")
- `freshness` (string, optional): Time filter ("pd", "pw", "pm", "py", or date range)
- `text_decorations` (boolean, optional): Include highlighting markers (default: true)
- `spellcheck` (boolean, optional): Enable spell checking (default: true)
- `result_filter` (array, optional): Filter result types (default: ["web", "query"])
- `goggles` (array, optional): Custom re-ranking definitions
- `units` (string, optional): Measurement units ("metric" or "imperial")
- `extra_snippets` (boolean, optional): Get additional excerpts (Pro plans only)
- `summary` (boolean, optional): Enable summary key generation for AI summarization

### Local Search (`brave_local_search`)
Searches for local businesses and places with detailed information including ratings, hours, and AI-generated descriptions.

**Parameters:**
- Same as `brave_web_search` with automatic location filtering
- Automatically includes "web" and "locations" in result_filter

**Note:** Requires Pro plan for full local search capabilities. Falls back to web search otherwise.

### Video Search (`brave_video_search`)
Searches for videos with comprehensive metadata and thumbnail information.

**Parameters:**
- `query` (string, required): Search terms (max 400 chars, 50 words)
- `country` (string, optional): Country code (default: "US")
- `search_lang` (string, optional): Search language (default: "en")
- `ui_lang` (string, optional): UI language (default: "en-US")
- `count` (number, optional): Results per page (1-50, default: 20)
- `offset` (number, optional): Pagination offset (max 9, default: 0)
- `spellcheck` (boolean, optional): Enable spell checking (default: true)
- `safesearch` (string, optional): Content filtering ("off", "moderate", "strict", default: "moderate")
- `freshness` (string, optional): Time filter ("pd", "pw", "pm", "py", or date range)

### Image Search (`brave_image_search`)
Searches for images with automatic fetching and base64 encoding for direct display.

**Parameters:**
- `query` (string, required): Search terms (max 400 chars, 50 words)
- `country` (string, optional): Country code (default: "US")
- `search_lang` (string, optional): Search language (default: "en")
- `count` (number, optional): Results per page (1-200, default: 50)
- `safesearch` (string, optional): Content filtering ("off", "strict", default: "strict")
- `spellcheck` (boolean, optional): Enable spell checking (default: true)

### News Search (`brave_news_search`)
Searches for current news articles with freshness controls and breaking news indicators.

**Parameters:**
- `query` (string, required): Search terms (max 400 chars, 50 words)
- `country` (string, optional): Country code (default: "US")
- `search_lang` (string, optional): Search language (default: "en")
- `ui_lang` (string, optional): UI language (default: "en-US")
- `count` (number, optional): Results per page (1-50, default: 20)
- `offset` (number, optional): Pagination offset (max 9, default: 0)
- `spellcheck` (boolean, optional): Enable spell checking (default: true)
- `safesearch` (string, optional): Content filtering ("off", "moderate", "strict", default: "moderate")
- `freshness` (string, optional): Time filter (default: "pd" for last 24 hours)
- `extra_snippets` (boolean, optional): Get additional excerpts (Pro plans only)
- `goggles` (array, optional): Custom re-ranking definitions

### Summarizer Search (`brave_summarizer`)
Generates AI-powered summaries from web search results using Brave's summarization API.

**Parameters:**
- `key` (string, required): Summary key from web search results (use `summary: true` in web search)
- `entity_info` (boolean, optional): Include entity information (default: false)
- `inline_references` (boolean, optional): Add source URL references (default: false)

**Usage:** First perform a web search with `summary: true`, then use the returned summary key with this tool.

### Autosuggest (`brave_autosuggest`)
Returns query completion suggestions as-you-type, powered by Brave's autosuggest API.

**Parameters:**
- `query` (string, required): Partial query text to complete (max 400 chars)
- `country` (string, optional): Country code (default: "US")
- `lang` (string, optional): Language code (default: "en")
- `count` (number, optional): Number of suggestions (1-20, default: 10)

**Requires:** `BRAVE_AUTOSUGGEST_API_KEY`

### Spellcheck (`brave_spellcheck`)
Checks spelling and suggests corrections using Brave's spellcheck API.

**Parameters:**
- `query` (string, required): Text to spell-check (max 400 chars)
- `country` (string, optional): Country/locale code (default: "US")
- `lang` (string, optional): Language code (default: "en")

**Returns:** Corrected text and individual token corrections (empty array if all correct).

**Requires:** `BRAVE_SPELLCHECK_API_KEY`

### LLM Context (`brave_llm_context`)
Retrieves pre-extracted, relevance-scored web content optimised for grounding LLM responses in real-time search results.

**Parameters:**
- `query` (string, required): Query to retrieve grounding context for (max 400 chars)
- `country` (string, optional): Country code (default: "US")
- `search_lang` (string, optional): Search language (default: "en")
- `count` (number, optional): Number of results (1-20, default: 10)

**Returns:** Structured context sections (title, URL, snippets) ready to paste into an LLM prompt.

**Requires:** `BRAVE_SEARCH_API_KEY` (falls back to `BRAVE_API_KEY`)

### AI Answers (`brave_answers`)
Provides AI-generated answers backed by real-time web search using Brave's OpenAI-compatible chat completions API.

**Parameters:**
- `query` (string, required): The question or prompt to answer (max 2000 chars)
- `country` (string, optional): 2-letter country code for localised search context (default: "us")
- `language` (string, optional): Language code for the response (default: "en")
- `enable_research` (boolean, optional): Multi-search research mode — thorough but slower and higher cost (default: false)
- `enable_citations` (boolean, optional): Include inline source citations in the answer. Streaming is handled internally — the MCP tool returns a complete response (default: false)
- `enable_entities` (boolean, optional): Include structured entity data in the answer. Also uses internal streaming (default: false)

**Note on streaming:** `enable_citations` and `enable_entities` require the Brave API to use `stream: true`.
This fork handles that transparently: the server consumes the SSE stream and assembles a complete response
before returning it to the MCP client — no MCP-level streaming required.

**Requires:** `BRAVE_ANSWERS_API_KEY`

## Configuration

### Getting an API Key

1. Sign up for a [Brave Search API account](https://brave.com/search/api/)
2. Choose a plan:
   - **Free**: 2,000 queries/month, basic web search
   - **Pro**: Enhanced features including local search, AI summaries, extra snippets
3. Generate your API key from the [developer dashboard](https://api-dashboard.search.brave.com/app/keys)

### Environment Variables

The server supports the following environment variables:

**API Keys** — Brave Search uses separate subscription plans, each with its own key:

| Variable | Plan | Endpoints covered |
|---|---|---|
| `BRAVE_API_KEY` | Default/fallback (Free Search) | All endpoints (fallback when no specific key is set) |
| `BRAVE_SEARCH_API_KEY` | Search plan | web, news, images, videos, local POIs, llm-context |
| `BRAVE_AI_API_KEY` | Free AI plan | summarizer (free tier) |
| `BRAVE_PRO_AI_API_KEY` | Pro AI plan | summarizer (deprecated plan, still functional) |
| `BRAVE_ANSWERS_API_KEY` | Answers plan | brave_answers (AI chat completions) |
| `BRAVE_AUTOSUGGEST_API_KEY` | Autosuggest plan | suggest |
| `BRAVE_SPELLCHECK_API_KEY` | Spellcheck plan | spellcheck |

At minimum, set `BRAVE_API_KEY`. If you have subscription-specific keys, set those too — they take priority over the fallback key for their respective endpoints. Get API keys at [api-dashboard.search.brave.com](https://api-dashboard.search.brave.com/app/keys).

**Other settings:**

- `BRAVE_API_BASE_URL`: Override the Brave Search API base URL (default: `https://api.search.brave.com`). Point to a local caching proxy to reduce API costs.
- `BRAVE_MCP_TRANSPORT`: Transport mode ("http" or "stdio", default: "stdio")
- `BRAVE_MCP_PORT`: HTTP server port (default: 8000)
- `BRAVE_MCP_HOST`: HTTP server host (default: "0.0.0.0")
- `BRAVE_MCP_LOG_LEVEL`: Desired logging level("debug", "info", "notice", "warning", "error", "critical", "alert", or "emergency", default: "info")
- `BRAVE_MCP_ENABLED_TOOLS`: When used, specifies a whitelist for supported tools
- `BRAVE_MCP_DISABLED_TOOLS`: When used, specifies a blacklist for supported tools
- `BRAVE_MCP_STATELESS`: HTTP stateless mode (default: "true").  When running on Amazon Bedrock Agentcore, set to "true".

### Command Line Options

```bash
node dist/index.js [options]

Options:
  --brave-api-key <string>    Brave API key
  --transport <stdio|http>    Transport type (default: stdio)
  --port <number>             HTTP server port (default: 8080)
  --host <string>             HTTP server host (default: 0.0.0.0)
  --logging-level <string>    Desired logging level (one of _debug_, _info_, _notice_, _warning_, _error_, _critical_, _alert_, or _emergency_)
  --enabled-tools             Tools whitelist (only the specified tools will be enabled)
  --disabled-tools            Tools blacklist (included tools will be disabled)
  --stateless  <boolean>      HTTP Stateless flag
```

## Installation

### Installing via Smithery

To install Brave Search automatically via [Smithery](https://smithery.ai/server/brave):

```bash
npx -y @smithery/cli install brave
```

### Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

#### Docker

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "BRAVE_API_KEY", "docker.io/mcp/brave-search"],
      "env": {
        "BRAVE_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

#### NPX

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@brave/brave-search-mcp-server", "--transport", "http"],
      "env": {
        "BRAVE_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

### Usage with VS Code

For quick installation, use the one-click installation buttons below:

[![Install with NPX in VS Code](https://img.shields.io/badge/VS_Code-NPM-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=brave-search&inputs=%5B%7B%22password%22%3Atrue%2C%22id%22%3A%22brave-api-key%22%2C%22type%22%3A%22promptString%22%2C%22description%22%3A%22Brave+Search+API+Key%22%7D%5D&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40brave%2Fbrave-search-mcp-server%22%2C%22--transport%22%2C%22stdio%22%5D%2C%22env%22%3A%7B%22BRAVE_API_KEY%22%3A%22%24%7Binput%3Abrave-api-key%7D%22%7D%7D) [![Install with NPX in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-NPM-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=brave-search&inputs=%5B%7B%22password%22%3Atrue%2C%22id%22%3A%22brave-api-key%22%2C%22type%22%3A%22promptString%22%2C%22description%22%3A%22Brave+Search+API+Key%22%7D%5D&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40brave%2Fbrave-search-mcp-server%22%2C%22--transport%22%2C%22stdio%22%5D%2C%22env%22%3A%7B%22BRAVE_API_KEY%22%3A%22%24%7Binput%3Abrave-api-key%7D%22%7D%7D&quality=insiders)  
[![Install with Docker in VS Code](https://img.shields.io/badge/VS_Code-Docker-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=brave-search&inputs=%5B%7B%22password%22%3Atrue%2C%22id%22%3A%22brave-api-key%22%2C%22type%22%3A%22promptString%22%2C%22description%22%3A%22Brave+Search+API+Key%22%7D%5D&config=%7B%22command%22%3A%22docker%22%2C%22args%22%3A%5B%22run%22%2C%22-i%22%2C%22--rm%22%2C%22-e%22%2C%22BRAVE_API_KEY%22%2C%22mcp%2Fbrave-search%22%5D%2C%22env%22%3A%7B%22BRAVE_API_KEY%22%3A%22%24%7Binput%3Abrave-api-key%7D%22%7D%7D) [![Install with Docker in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Docker-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=brave-search&inputs=%5B%7B%22password%22%3Atrue%2C%22id%22%3A%22brave-api-key%22%2C%22type%22%3A%22promptString%22%2C%22description%22%3A%22Brave+Search+API+Key%22%7D%5D&config=%7B%22command%22%3A%22docker%22%2C%22args%22%3A%5B%22run%22%2C%22-i%22%2C%22--rm%22%2C%22-e%22%2C%22BRAVE_API_KEY%22%2C%22mcp%2Fbrave-search%22%5D%2C%22env%22%3A%7B%22BRAVE_API_KEY%22%3A%22%24%7Binput%3Abrave-api-key%7D%22%7D%7D&quality=insiders)

For manual installation, add the following to your User Settings (JSON) or `.vscode/mcp.json`:

#### Docker

```json
{
  "inputs": [
    {
      "password": true,
      "id": "brave-api-key",
      "type": "promptString",
      "description": "Brave Search API Key",
    }
  ],
  "servers": {
    "brave-search": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "BRAVE_API_KEY", "mcp/brave-search"],
      "env": {
        "BRAVE_API_KEY": "${input:brave-api-key}"
      }
    }
  }
}
```

#### NPX

```json
{
  "inputs": [
    {
      "password": true,
      "id": "brave-api-key",
      "type": "promptString",
      "description": "Brave Search API Key",
    }
  ],
  "servers": {
    "brave-search-mcp-server": {
      "command": "npx",
      "args": ["-y", "@brave/brave-search-mcp-server", "--transport", "stdio"],
      "env": {
        "BRAVE_API_KEY": "${input:brave-api-key}"
      }
    }
  }
}
```

## Build

### Docker

**Node.js image (default):**
```bash
docker build -t brave-search-mcp-server:node .
# or via Taskfile:
task docker:build
```

**Bun image (high-performance):**
```bash
docker build -f Dockerfile.bun -t brave-search-mcp-server:bun .
# or via Taskfile:
task docker:build:bun
```

### Local Build

```bash
npm install
npm run build
```

## Dual Runtime: Node.js + Bun

This server supports both **Node.js** and **[Bun](https://bun.sh)** runtimes via [Hono](https://hono.dev) as the shared HTTP framework. All business logic lives in shared code; only the thin entrypoints differ.

| | Node.js | Bun |
|---|---|---|
| Entrypoint | `src/entrypoints/node.ts` | `src/entrypoints/bun.ts` |
| Start script | `npm run start:node` | `npm run start:bun` |
| Dev (hot reload) | `npm run dev:node` | `npm run dev:bun` |
| Docker image | `Dockerfile` | `Dockerfile.bun` |
| Default port | 3001 (benchmark) | 3002 (benchmark) |

### Running locally

```bash
# Node.js (HTTP mode)
BRAVE_API_KEY=... npm run start:node

# Bun (HTTP mode, hot reload)
BRAVE_API_KEY=... npm run dev:bun

# Default entrypoint (auto-detects runtime)
BRAVE_MCP_TRANSPORT=http BRAVE_API_KEY=... npm start
```

### Docker Compose for benchmarking

Both runtimes side-by-side with equal CPU/memory limits:

```bash
# Start
docker compose -f docker-compose.benchmark.yml up --build -d
# Node.js → http://localhost:3001
# Bun     → http://localhost:3002

# Stop
docker compose -f docker-compose.benchmark.yml down
```

### Benchmarking

Run a full comparison benchmark using the included `scripts/benchmark.ts`:

```bash
# Start both servers (Docker)
task bench:start

# Generate report (bench-results.md)
task bench:report

# Stop
task bench:stop

# Or — all in one:
task bench:docker:full
```

For local (non-Docker) benchmarks:
```bash
task bench:local:full
```

Customize via environment variables:
```bash
NODE_URL=http://localhost:3001 BUN_URL=http://localhost:3002 \
  BENCH_DURATION=30 BENCH_CONNECTIONS=200 \
  task bench:report
```


## Development

### Prerequisites

- Node.js 22.x or higher (for Node.js runtime)
- [Bun](https://bun.sh) 1.3+ (optional, for Bun runtime)
- npm
- Brave Search API key



1. Clone the repository:
```bash
git clone https://github.com/tobiashochguertel/brave-search-mcp-server.git
cd brave-search-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

### Testing via Claude Desktop

Add a reference to your local build in `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "brave-search-dev": {
      "command": "node",
      "args": ["C:\\GitHub\\brave-search-mcp-server\\dist\\index.js"], // Verify your path
      "env": {
        "BRAVE_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

### Testing via MCP Inspector

1. Build and start the server:
```bash
npm run build
node dist/index.js
```

2. In another terminal, start the MCP Inspector:
```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

STDIO is the default mode. For HTTP mode testing, add `--transport http` to the arguments in the Inspector UI.

### Testing via Smithery.AI

1. Establish and acquire a smithery.ai account and API key
2. Run `npm run install`, `npm run smithery:build`, and lastly `npm run smithery:dev` to begin testing

### Available Scripts

**Build:**
- `npm run build`: Compile TypeScript → `dist/`
- `npm run watch`: Watch + rebuild on changes

**Run (Node.js):**
- `npm run start:node`: Start HTTP server with Node.js entrypoint
- `npm run dev:node`: Dev mode with ts-node (Node.js)

**Run (Bun):**
- `npm run start:bun`: Start HTTP server with Bun (TypeScript, no compile step)
- `npm run dev:bun`: Dev mode with Bun hot reload

**Run (auto-detect):**
- `npm start`: Start in stdio mode (default); set `BRAVE_MCP_TRANSPORT=http` for HTTP

**Format & lint:**
- `npm run format`: Format code with Prettier
- `npm run format:check`: Check formatting
- `npm run prepare`: Format + build (auto on `npm install`)

**Test:**
- `npm run test`: Unit tests (excludes e2e)
- `npm run test:e2e`: All e2e tests (HTTP + stdio, requires API keys)
- `npm run test:e2e:http`: HTTP transport e2e only
- `npm run test:e2e:stdio`: stdio transport e2e only
- `npm run test:all`: Unit + e2e tests
- `npm run test:coverage`: Unit tests with coverage report
- `npm run test:watch`: Unit tests in watch mode

**Tools:**
- `npm run inspector`: Launch MCP Inspector
- `npm run inspector:http`: Launch MCP Inspector (HTTP mode)
- `npm run smithery:build`: Build for Smithery.ai
- `npm run smithery:dev`: Dev mode for Smithery.ai

### Docker Compose

For local development with Docker:

```bash
docker-compose up --build
```

## Testing

Run the test suite:

```bash
task test           # run unit tests once
task test:watch     # watch mode
task test:coverage  # with coverage report
task test:e2e       # e2e tests (HTTP + stdio, requires API keys in env)
task test:e2e:http  # e2e HTTP transport only
task test:e2e:stdio # e2e stdio transport only (builds first)
task test:all       # unit + e2e together
```

Or directly via npm:

```bash
npm test
npm run test:e2e
npm run test:coverage
```

### E2e Tests

The e2e tests make real API calls. Set the appropriate environment variables before running:

```bash
export BRAVE_API_KEY=...
export BRAVE_SEARCH_API_KEY=...
export BRAVE_AI_API_KEY=...
export BRAVE_ANSWERS_API_KEY=...
export BRAVE_AUTOSUGGEST_API_KEY=...
export BRAVE_SPELLCHECK_API_KEY=...
npm run test:e2e
```

Tests without a matching API key are automatically skipped (`it.skipIf`).

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.
