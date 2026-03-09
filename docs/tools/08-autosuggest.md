# brave_autosuggest

Returns query completion suggestions as-you-type, powered by Brave's autosuggest API.

## Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | ✓ | — | Partial query text to complete (max 400 chars) |
| `country` | string | | `US` | Country code |
| `lang` | string | | `en` | Language code |
| `count` | number | | `10` | Number of suggestions (1–20) |

## Response

An array of suggestion strings ordered by relevance.

## Example

```json
{
  "query": "best restaurants in",
  "country": "DE",
  "lang": "de",
  "count": 5
}
```

## Required API Key

`BRAVE_AUTOSUGGEST_API_KEY` → falls back to `BRAVE_API_KEY`
