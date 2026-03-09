# brave_llm_context

Retrieves pre-extracted, relevance-scored web content optimised for grounding LLM responses
in real-time search results. Returns structured context sections ready to paste into a prompt.

## Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | ✓ | — | Query to retrieve grounding context for (max 400 chars) |
| `country` | string | | `US` | Country code |
| `search_lang` | string | | `en` | Search language |
| `count` | number | | `10` | Number of results (1–20) |

## Response fields (per result)

- `title` — page title
- `url` — source URL
- `snippets` — array of pre-extracted relevant text snippets

## Use case

Use `brave_llm_context` instead of `brave_web_search` when you need clean, structured content
for injecting into an LLM prompt. The results are pre-processed for snippet quality and
relevance — no need to extract text yourself.

## Example

```json
{
  "query": "how do vaccines work",
  "count": 5
}
```

## Required API Key

`BRAVE_SEARCH_API_KEY` → falls back to `BRAVE_API_KEY`
