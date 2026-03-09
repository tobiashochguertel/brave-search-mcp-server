# Command-Line Options

All configuration can also be passed as CLI arguments when launching the server directly.
CLI arguments take precedence over environment variables.

## Usage

```bash
node dist/index.js [options]
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `--brave-api-key` | string | `$BRAVE_API_KEY` | Default / fallback Brave API key |
| `--brave-search-api-key` | string | `$BRAVE_SEARCH_API_KEY` | Search plan key |
| `--brave-ai-api-key` | string | `$BRAVE_AI_API_KEY` | Free AI plan key |
| `--brave-pro-ai-api-key` | string | `$BRAVE_PRO_AI_API_KEY` | Pro AI plan key |
| `--brave-answers-api-key` | string | `$BRAVE_ANSWERS_API_KEY` | Answers plan key |
| `--brave-autosuggest-api-key` | string | `$BRAVE_AUTOSUGGEST_API_KEY` | Autosuggest plan key |
| `--brave-spellcheck-api-key` | string | `$BRAVE_SPELLCHECK_API_KEY` | Spellcheck plan key |
| `--transport` | `stdio`\|`http` | `stdio` | Transport type |
| `--port` | number | `8080` | HTTP server port |
| `--host` | string | `0.0.0.0` | HTTP server host |
| `--logging-level` | string | `info` | Log level |
| `--enabled-tools` | name... | _(all)_ | Whitelist of tool names to enable |
| `--disabled-tools` | name... | _(none)_ | Blacklist of tool names to disable |
| `--stateless` | boolean | `false` | Enable stateless HTTP mode |
| `--brave-api-base-url` | string | `https://api.search.brave.com` | Override API base URL |

## Examples

```bash
# HTTP mode on port 9000
node dist/index.js --transport http --port 9000 --brave-api-key BSA...

# Disable image and video search tools
node dist/index.js --disabled-tools brave_image_search brave_video_search

# Stateless mode (for serverless / Amazon Bedrock)
node dist/index.js --transport http --stateless true

# Point to a caching proxy
node dist/index.js --brave-api-base-url http://localhost:8888
```
