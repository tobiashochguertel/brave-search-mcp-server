# Claude Desktop Integration

## Configuration file location

| Platform | Path |
|---|---|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

## Via NPX (STDIO — recommended)

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@brave/brave-search-mcp-server"],
      "env": {
        "BRAVE_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

## Via Docker

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

## Local dev build

```json
{
  "mcpServers": {
    "brave-search-dev": {
      "command": "node",
      "args": ["/path/to/brave-search-mcp-server/dist/index.js"],
      "env": {
        "BRAVE_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

## Multiple API keys

Pass all subscription-specific keys for full feature access:

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@brave/brave-search-mcp-server"],
      "env": {
        "BRAVE_API_KEY": "BSA...",
        "BRAVE_SEARCH_API_KEY": "BSA...",
        "BRAVE_AI_API_KEY": "BSA...",
        "BRAVE_ANSWERS_API_KEY": "BSA...",
        "BRAVE_AUTOSUGGEST_API_KEY": "BSA...",
        "BRAVE_SPELLCHECK_API_KEY": "BSA..."
      }
    }
  }
}
```
