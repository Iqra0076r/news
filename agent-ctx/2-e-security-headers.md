---
Task ID: 2-e
Agent: Main Agent
Task: Update next.config.ts with SEO-optimized security and caching headers

Work Log:
- Read worklog.md for project context
- Read existing next.config.ts to understand current configuration
- Added `securityHeaders` array with 6 security headers: X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Referrer-Policy (strict-origin-when-cross-origin), Permissions-Policy (camera/microphone/geolocation all empty), X-XSS-Protection (1; mode=block), Strict-Transport-Security (max-age=31536000; includeSubDomains)
- Added `async headers()` function to Next.js config
- Global catch-all route `/(.*)` applies all 6 security headers to every request
- Route-specific caching: /api/news/rss (s-maxage=300, swr=600), /api/news/article (s-maxage=1800, swr=3600), /feed.xml (s-maxage=300, swr=600), /sitemap.xml (s-maxage=3600, swr=7200)
- Each cached route also inherits all security headers via spread operator
- CORS headers on `/_next/image(.*)` for optimised image serving: Access-Control-Allow-Origin: *, Access-Control-Allow-Methods: GET, HEAD, OPTIONS
- All existing config preserved (output, typescript, reactStrictMode, images)
- Lint passed clean, dev server compiling without errors

Stage Summary:
- next.config.ts updated with comprehensive security, caching, and CORS headers
- No breaking changes — all existing configuration untouched
- Clean lint, dev server ready
