# brave_video_search

Searches for videos with comprehensive metadata and thumbnail information.

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
| `safesearch` | string | | `moderate` | Content filter |
| `freshness` | string | | — | Time filter |

## Response fields (per result)

- Title, URL, description
- Duration, published date
- Thumbnail URL
- Source domain

## Example

```json
{
  "query": "TypeScript tutorial 2025",
  "count": 5
}
```

## Required API Key

`BRAVE_SEARCH_API_KEY` → falls back to `BRAVE_API_KEY`
