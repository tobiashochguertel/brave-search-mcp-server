# brave_spellcheck

Checks spelling and suggests corrections using Brave's spellcheck API.

## Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | ✓ | — | Text to spell-check (max 400 chars) |
| `country` | string | | `US` | Country / locale code |
| `lang` | string | | `en` | Language code |

## Response

- `corrected` — Corrected text (same as input if no corrections)
- `corrections` — Array of token-level corrections; empty if all correct

## Example

```json
{
  "query": "beutiful wether today",
  "country": "US",
  "lang": "en"
}
```

Response:
```json
{
  "corrected": "beautiful weather today",
  "corrections": [
    { "original": "beutiful", "corrected": "beautiful" },
    { "original": "wether", "corrected": "weather" }
  ]
}
```

## Required API Key

`BRAVE_SPELLCHECK_API_KEY` → falls back to `BRAVE_API_KEY`
