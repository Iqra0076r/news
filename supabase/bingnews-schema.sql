create schema if not exists bingnews_private;
revoke all on schema bingnews_private from public,anon,authenticated;
create table if not exists public.bn_articles (
 id uuid primary key default gen_random_uuid(), slug text not null unique,
 headline text not null, standfirst text not null, body text not null,
 category text not null default 'World', tags text[] not null default '{}',
 author text not null default 'BingNews Desk', status text not null default 'review' check(status in ('draft','review','scheduled','published','unpublished','rejected')),
 published_at timestamptz not null default now(), modified_at timestamptz not null default now(),
 image_url text not null default '', image_alt text not null default '', image_credit text not null default '',
 seo_title text not null default '', seo_description text not null default '',
 featured boolean not null default false, breaking_until timestamptz, correction text,
 cluster_id text unique, search_vector tsvector generated always as (to_tsvector('english', headline || ' ' || standfirst || ' ' || body)) stored
);
create index if not exists bn_article_search on public.bn_articles using gin(search_vector);
create index if not exists bn_article_published on public.bn_articles(status,published_at desc);
create index if not exists bn_article_category on public.bn_articles(category,published_at desc);
alter table public.bn_articles enable row level security;
create policy bn_public_read on public.bn_articles for select to anon,authenticated using(status='published' and published_at<=now());
grant select on public.bn_articles to anon,authenticated;
revoke insert,update,delete on public.bn_articles from anon,authenticated;
create table bingnews_private.sources(id text primary key,name text not null,url text not null,category text not null,enabled boolean not null default true,license text not null,allowed_hosts text[] not null, image_hosts text[] not null default '{}',last_success timestamptz,last_error text);
create table bingnews_private.items(fingerprint text primary key,source_id text references bingnews_private.sources(id),url text not null,guid text,headline text,content_hash text,status text not null,article_id uuid references public.bn_articles(id),facts jsonb,verification jsonb,source_published_at timestamptz,created_at timestamptz default now());
create table bingnews_private.runs(id uuid primary key default gen_random_uuid(),started_at timestamptz default now(),completed_at timestamptz,status text default 'running',stats jsonb default '{}',errors jsonb default '[]');
create table bingnews_private.versions(id bigint generated always as identity primary key,article_id uuid not null,changed_at timestamptz default now(),actor text,record jsonb not null);
create table bingnews_private.admins(email text primary key);
create table bingnews_private.metrics(article_id uuid references public.bn_articles(id) on delete cascade,day date default current_date,visitor_hash text,depth integer default 0,primary key(article_id,day,visitor_hash));
create table bingnews_private.audit(id bigint generated always as identity primary key,at timestamptz default now(),actor text,action text,details jsonb);
create table public.bn_categories(name text primary key,slug text unique not null,position integer not null,enabled boolean default true);
alter table public.bn_categories enable row level security;
create policy bn_categories_read on public.bn_categories for select to anon,authenticated using(enabled);
grant select on public.bn_categories to anon,authenticated;
insert into public.bn_categories(name,slug,position) select x,lower(x),n from unnest(array['World','Pakistan','Politics','Business','Technology','Sports','Science','Health','Entertainment','Lifestyle']) with ordinality t(x,n);
insert into bingnews_private.admins values ('nadeem.13613.ac@iqra.edu.pk');
insert into bingnews_private.sources values
('nasa','NASA','https://www.nasa.gov/feed/','Science',true,'US government factual material; media credit retained; third-party copyrighted media excluded',array['www.nasa.gov','science.nasa.gov'],array['www.nasa.gov','science.nasa.gov','images-assets.nasa.gov'],null,null),
('fed','Federal Reserve','https://www.federalreserve.gov/feeds/press_all.xml','Business',true,'US federal government public information; factual synthesis',array['www.federalreserve.gov'],array[]::text[],null,null),
('nih','National Institutes of Health','https://www.nih.gov/news-events/news-releases/rss.xml','Health',true,'US federal government factual material; high-impact health claims held for review',array['www.nih.gov'],array[]::text[],null,null),
('nsf','National Science Foundation','https://www.nsf.gov/rss/rss_www_news.xml','Technology',true,'US federal government factual material; third-party media excluded',array['www.nsf.gov'],array[]::text[],null,null);
create or replace function public.bn_service(action text,payload jsonb default '{}') returns jsonb language plpgsql security invoker set search_path='' as $$
declare r jsonb; aid uuid; runid uuid; oldrow public.bn_articles; newrow public.bn_articles; obj jsonb;
begin
 if action='begin' then
  perform pg_advisory_xact_lock(20928731);
  if exists(select 1 from bingnews_private.runs where status='running' and started_at>now()-interval '20 minutes') then return jsonb_build_object('locked',true); end if;
  update bingnews_private.runs set status='timeout',completed_at=now() where status='running';
  insert into bingnews_private.runs default values returning id into runid;
  return jsonb_build_object('id',runid,'sources',(select coalesce(jsonb_agg(s),'[]') from bingnews_private.sources s where enabled),'items',(select coalesce(jsonb_agg(jsonb_build_object('fingerprint',fingerprint,'content_hash',content_hash,'status',status)),'[]') from bingnews_private.items),'articles',(select coalesce(jsonb_agg(jsonb_build_object('id',id,'headline',headline,'standfirst',standfirst,'published_at',published_at,'cluster_id',cluster_id)),'[]') from public.bn_articles where status not in ('rejected','unpublished') and published_at>now()-interval '30 days'));
 elsif action='finish' then
  update bingnews_private.runs set completed_at=now(),status=coalesce(payload->>'status','success'),stats=payload->'stats',errors=coalesce(payload->'errors','[]') where id=(payload->>'id')::uuid and status='running'; return '{"ok":true}';
 elsif action='item' then
  insert into bingnews_private.items(fingerprint,source_id,url,guid,headline,content_hash,status,article_id,facts,verification,source_published_at) values(payload->>'fingerprint',payload->>'source_id',payload->>'url',payload->>'guid',payload->>'headline',payload->>'content_hash',payload->>'status',nullif(payload->>'article_id','')::uuid,payload->'facts',payload->'verification',nullif(payload->>'source_published_at','')::timestamptz) on conflict(fingerprint) do update set status=excluded.status,article_id=excluded.article_id,facts=excluded.facts,verification=excluded.verification,content_hash=excluded.content_hash;
  return '{"ok":true}';
 elsif action='publish' then
  if not exists(select 1 from bingnews_private.runs where id=(payload->>'run_id')::uuid and status='running' and started_at>now()-interval '20 minutes') then raise exception 'Run expired'; end if;
  obj=payload->'article';
  select * into oldrow from public.bn_articles where cluster_id=obj->>'cluster_id';
  if found then return jsonb_build_object('duplicate',true,'id',oldrow.id); end if;
  insert into public.bn_articles(slug,headline,standfirst,body,category,tags,author,status,published_at,image_url,image_alt,image_credit,seo_title,seo_description,cluster_id)
  values(obj->>'slug',obj->>'headline',obj->>'standfirst',obj->>'body',obj->>'category',array(select jsonb_array_elements_text(coalesce(obj->'tags','[]'))),'BingNews Desk',case when obj->>'status'='published' then 'published' else 'review' end,(obj->>'published_at')::timestamptz,coalesce(obj->>'image_url',''),coalesce(obj->>'image_alt',''),coalesce(obj->>'image_credit',''),obj->>'seo_title',obj->>'seo_description',obj->>'cluster_id') returning id into aid;
  insert into bingnews_private.versions(article_id,actor,record) select aid,'pipeline',to_jsonb(a) from public.bn_articles a where id=aid;
  return jsonb_build_object('id',aid);
 elsif action='admin_check' then return jsonb_build_object('admin',exists(select 1 from bingnews_private.admins where email=lower(payload->>'email')));
 elsif action='dashboard' then return jsonb_build_object('articles',(select coalesce(jsonb_agg(a order by published_at desc),'[]') from public.bn_articles a),'sources',(select coalesce(jsonb_agg(s),'[]') from bingnews_private.sources s),'runs',(select coalesce(jsonb_agg(r order by started_at desc),'[]') from (select * from bingnews_private.runs order by started_at desc limit 30) r),'items',(select coalesce(jsonb_agg(i),'[]') from (select fingerprint,headline,status,verification,article_id from bingnews_private.items order by created_at desc limit 60)i));
 elsif action='save' then
  obj=payload->'article'; aid=(obj->>'id')::uuid;
  select * into oldrow from public.bn_articles where id=aid for update;
  if not found then raise exception 'Article not found'; end if;
  insert into bingnews_private.versions(article_id,actor,record) values(aid,payload->>'actor',to_jsonb(oldrow));
  update public.bn_articles set headline=obj->>'headline',standfirst=obj->>'standfirst',body=obj->>'body',category=obj->>'category',status=obj->>'status',seo_title=obj->>'seo_title',seo_description=obj->>'seo_description',image_url=coalesce(obj->>'image_url',''),image_alt=coalesce(obj->>'image_alt',''),image_credit=coalesce(obj->>'image_credit',''),featured=coalesce((obj->>'featured')::boolean,false),breaking_until=nullif(obj->>'breaking_until','')::timestamptz,correction=obj->>'correction',modified_at=now() where id=aid;
  insert into bingnews_private.audit(actor,action,details) values(payload->>'actor','save',jsonb_build_object('id',aid));return '{"ok":true}';
 elsif action='versions' then return (select coalesce(jsonb_agg(v order by changed_at desc),'[]') from bingnews_private.versions v where article_id=(payload->>'id')::uuid);
 elsif action='source' then update bingnews_private.sources set enabled=(payload->>'enabled')::boolean where id=payload->>'id'; return '{"ok":true}';
 elsif action='source_health' then update bingnews_private.sources set last_success=case when payload->>'error' is null then now() else last_success end,last_error=payload->>'error' where id=payload->>'id'; return '{"ok":true}';
 elsif action='metric' then
  insert into bingnews_private.metrics(article_id,visitor_hash,depth) select (payload->>'id')::uuid,payload->>'hash',least(100,greatest(0,(payload->>'depth')::integer)) where exists(select 1 from public.bn_articles where id=(payload->>'id')::uuid and status='published') on conflict(article_id,day,visitor_hash) do update set depth=greatest(bingnews_private.metrics.depth,excluded.depth); return '{"ok":true}';
 elsif action='trending' then return (select coalesce(jsonb_agg(t),'[]') from (select a.id,a.slug,a.headline,count(m.visitor_hash) as views from public.bn_articles a join bingnews_private.metrics m on m.article_id=a.id and m.day>current_date-7 where a.status='published' group by a.id order by count(m.visitor_hash)::float/(1+extract(epoch from(now()-a.published_at))/86400) desc limit 6)t);
 end if;
 raise exception 'Unknown operation';
end $$;
revoke all on function public.bn_service(text,jsonb) from public,anon,authenticated;
grant execute on function public.bn_service(text,jsonb) to service_role;
grant usage on schema bingnews_private to service_role;
grant all on all tables in schema bingnews_private to service_role;
grant all on all sequences in schema bingnews_private to service_role;
grant all on public.bn_articles,public.bn_categories to service_role;
