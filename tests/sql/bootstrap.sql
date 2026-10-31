-- Minimal Supabase Auth contracts for isolated PostgreSQL RLS tests.
-- This fixture does not emulate GoTrue, JWT verification or the HTTP gateway.
create role anon nologin;
create role authenticated nologin;
create schema auth;
create table auth.users(id uuid primary key, raw_user_meta_data jsonb not null default '{}');
create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
create function auth.uid() returns uuid language sql stable as $$ select (auth.jwt()->>'sub')::uuid $$;
grant usage on schema auth to anon,authenticated;
grant execute on all functions in schema auth to anon,authenticated;
