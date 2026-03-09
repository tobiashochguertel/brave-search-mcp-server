# brave_summarizer

Generates an AI-powered summary from web search results using Brave's summarization API.

## Two-step workflow

1. Perform a web search with `summary: true`
2. Take the `summary_key` from the response and pass it to `brave_summarizer`

```
brave_web_search(query=..., summary=true)  →  summary_key
brave_summarizer(key=summary_key, ...)     →  AI summary
```

## Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `key` | string | ✓ | — | Summary key from a prior `brave_web_search` with `summary: true` |
| `entity_info` | boolean | | `false` | Include structured entity information in the response |
| `inline_references` | boolean | | `false` | Add inline source URL references to the summary text |

## Example

```json
{
  "key": "sum_abc123",
  "entity_info": true,
  "inline_references": true
}
```

## Required API Key

`BRAVE_AI_API_KEY` (Free AI plan) or `BRAVE_PRO_AI_API_KEY` (Pro AI plan)
→ falls back to `BRAVE_API_KEY`
