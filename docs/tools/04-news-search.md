# brave_news_search

Searches for current news articles with freshness controls and breaking-news indicators.

## Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | ✓ | — | Search terms (max 400 chars, 50 words) |
| `country` | string | | `US` | Country code |
| `search_lang` | string | | `en` | Search language |
| `ui_lang` | string | | `en-US` | UI language |
| `count` | number | | `20` | Results per page (1–50) |
| `offset` | number | | `0` | Pagination offset (max 9) |
| `spellcheck` | boolean | | `true` | Enable spell-checking |
| `safesearch` | string | | `moderate` | Content filter: `off`, `moderate`, `strict` |
| `freshness` | string | | `pd` | Time filter (default: last 24 h) |
| `extra_snippets` | boolean | | `false` | Additional excerpts (Pro plans) |
| `goggles` | array | | — | Custom re-ranking definitions |

## Example

```json
{
  "query": "AI breakthroughs 2025",
  "count": 10,
  "freshness": "pw",
  "country": "US"
}
```

## Required API Key

`BRAVE_SEARCH_API_KEY` → falls back to `BRAVE_API_KEY`
