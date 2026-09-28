# Atlas Newsroom

Production-oriented autonomous news website built with Next.js 16.3.6 + React 19.3.

## What is implemented

- Premium responsive newsroom homepage, category pages, search and internal article pages.
- `NewsArticle` JSON-LD, canonical metadata, Open Graph, robots, standard sitemap and 48-hour Google News sitemap.
- 30-minute protected ingestion endpoint and GitHub Actions scheduler.
- RSS/Atom feed ingestion for approved feeds only.
- URL/GUID fingerprint deduplication plus near-duplicate headline similarity.
- AI article generation with a fact-constrained prompt through either the OpenAI Responses API or local Ollama.
- Automatic rejection when the AI cannot support an article from the supplied fact pack.
- Source provenance stored privately; upstream outlet names are not rendered publicly.
- Feed-level licensing controls: sources requiring public attribution are skipped when the product policy forbids visible source names.
- Image reuse flag per source; otherwise a high-resolution site-owned editorial SVG illustration is generated.
- Supabase/PostgreSQL migration and REST data adapter.
- Secure cron secret and simple signed-cookie admin authentication.
- Demo mode that works without external services and is disabled by setting `DEMO_MODE=false`.

## Local start

1. Copy `.env.example` to `.env.local`.
2. Keep `DEMO_MODE=true` for the immediate UI/demo.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open `http://localhost:3000`.
6. For a home-PC scheduler, set `SITE_URL` + `CRON_SECRET` and run `npm run scheduler` in a second terminal. It calls the ingestion endpoint immediately and every 30 minutes thereafter.

## Production activation

1. Create a Supabase project and execute `supabase/migrations/001_init.sql`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and the server-only `SUPABASE_SERVICE_ROLE_KEY`.
3. Choose the writing engine: set `AI_PROVIDER=openai` with `OPENAI_API_KEY`, or `AI_PROVIDER=ollama` with a locally running Ollama model for a no-API-cost setup.
4. Set `CRON_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `SESSION_SECRET`.
5. Configure `NEWS_FEEDS_JSON` only with feeds/APIs whose terms permit the intended use. `publicAttributionRequired:true` causes the current ingestion policy to skip that feed.
6. Set `DEMO_MODE=false`.
7. In GitHub repository secrets, add `SITE_URL` and `CRON_SECRET` for `.github/workflows/news-fetch.yml`.
8. Deploy to a Node-compatible Next.js host. The GitHub scheduler will call `/api/cron/news` every 30 minutes.

## Important publishing rule

The system intentionally does not bypass paywalls or scrape full publisher articles. It works from approved feeds/APIs and their supplied factual summaries. Source provenance is stored in the database for auditing even when the source brand is not rendered in the public UI. If a feed requires public attribution, either allow that attribution in your editorial policy or do not ingest the feed.

## Next production hardening steps

For high-volume operation, add distributed locking, a durable queue, embeddings/pgvector for semantic story clustering, comprehensive admin CRUD, article-version restore UI, source-health dashboards, metrics and image downloading to owned storage instead of external URLs.
