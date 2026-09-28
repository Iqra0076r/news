# BingNews

A Next.js/React newsroom with real Supabase data, full internal articles, search, private editing, and a scheduled source-to-publication workflow. All article links open a new tab. The public website is exported to indexable HTML for GitHub Pages; Supabase Edge Functions handle authenticated editing and database operations.

## Current deployment

- Repository: https://github.com/Iqra0076r/news
- Intended public URL: https://iqra0076r.github.io/news/
- Supabase project: Flarewire Automation, isolated `bn_*` tables and `bingnews_private` schema.
- The public deployment still needs the BingNews pull request merged and the first Actions run verified. Do not describe the schedule as live before that run completes.
- Five real initial reports have been editorially synthesized from official material. There are no fictional demo stories or fallback demo database records.

## Run locally

Node 22+ and npm are required.

```sh
npm ci
npm run snapshot
npm test
npm run typecheck
npm run build
npm run dev
```

Open `/news/` on the local development server. The snapshot uses a public publishable key protected by RLS. It contains only published editorial fields; source provenance, contacts and logs remain private.

## Automatic publishing

`.github/workflows/news.yml` runs on main pushes, manual dispatch and `*/30 * * * *`. GitHub schedules may be delayed and public-repository schedules can be disabled after inactivity. Each run fetches enabled sources, removes exact and near duplicates, extracts evidence-grounded facts, performs semantic event comparison when needed, drafts reports, validates numbers and runs a separate model verification. Sensitive topics and failed verification go to review. A database lock prevents overlapping processing; expiry lets a later run recover from a crashed worker.

The workflow uses an open Qwen2.5-1.5B model locally with llama.cpp, not the retired GitHub Models API. No paid model API or permanent server is required. GitHub's hosted-runner availability and quotas still apply. The model and Python wheel are cached. Default processing is limited to three candidate reports per run to bound CPU time; polling every 30 minutes does not mean a new report will necessarily be published every 30 minutes. A failed item remains eligible for retry, and a failed source does not stop the rest.

A short-lived GitHub OIDC token authenticates database writes. The Edge Function restricts the token by issuer, audience, repository ID, main branch and workflow path. No service-role key is stored in GitHub or browser bundles.

## Editorial administration

Open `/news/admin/`. The configured administrator email is stored privately in Supabase. Email OTP sign-in requires Supabase Auth to deliver mail to that address; the default Supabase mail service may restrict recipients. This delivery must be verified before declaring administrator sign-in operational. An administrator can edit published/review articles, change status and imagery, flag breaking stories, restore versions, pause sources and read fetch errors and contact messages.

Changes reach the static public edition on the next successful publishing run. An immediate live check hides a withdrawn story in browsers; the old HTML can persist until rebuilding. This is an explicit limitation of free static hosting. All public reads enforce published status at the database level.

## Sources and images

Initial feeds are official NASA, Federal Reserve, NIH and NSF endpoints. They must pass fetch and content checks; availability is visible in the newsroom. Medical and financial claims are held for review. Source and image rights must be reviewed when expanding the list. NASA photo credits are retained and images with detected third-party credits are excluded. Image-credit heuristics are conservative but do not replace editorial rights review. A typography-based category graphic replaces unavailable photographs.

## Security

`public.bn_articles` and `public.bn_categories` use RLS with anonymous read-only access. Private tables are outside exposed schemas. Privileged RPCs grant execution only to the service role. The admin API validates confirmed Supabase users against a private email allowlist. Public contacts have server-side validation and an IP-derived daily submission limit. No raw IP is stored in application analytics. React renders plain text article bodies instead of raw HTML.

## Scope and verification limits

The current implementation covers the core publication workflow, not every extension in the supplied master brief. Dedicated embedding indexes, automatic material-update merging, category/source creation UI, a redirect registry, scheduled editorial releases, image derivative storage, full analytics dashboards and newsletter delivery are not implemented. Automated verification is fallible, especially with a small CPU model, and does not establish the truth of an external source. Use review for high-impact reporting.

Tests exercise URL normalization, near-duplicate distinction, full RSS extraction, numerical fact guards and outbound-host restrictions. Type checking and the production build must pass before publication. The GitHub OIDC end-to-end workflow and email OTP still need live verification after approval to publish.

## Database and rollback

`supabase/bingnews-schema.sql` and `supabase/bingnews-contact.sql` record applied schema changes. The existing legacy `001_init.sql` is not used by BingNews and must not be applied to this project. New work uses namespaced tables to avoid changing other applications. Revert the publication commit to restore the previous site; preserve database records for audit or export before any destructive cleanup.
