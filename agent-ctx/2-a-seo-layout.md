---
Task ID: 2-a
Agent: SEO Layout Rewrite
Task: Rewrite layout.tsx with enterprise-level SEO metadata and JSON-LD structured data

Work Log:
- Read worklog.md for project context (SaveitBro News, 13 BBC RSS categories)
- Read src/types/news.ts to identify all 13 categories for keyword expansion
- Read existing src/app/layout.tsx to preserve ThemeProvider, Toaster, font setup
- Wrote comprehensive Metadata object:
  - metadataBase set to NEXT_PUBLIC_SITE_URL env or fallback "https://saveitbro.com"
  - title with template pattern for per-page titles
  - Expanded keywords array: 13 category keywords + brand + discoverability terms (32 total)
  - Full Open Graph: title, description, type, siteName, locale (en_GB), url
  - Twitter Card: summary_large_image, title, description
  - robots: index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1 (with googleBot sub-object)
  - authors, creator, publisher fields
  - alternates.canonical
  - category and classification fields
- Added JSON-LD structured data before {children}:
  - NewsMediaOrganization schema with name, url, logo, sameAs social links (Twitter, Facebook, Instagram, LinkedIn)
  - WebSite schema with SearchAction pointing to /?search={search_term_string}
- Preserved: ThemeProvider, Toaster, Geist fonts, suppressHydrationWarning, body classes
- Verified: clean lint (0 errors), dev server compiled successfully

Stage Summary:
- Enterprise-level SEO metadata with Open Graph, Twitter Cards, robots directives
- JSON-LD structured data for Organization and WebSite with SearchAction
- All 13 categories covered in keywords
- Template-based title system for per-page overrides
- Clean lint, no compilation errors
