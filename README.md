# Brave Search MCP Server (Community Fork)

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/tobiashochguertel/brave-search-mcp-server)
[![smithery badge](https://smithery.ai/badge/@tobiashochguertel/brave-search-mcp-server)](https://smithery.ai/server/@tobiashochguertel/brave-search-mcp-server)

> **Community fork** of the [official Brave Search MCP Server](https://github.com/brave/brave-search-mcp-server) by Brave Software,
> maintained by [@tobiashochguertel](https://github.com/tobiashochguertel).
>
> **What's new in this fork:**
> - ✅ Full coverage of all Brave Search API endpoints (autosuggest, spellcheck, LLM context, AI answers)
> - ✅ Dual-runtime: runs on both **Node.js** and **[Bun](https://bun.sh)** (Bun ~2× faster MCP throughput)
> - ✅ `BRAVE_API_BASE_URL` — route traffic through a local caching proxy (e.g. [brave-search-cli](https://github.com/tobiashochguertel/dotfiles))
> - ✅ Per-endpoint API key support (different subscriptions for different tools)

## Quick start

```bash
export BRAVE_API_KEY=YOUR_KEY_HERE
npx -y @brave/brave-search-mcp-server
```

Or install via Smithery:

```bash
npx -y @smithery/cli install brave
```

## Tools

| Tool | Description | Required subscription |
|---|---|---|
| `brave_web_search` | Web search with rich snippets | Data (free tier) |
| `brave_local_search` | Local businesses, places, ratings | Pro AI |
| `brave_news_search` | Recent news articles | Data (free tier) |
| `brave_video_search` | Video results with metadata | Data (free tier) |
| `brave_image_search` | Image search | Data (free tier) |
| `brave_summarizer` | AI-generated result summaries | AI (paid) |
| `brave_autosuggest` | Search query suggestions | Autosuggest (paid) |
| `brave_spellcheck` | Query spell-checking | Spellcheck (paid) |
| `brave_llm_context` | Search grounding for LLMs | AI (paid) |
| `brave_answers` | Streaming AI answers with citations | Answers (paid) |

→ Full parameter documentation: [docs/tools/](docs/tools/01-overview.md)

## Install in Claude Desktop / VS Code

→ [Quick start guide](docs/installation/01-quick-start.md)  
→ [Claude Desktop](docs/installation/02-claude-desktop.md)  
→ [VS Code](docs/installation/03-vscode.md)  
→ [Docker](docs/installation/04-docker.md)

## Documentation

| Topic | Links |
|---|---|
| **API Keys** | [Configuration](docs/configuration/01-api-keys.md) · [Env vars](docs/configuration/02-env-variables.md) · [CLI options](docs/configuration/03-cli-options.md) |
| **Tools** | [Overview](docs/tools/01-overview.md) · [All 10 tools](docs/tools/) |
| **Runtime** | [Node.js vs Bun](docs/runtime/01-dual-runtime.md) · [Benchmarking](docs/runtime/02-benchmarking.md) |
| **Development** | [Setup](docs/development/01-setup.md) · [Testing](docs/development/02-testing.md) · [Scripts](docs/development/03-scripts.md) |
| **Migration** | [1.x → 2.x](docs/migration/01-upgrade-guide.md) |
| **Architecture** | [Dual runtime](docs/spec/01-dual-runtime-architecture.md) · [Transport](docs/spec/02-transport-layer.md) · [Benchmarks](docs/spec/03-benchmarking.md) |

## API keys

| Env var | Used for |
|---|---|
| `BRAVE_API_KEY` | Fallback for all tools |
| `BRAVE_SEARCH_API_KEY` | Web, news, video, image, local search |
| `BRAVE_AI_API_KEY` | Summarizer, LLM context |
| `BRAVE_ANSWERS_API_KEY` | AI answers |
| `BRAVE_AUTOSUGGEST_API_KEY` | Autosuggest |
| `BRAVE_SPELLCHECK_API_KEY` | Spellcheck |

Keys are resolved in priority order: specific → `BRAVE_SEARCH_API_KEY` / `BRAVE_AI_API_KEY` → `BRAVE_API_KEY`.

→ [Full API key documentation](docs/configuration/01-api-keys.md)

## License

MIT — see [LICENSE](LICENSE).
