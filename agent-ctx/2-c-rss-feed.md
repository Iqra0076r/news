# Task 2-c: Google News Compatible RSS Feed

## Summary
Created `/src/app/feed.xml/route.ts` — a Google News Publisher Center compatible RSS feed.

## What was built
- **Route**: `GET /feed.xml` returns a fully compliant RSS 2.0 XML feed
- **Source**: Fetches from `http://feeds.bbci.co.uk/news/rss.xml` (BBC top stories)
- **Parsing**: Regex-based XML extraction (no external dependencies) for `<item>`, `<title>`, `<link>`, `<description>` (CDATA + plain text), `<pubDate>`, `<media:thumbnail>` / `<enclosure>`
- **HD Image Upgrade**: Replaces `/ace/standard/240/` → `/ace/standard/1200/` in image URLs
- **Google News Compliance**:
  - `<title>SaveitBro News</title>`
  - `<link>https://saveitbro.com</link>`
  - `<description>Real-time breaking news from around the world</description>`
  - `<language>en-us</language>`
  - `<lastBuildDate>` (current UTC time)
  - `<ttl>10</ttl>`, `<atom:link rel="self">`
  - Namespaces: `xmlns:atom`, `xmlns:media`
  - Each `<item>` has `<title>`, `<link>`, `<description>`, `<pubDate>`, `<guid isPermaLink="true">`, `<media:content medium="image">`
- **Caching**: `Cache-Control: public, s-maxage=300, stale-while-revalidate=600` (5 min cache)
- **Error resilience**: Returns empty valid RSS on fetch failure (never 5xx)
- **No z-ai-web-dev-sdk**: Uses only built-in `fetch`

## Verification
- Lint: clean (0 errors)
- `/feed.xml` returns 200 with `application/rss+xml; charset=utf-8`
- RSS content is valid XML with all required elements and media:content images at 1200px resolution
