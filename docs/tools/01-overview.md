# Tools Overview

This MCP server exposes the following tools, covering all Brave Search API endpoints.

| Tool | Description | Required API Key |
|---|---|---|
| [`brave_web_search`](./02-web-search.md) | Full web search with rich result types | `BRAVE_SEARCH_API_KEY` / `BRAVE_API_KEY` |
| [`brave_local_search`](./03-local-search.md) | Local businesses, places, ratings | `BRAVE_SEARCH_API_KEY` (Pro) |
| [`brave_news_search`](./04-news-search.md) | Current news with freshness controls | `BRAVE_SEARCH_API_KEY` / `BRAVE_API_KEY` |
| [`brave_video_search`](./05-video-search.md) | Videos with metadata & thumbnails | `BRAVE_SEARCH_API_KEY` / `BRAVE_API_KEY` |
| [`brave_image_search`](./06-image-search.md) | Image search results | `BRAVE_SEARCH_API_KEY` / `BRAVE_API_KEY` |
| [`brave_summarizer`](./07-summarizer.md) | AI-powered summary from web search | `BRAVE_AI_API_KEY` / `BRAVE_PRO_AI_API_KEY` |
| [`brave_autosuggest`](./08-autosuggest.md) | Query completion suggestions | `BRAVE_AUTOSUGGEST_API_KEY` |
| [`brave_spellcheck`](./09-spellcheck.md) | Spell check and correction | `BRAVE_SPELLCHECK_API_KEY` |
| [`brave_llm_context`](./10-llm-context.md) | Pre-extracted web content for LLM grounding | `BRAVE_SEARCH_API_KEY` |
| [`brave_answers`](./11-ai-answers.md) | AI answers from real-time web search | `BRAVE_ANSWERS_API_KEY` |

## Tool Filtering

Restrict which tools are exposed to the MCP client:

```bash
# Enable only a subset
BRAVE_MCP_ENABLED_TOOLS="brave_web_search brave_local_search"

# Disable specific tools
BRAVE_MCP_DISABLED_TOOLS="brave_image_search brave_video_search"
```

`ENABLED_TOOLS` and `DISABLED_TOOLS` are mutually exclusive.
