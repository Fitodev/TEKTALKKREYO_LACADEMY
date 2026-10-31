\set ON_ERROR_STOP on
begin;
create function pg_temp.assert_true(ok boolean, label text) returns void language plpgsql as $$ begin if ok is distinct from true then raise exception 'FAIL: %',label; end if; raise notice 'PASS: %',label; end $$;
insert into auth.users(id,raw_user_meta_data) values
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','{"display_name":"Elèv A","role":"admin"}'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','{"display_name":"Elèv B"}'),
 ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','{"display_name":"Editè"}'),
 ('dddddddd-dddd-4ddd-8ddd-dddddddddddd','{"display_name":"Admin"}');
insert into auth.users(id,raw_user_meta_data) values ('cccccccc-cccc-4ccc-8ccc-cccccccccccc','{"full_name":"Elèv Google","role":"admin"}');
select pg_temp.assert_true((select display_name='Elèv Google' and role='student' from public.profiles where id='cccccccc-cccc-4ccc-8ccc-cccccccccccc'),'Google-style account gets a student profile, never its requested role');
update public.profiles set role='editor' where id='eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
update public.profiles set role='admin' where id='dddddddd-dddd-4ddd-8ddd-dddddddddddd';
select pg_temp.assert_true((select role='student' from public.profiles where id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),'signup ignores user-supplied role');
select pg_temp.assert_true((select count(*)=10 from public.modules),'seed contains 10 modules after repeat');
select pg_temp.assert_true((select count(*)=40 from public.lessons),'seed contains 40 lessons after repeat');
select pg_temp.assert_true((select count(*)=0 from public.lessons where status='published'),'outline lessons remain draft');
select pg_temp.assert_true((select bool_and(rowsecurity) from pg_tables where schemaname='public' and tablename in ('profiles','courses','modules','lessons','enrollments','lesson_progress','quizzes','questions','quiz_attempts','assignments','submissions','certificates','notes','bookmarks','audit_logs','affiliate_events','consent_records','tools','video_resources')),'RLS enabled on all public tables');
update public.courses set status='published',published_at=now() where slug='workspace-ia-automatisation';
update public.lessons set status='published',objectives='["A","B","C"]',mdx_content='Test fixture only' where slug='1-1-kisa-google-workspace-ye';
insert into public.enrollments(user_id,course_id) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','10000000-0000-4000-8000-000000000001');
insert into public.enrollments(user_id,course_id) values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','10000000-0000-4000-8000-000000000001');
insert into public.notes(user_id,lesson_id,content) select 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',id,'Private B' from public.lessons where slug='1-1-kisa-google-workspace-ye';
set local role anon;
select pg_temp.assert_true((select count(*)=1 from public.courses),'anonymous visitors can see published course');
select pg_temp.assert_true(not has_table_privilege('anon','public.lessons','select'),'anonymous visitors cannot query full lessons');
select pg_temp.assert_true(not has_table_privilege('anon','public.profiles','select'),'anonymous visitors cannot query profiles');
reset role;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","aal":"aal1"}',true);
select pg_temp.assert_true((select count(*)=1 from public.profiles),'student sees only own profile');
select pg_temp.assert_true((select count(*)=0 from public.notes),'student cannot read another student notes');
select pg_temp.assert_true((select count(*)=1 from public.lessons),'enrolled student sees published lesson only');
select pg_temp.assert_true(not has_column_privilege('authenticated','public.profiles','role','update'),'student cannot change role');
select pg_temp.assert_true(not has_table_privilege('authenticated','private.answer_keys','select'),'answer keys inaccessible to browser roles');
select pg_temp.assert_true(not has_table_privilege('authenticated','public.quiz_attempts','insert'),'student cannot forge quiz scores');
select pg_temp.assert_true(not has_table_privilege('authenticated','public.certificates','insert'),'student cannot issue certificates');
select pg_temp.assert_true(not has_column_privilege('authenticated','public.submissions','grade','update'),'student cannot assign grades');
insert into public.notes(user_id,lesson_id,content) select 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',id,'Private A' from public.lessons where slug='1-1-kisa-google-workspace-ye';
select pg_temp.assert_true((select count(*)=1 from public.notes),'student can save own note');
update public.notes set content='tampered' where user_id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
select pg_temp.assert_true(not private.has_role(array['editor','admin']::public.app_role[]),'student has no editorial rights');
do $$ begin
 begin
  insert into public.enrollments(user_id,course_id) values('dddddddd-dddd-4ddd-8ddd-dddddddddddd','10000000-0000-4000-8000-000000000001');
  raise exception 'FAIL: cross-user enrollment accepted';
 exception when insufficient_privilege then raise notice 'PASS: cross-user enrollment rejected'; end;
end $$;
select set_config('request.jwt.claims','{"sub":"eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee","aal":"aal1"}',true);
select pg_temp.assert_true(private.has_role(array['editor','admin']::public.app_role[]),'editor may prepare draft content');
select pg_temp.assert_true((select count(*)=40 from public.lessons),'editor can review draft lessons');
insert into public.courses(slug,title,summary) values('editor-draft','Draft','Draft');
do $$ begin
 begin
  update public.courses set status='published',published_at=now() where slug='editor-draft';
  raise exception 'FAIL: editor published course';
 exception when insufficient_privilege then raise notice 'PASS: editor cannot publish'; end;
end $$;
select set_config('request.jwt.claims','{"sub":"dddddddd-dddd-4ddd-8ddd-dddddddddddd","aal":"aal1"}',true);
select pg_temp.assert_true(not private.has_role(array['admin']::public.app_role[]),'admin without MFA denied');
select set_config('request.jwt.claims','{"sub":"dddddddd-dddd-4ddd-8ddd-dddddddddddd","aal":"aal2"}',true);
select pg_temp.assert_true(private.has_role(array['admin']::public.app_role[]),'admin with MFA allowed');
update public.courses set status='published',published_at=now() where slug='editor-draft';
select pg_temp.assert_true((select status='published' from public.courses where slug='editor-draft'),'MFA admin can publish course');
reset role;
select pg_temp.assert_true((select content='Private B' from public.notes where user_id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),'cross-user update left private note unchanged');
rollback;
