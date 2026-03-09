# brave_web_search

Performs comprehensive web searches with rich result types and advanced filtering options.

## Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | ✓ | — | Search terms (max 400 chars, 50 words) |
| `country` | string | | `US` | Country code for localised results |
| `search_lang` | string | | `en` | Search language |
| `ui_lang` | string | | `en-US` | UI language |
| `count` | number | | `10` | Results per page (1–20) |
| `offset` | number | | `0` | Pagination offset (max 9) |
| `safesearch` | string | | `moderate` | Content filter: `off`, `moderate`, `strict` |
| `freshness` | string | | — | Time filter: `pd` (24 h), `pw` (week), `pm` (month), `py` (year), or `YYYY-MM-DDtoYYYY-MM-DD` |
| `text_decorations` | boolean | | `true` | Include highlighting markers in snippets |
| `spellcheck` | boolean | | `true` | Enable spell-checking |
| `result_filter` | array | | `["web","query"]` | Filter result types returned |
| `goggles` | array | | — | Custom re-ranking definitions |
| `units` | string | | — | `metric` or `imperial` |
| `extra_snippets` | boolean | | `false` | Additional excerpts (Pro plans only) |
| `summary` | boolean | | `false` | Enable summary key generation for use with `brave_summarizer` |

## Example

```json
{
  "query": "best coffee shops Berlin",
  "country": "DE",
  "search_lang": "de",
  "count": 5,
  "freshness": "pm",
  "extra_snippets": true
}
```

## Required API Key

`BRAVE_SEARCH_API_KEY` → falls back to `BRAVE_API_KEY`
