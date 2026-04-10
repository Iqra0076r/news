---
Task ID: 1
Agent: Main Agent
Task: Complete rewrite of PulseNews from Al Jazeera web-search based to BBC RSS feeds

Work Log:
- Read and analyzed existing codebase (types, store, components, API routes, layout)
- Invoked web-reader skill for article content fetching capability
- Rewrote `/src/types/news.ts` with 13 BBC categories matching user's RSS feed list
- Rewrote `/src/store/news-store.ts` with new category types
- Rewrote `/src/lib/helpers.ts` with BBC-specific utilities (RSS date parsing, HTML stripping, placeholder gradients)
- Created `/src/app/api/news/rss/route.ts` - RSS feed parser that fetches and parses BBC RSS XML feeds
- Updated `/src/app/api/news/article/route.ts` - Article reader using z-ai-web-dev-sdk page_reader for BBC URLs
- Updated `/src/app/api/news/search/route.ts` - Search across multiple BBC RSS feeds
- Removed old API routes (`/api/news/route.ts`, `/api/news/category/route.ts`, `/api/route.ts`)
- Rebuilt `/src/components/layout/navbar.tsx` with BBC-style navigation bar featuring dropdown menus for News (Top Stories, World, UK, Asia, Middle East, Africa) and Sport (Sport, Football, Cricket), plus standalone Business, Technology, Science, Entertainment
- Updated `/src/components/news/news-card.tsx` with BBC branding and red accent colors
- Updated `/src/components/news/article-detail.tsx` with BBC source references, full article reading, and localStorage bookmark persistence
- Updated `/src/components/news/hero-section.tsx` to use RSS API for Top Stories
- Updated `/src/components/news/category-section.tsx` to use RSS API with lazy loading
- Updated `/src/components/news/category-tabs.tsx` with BBC categories
- Updated `/src/components/news/category-view.tsx` with BBC category labels
- Updated `/src/components/news/search-results.tsx` to use new search API
- Updated `/src/components/layout/footer.tsx` with BBC branding and all categories
- Rebuilt `/src/app/page.tsx` homepage with BBC-style layout (Top Stories hero, World section, Business+Tech, Sport+Entertainment, Science)
- Updated `/src/app/layout.tsx` metadata for BBC News Pulse
- Updated `/next.config.ts` with BBC image domains (ichef.bbci.co.uk, *.bbci.co.uk, etc.)

Stage Summary:
- Successfully migrated from Al Jazeera web-search to BBC RSS feeds
- All 13 categories working with real BBC articles: top-stories, world, uk, asia, middle-east, africa, business, technology, science, sport, football, cricket, entertainment
- Navigation bar with dropdown menus for News regions and Sport sub-categories
- Full article reading using z-ai-web-dev-sdk page_reader for in-app content display
- Search across multiple RSS feeds
- Clean lint (0 errors)
- All API endpoints returning 200 status with real data

---
Task ID: 2
Agent: Main Agent
Task: Fix article content cleaning, remove all BBC branding, fix layout issues

Work Log:
- Completely rewrote `/src/app/api/news/article/route.ts` with aggressive HTML cleaning:
  - Added 16 REMOVE_TAGS (script, style, nav, svg, header, footer, aside, form, iframe, etc.)
  - Added 40+ REMOVE_SELECTORS patterns for social sharing, navigation, related articles, ads, comments, newsletters, etc.
  - Added TEXT_PATTERNS_TO_REMOVE for cleaning leftover text like "Share this", "Most read", "Related topics", etc.
  - Improved image extraction (keep src/alt only, clean figure/figcaption)
  - Convert paragraph-with-strong to proper h3 headers
  - Remove BBC text references from content (replaced with PulseNews)
  - Unwrap unnecessary nested divs
  - Added `nocache=true` parameter to force fresh article content on every open
  - Reduced cache from 30min to 10min
- Removed ALL user-facing "BBC" references:
  - `/src/app/layout.tsx` - metadata: "PulseNews — Live Breaking News"
  - `/src/components/layout/navbar.tsx` - logo: "PulseNews / Live", search placeholder: "Search news..."
  - `/src/components/layout/footer.tsx` - branding: "PulseNews", attribution: "Aggregated from trusted news sources"
  - `/src/components/news/news-card.tsx` - removed "BBC News" badge/text from all 4 card variants
  - `/src/components/news/hero-section.tsx` - removed "BBC News" secondary badge
  - `/src/components/news/article-detail.tsx` - removed "BBC News" source badge, changed attribution to "Original Publisher"
  - `/src/components/news/category-view.tsx` - changed "articles from BBC" to "articles available"
  - `/src/components/news/search-results.tsx` - changed "Search BBC News" to "Search News"
  - `/src/app/api/news/rss/route.ts` - source changed from "BBC News" to "PulseNews"
  - `/src/app/api/news/search/route.ts` - source changed from "BBC News" to "PulseNews"
  - `/src/store/news-store.ts` - localStorage key changed from "bbc-news-storage" to "pulse-news-storage"
- Fixed layout and design:
  - Added comprehensive article content CSS styles in globals.css (paragraphs, headings, images, blockquotes, lists, links, figures, videos)
  - Added CSS-based fallback for hiding remaining noisy elements (display: none for share/social/related/promo/advert/newsletter patterns)
  - Fixed video iframe styling with proper aspect ratio
  - Added proper data-component handling for article content blocks
  - Fixed unused import in bookmarks-view.tsx (removed `cn` from helpers import)
- Verified: lint passes cleanly, all API routes returning 200, dev server compiles without errors

Stage Summary:
- Article content now loads fresh on every open (nocache=true) with aggressive cleaning
- Zero user-facing "BBC" text anywhere on the website
- Clean article reading experience: only real content (text + images + videos), no social links, no related articles, no ads
- Proper typography and spacing for article content
- All feeds and API routes working correctly
