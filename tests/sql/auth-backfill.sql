\set ON_ERROR_STOP on
begin;
insert into auth.users(id,raw_user_meta_data) values ('ffffffff-ffff-4fff-8fff-ffffffffffff','{"full_name":"Compte antérieur","role":"admin"}');
delete from public.profiles where id='ffffffff-ffff-4fff-8fff-ffffffffffff';
\i /tmp/academy-auth-profile-backfill.sql
do $$ begin
 if not exists(select 1 from public.profiles where id='ffffffff-ffff-4fff-8fff-ffffffffffff' and display_name='Compte antérieur' and role='student') then raise exception 'Old account backfill failed'; end if;
end $$;
update public.profiles set role='editor',display_name='Nom conservé' where id='ffffffff-ffff-4fff-8fff-ffffffffffff';
\i /tmp/academy-auth-profile-backfill.sql
do $$ begin
 if not exists(select 1 from public.profiles where id='ffffffff-ffff-4fff-8fff-ffffffffffff' and display_name='Nom conservé' and role='editor') then raise exception 'Backfill overwrote an existing reviewed profile'; end if;
end $$;
rollback;
