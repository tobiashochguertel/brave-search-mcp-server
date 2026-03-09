# API Keys

Brave Search uses **separate subscription plans**, each with its own API key.
Set at least `BRAVE_API_KEY` as the default fallback. Subscription-specific keys
take priority over the fallback for their respective endpoints.

Get keys at [api-dashboard.search.brave.com](https://api-dashboard.search.brave.com/app/keys).

## Key Variables

| Variable | Plan | Endpoints covered |
|---|---|---|
| `BRAVE_API_KEY` | Default / fallback (Free Search) | All endpoints — used when no specific key is set |
| `BRAVE_SEARCH_API_KEY` | Search plan | web, news, images, videos, local POIs, llm-context |
| `BRAVE_AI_API_KEY` | Free AI plan | summarizer (free tier) |
| `BRAVE_PRO_AI_API_KEY` | Pro AI plan | summarizer (deprecated plan, still functional) |
| `BRAVE_ANSWERS_API_KEY` | Answers plan | brave_answers (AI chat completions) |
| `BRAVE_AUTOSUGGEST_API_KEY` | Autosuggest plan | suggest |
| `BRAVE_SPELLCHECK_API_KEY` | Spellcheck plan | spellcheck |

## Getting API Keys

1. Sign up at [brave.com/search/api/](https://brave.com/search/api/)
2. Choose a plan:
   - **Free**: 2,000 queries/month, basic web search
   - **Pro**: Enhanced features — local search, AI summaries, extra snippets
3. Generate your API key from the [developer dashboard](https://api-dashboard.search.brave.com/app/keys)

You can create **multiple keys per plan** for different purposes (e.g. one per device or project).
All keys under the same plan share the request quota.

## Minimal Setup (free only)

```bash
export BRAVE_API_KEY=BSA...
```

## Full Setup (all plans)

```bash
export BRAVE_API_KEY=BSA...              # Free Search fallback
export BRAVE_SEARCH_API_KEY=BSA...      # Web / local / video / news / LLM context
export BRAVE_AI_API_KEY=BSA...          # AI summarizer (free tier)
export BRAVE_ANSWERS_API_KEY=BSA...     # AI Answers
export BRAVE_AUTOSUGGEST_API_KEY=BSA... # Autosuggest
export BRAVE_SPELLCHECK_API_KEY=BSA...  # Spellcheck
```

## Key Priority Logic

When a request arrives for a specific endpoint, the server picks the key as follows:

```
subscription-specific key → BRAVE_API_KEY → error
```

For example, a `brave_answers` call uses `BRAVE_ANSWERS_API_KEY`, falling back to
`BRAVE_API_KEY` if the answers key is not set.

See `src/config.ts → getApiKeyForEndpoint()` for the implementation.
