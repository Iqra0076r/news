create table bingnews_private.messages(id uuid primary key default gen_random_uuid(),created_at timestamptz default now(),name text,email text,subject text,body text,visitor_hash text);
create or replace function public.bn_contact(action text,payload jsonb default '{}') returns jsonb language plpgsql security invoker set search_path='' as $$
begin
 if action='inbox' then return (select coalesce(jsonb_agg(m order by created_at desc),'[]') from (select id,created_at,name,email,subject,body from bingnews_private.messages order by created_at desc limit 100)m); end if;
 perform pg_advisory_xact_lock(hashtext(payload->>'hash'));
 if (select count(*) from bingnews_private.messages where visitor_hash=payload->>'hash' and created_at>now()-interval '1 day')>=5 then raise exception 'Daily message limit reached'; end if;
 insert into bingnews_private.messages(name,email,subject,body,visitor_hash) values(payload->>'name',payload->>'email',payload->>'subject',payload->>'body',payload->>'hash');
 return '{"ok":true}';
end $$;
revoke all on function public.bn_contact(text,jsonb) from public,anon,authenticated;
grant execute on function public.bn_contact(text,jsonb) to service_role;
grant all on bingnews_private.messages to service_role;
