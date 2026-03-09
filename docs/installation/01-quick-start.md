# Quick Start

## 1. Get an API Key

Sign up at [brave.com/search/api/](https://brave.com/search/api/) and create an API key
from the [developer dashboard](https://api-dashboard.search.brave.com/app/keys).

```bash
export BRAVE_API_KEY=BSA...
```

For full feature coverage (autosuggest, spellcheck, AI answers) see
[API Keys](../configuration/01-api-keys.md).

## 2. Choose how to run

### Smithery (one command)

```bash
npx -y @smithery/cli install brave
```

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`
(macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

**Via NPX (stdio — recommended):**
```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@brave/brave-search-mcp-server"],
      "env": { "BRAVE_API_KEY": "YOUR_KEY_HERE" }
    }
  }
}
```

**Via Docker:**
```json
{
  "mcpServers": {
    "brave-search": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "BRAVE_API_KEY", "docker.io/mcp/brave-search"],
      "env": { "BRAVE_API_KEY": "YOUR_KEY_HERE" }
    }
  }
}
```

### VS Code

Use the one-click install buttons in the [repository README](../../README.md), or add manually
to your User Settings (JSON) or `.vscode/mcp.json` — see [VS Code](./03-vscode.md).

### Local (HTTP mode)

```bash
npm install
npm run build
BRAVE_API_KEY=... BRAVE_MCP_TRANSPORT=http npm run start:node
# Server listening at http://localhost:8080/mcp
```

### Docker (local build)

```bash
docker build -t brave-search-mcp-server:node .
docker run -e BRAVE_API_KEY=... -p 8080:8080 brave-search-mcp-server:node
```
