# brave_image_search

Searches for images. Returns image URLs, dimensions, and source metadata.

> **Note:** Version 2.x removed base64-encoded image data from the response. Only URLs and metadata
> are returned, matching the Brave API response structure more closely and avoiding context bloat.

## Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | ✓ | — | Search terms (max 400 chars, 50 words) |
| `country` | string | | `US` | Country code |
| `search_lang` | string | | `en` | Search language |
| `count` | number | | `50` | Results per page (1–200) |
| `safesearch` | string | | `strict` | Content filter: `off`, `strict` |
| `spellcheck` | boolean | | `true` | Enable spell-checking |

## Response fields (per result)

- `title` — image title
- `url` — direct image URL
- `thumbnail` — thumbnail URL and dimensions
- `source` — source page URL and domain
- `properties` — width × height in pixels

## Example

```json
{
  "query": "sunset over mountains",
  "count": 10,
  "safesearch": "strict"
}
```

## Required API Key

`BRAVE_SEARCH_API_KEY` → falls back to `BRAVE_API_KEY`
