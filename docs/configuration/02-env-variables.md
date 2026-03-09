# Environment Variables

Full reference for all environment variables supported by the MCP server.

## API Keys

See [01-api-keys.md](./01-api-keys.md) for the complete API key reference.

## Server Behaviour

| Variable | Default | Description |
|---|---|---|
| `BRAVE_MCP_TRANSPORT` | `stdio` | Transport mode: `stdio` or `http` |
| `BRAVE_MCP_PORT` | `8080` | HTTP server port (only used with `http` transport) |
| `BRAVE_MCP_HOST` | `0.0.0.0` | HTTP server bind address |
| `BRAVE_MCP_LOG_LEVEL` | `info` | Logging level: `debug`, `info`, `notice`, `warning`, `error`, `critical`, `alert`, `emergency` |
| `BRAVE_MCP_STATELESS` | `false` | HTTP stateless mode. Set to `true` on Amazon Bedrock AgentCore |
| `BRAVE_MCP_ENABLED_TOOLS` | _(all)_ | Space-separated whitelist of tool names to enable |
| `BRAVE_MCP_DISABLED_TOOLS` | _(none)_ | Space-separated blacklist of tool names to disable |

## API Behaviour

| Variable | Default | Description |
|---|---|---|
| `BRAVE_API_BASE_URL` | `https://api.search.brave.com` | Override the Brave Search API base URL. Point to a local caching proxy to reduce API costs. |

## Example: `.env` file

```dotenv
# Required
BRAVE_API_KEY=BSA...

# Optional subscription-specific keys
BRAVE_SEARCH_API_KEY=BSA...
BRAVE_AI_API_KEY=BSA...
BRAVE_ANSWERS_API_KEY=BSA...
BRAVE_AUTOSUGGEST_API_KEY=BSA...
BRAVE_SPELLCHECK_API_KEY=BSA...

# Server mode (uncomment to run in HTTP mode)
# BRAVE_MCP_TRANSPORT=http
# BRAVE_MCP_PORT=8080
# BRAVE_MCP_HOST=0.0.0.0

# Logging
BRAVE_MCP_LOG_LEVEL=info

# Tool filtering (space-separated)
# BRAVE_MCP_DISABLED_TOOLS=brave_image_search brave_video_search

# Custom API base URL (for caching proxy)
# BRAVE_API_BASE_URL=http://localhost:8888
```
