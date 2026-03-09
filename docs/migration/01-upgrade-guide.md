# Migration Guide

## 1.x → 2.x

### Default transport changed to STDIO

Version 2.x defaults to STDIO transport to follow MCP conventions.

**Action required** if you were relying on HTTP as the default:

```bash
# Set env var
BRAVE_MCP_TRANSPORT=http

# Or pass CLI argument
node dist/index.js --transport http
```

### `brave_image_search` response structure changed

Version 1.x returned base64-encoded image data alongside URLs, which:
- Dramatically slowed responses
- Consumed unnecessary context window space

Version 2.x returns only URLs and metadata, matching the Brave Search API
response structure. The updated output schema is defined in
[`src/tools/images/schemas/output.ts`](../../src/tools/images/schemas/output.ts).

**Action required:** Update any code that relied on the `base64` field in image results.
