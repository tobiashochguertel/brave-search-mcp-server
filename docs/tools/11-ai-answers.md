# brave_answers

Provides AI-generated answers backed by real-time web search, using Brave's OpenAI-compatible
chat completions API.

## Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | ✓ | — | The question or prompt to answer (max 2000 chars) |
| `country` | string | | `us` | 2-letter country code for localised search context |
| `language` | string | | `en` | Language code for the response |
| `enable_research` | boolean | | `false` | Multi-search research mode — more thorough but slower and higher cost |
| `enable_citations` | boolean | | `false` | Include inline source citations in the answer |
| `enable_entities` | boolean | | `false` | Include structured entity data in the answer |

## Streaming note

`enable_citations` and `enable_entities` internally require `stream: true` against the Brave API.
**This fork handles that transparently**: the server consumes the SSE stream and assembles a
complete response before returning it to the MCP client. No MCP-level streaming is required
by the caller.

## Example

```json
{
  "query": "What is the capital of Germany and what is it known for?",
  "language": "en",
  "enable_citations": true
}
```

## Required API Key

`BRAVE_ANSWERS_API_KEY`

> This tool requires a paid **Answers** subscription. It will not fall back to `BRAVE_API_KEY`.
