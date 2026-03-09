# brave_local_search

Searches for local businesses and places. Returns ratings, opening hours, phone numbers, addresses, and AI-generated descriptions.

## Parameters

Accepts the same parameters as [`brave_web_search`](./02-web-search.md), with the following behaviour:

- `result_filter` is automatically set to include `web` and `locations`
- Location context is derived from the `query` (e.g. "coffee near Berlin")

## Response fields (per result)

- Business name, address, city, zip, country
- Phone number, website
- Rating (0–5) and review count
- Opening hours
- Categories / business type
- AI-generated description (if available)

## Example

```json
{
  "query": "pharmacies Gifhorn 38518",
  "count": 10
}
```

## Notes

- Requires **Pro plan** for full local POI (Points of Interest) results.
- Falls back to plain web search when the plan does not include local search.

## Required API Key

`BRAVE_SEARCH_API_KEY` (Pro) → falls back to `BRAVE_API_KEY`
