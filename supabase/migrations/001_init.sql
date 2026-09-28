create extension if not exists pgcrypto;
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  headline text not null,
  standfirst text not null,
  body text not null,
  category text not null,
  tags text[] not null default '{}',
  author text not null default 'News Desk',
  published_at timestamptz not null default now(),
  modified_at timestamptz not null default now(),
  image_url text not null,
  image_alt text not null,
  image_credit text,
  featured boolean not null default false,
  breaking boolean not null default false,
  status text not null default 'draft' check (status in ('draft','review','published','updated','unpublished','rejected','duplicate')),
  seo_title text not null,
  seo_description text not null,
  source_fingerprint text unique,
  story_cluster text,
  provenance jsonb not null default '{}'::jsonb,
  search_vector tsvector generated always as (to_tsvector('english', coalesce(headline,'') || ' ' || coalesce(standfirst,'') || ' ' || coalesce(body,''))) stored
);
create index if not exists articles_published_at_idx on public.articles (published_at desc);
create index if not exists articles_category_idx on public.articles (category, published_at desc);
create index if not exists articles_status_idx on public.articles (status, published_at desc);
create index if not exists articles_search_idx on public.articles using gin(search_vector);

create table if not exists public.fetch_runs (
  id uuid primary key default gen_random_uuid(), started_at timestamptz not null default now(), completed_at timestamptz,
  status text not null default 'running', fetched integer not null default 0, published integer not null default 0,
  duplicates integer not null default 0, rejected integer not null default 0, errors jsonb not null default '[]'::jsonb
);
create table if not exists public.article_versions (
  id uuid primary key default gen_random_uuid(), article_id uuid not null references public.articles(id) on delete cascade,
  created_at timestamptz not null default now(), headline text not null, standfirst text not null, body text not null, editor text
);
