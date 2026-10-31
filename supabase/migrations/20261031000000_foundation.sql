-- Foundation migration. No service_role credential is needed by the application.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create type public.app_role as enum ('student','editor','admin');
create type public.content_status as enum ('draft','review','published');

create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check (char_length(display_name) between 1 and 80),
 role public.app_role not null default 'student',
 created_at timestamptz not null default now()
);
create function private.has_role(roles public.app_role[]) returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.profiles where id=(select auth.uid()) and role=any(roles)
 and (role <> 'admin' or (select auth.jwt()->>'aal')='aal2'));
$$;
revoke all on function private.has_role(public.app_role[]) from public;
grant execute on function private.has_role(public.app_role[]) to authenticated;
create function private.on_signup() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
 insert into public.profiles(id,display_name) values(new.id,left(coalesce(nullif(trim(new.raw_user_meta_data->>'display_name'),''),'Elèv'),80));
 return new;
end;
$$;
revoke all on function private.on_signup() from public;
create trigger create_profile after insert on auth.users for each row execute function private.on_signup();

create table public.courses (
 id uuid primary key default gen_random_uuid(), slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
 title text not null, summary text not null, status public.content_status not null default 'draft',
 cover_url text, language text not null default 'ht' check(language='ht'),published_at timestamptz,
 check(status <> 'published' or published_at is not null)
);
create table public.modules (
 id uuid primary key default gen_random_uuid(), course_id uuid not null references public.courses on delete cascade,
 position integer not null check(position>0),title text not null, summary text not null default '',unique(course_id,position)
);
create table public.video_resources (
 id uuid primary key default gen_random_uuid(),youtube_video_id text not null check(youtube_video_id ~ '^[A-Za-z0-9_-]{11}$'),
 title text not null,source_url text not null check(source_url ~ '^https://'),embed_allowed_verified_at timestamptz,
 language text not null,checked_at timestamptz
);
create table public.tools (
 id uuid primary key default gen_random_uuid(),name text not null,official_url text not null check(official_url ~ '^https://'),
 affiliate_url text check(affiliate_url ~ '^https://'),disclosure text not null default '',status public.content_status not null default 'draft',last_verified_at timestamptz,
 check(affiliate_url is null or length(trim(disclosure))>0)
);
create table public.lessons (
 id uuid primary key default gen_random_uuid(),module_id uuid not null references public.modules on delete cascade,
 slug text not null unique check(slug ~ '^[a-z0-9-]+$'),position integer not null check(position>0),title text not null,
 objectives jsonb not null default '[]' check(jsonb_typeof(objectives)='array'),prerequisites jsonb not null default '[]' check(jsonb_typeof(prerequisites)='array'),
 mdx_content text not null default '',status public.content_status not null default 'draft',duration_minutes integer not null default 45 check(duration_minutes between 1 and 600),
 video_id uuid references public.video_resources on delete set null,tool_id uuid references public.tools on delete set null,unique(module_id,position),
 check(status <> 'published' or (char_length(trim(mdx_content))>0 and jsonb_array_length(objectives) between 3 and 5))
);
create table public.enrollments (
 id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles on delete cascade,
 course_id uuid not null references public.courses on delete cascade,created_at timestamptz not null default now(),unique(user_id,course_id)
);
create table public.lesson_progress (
 id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles on delete cascade,
 lesson_id uuid not null references public.lessons on delete cascade,status text not null default 'started' check(status in ('started','completed')),
 completed_at timestamptz,unique(user_id,lesson_id),check((status='completed')=(completed_at is not null))
);
create table public.bookmarks (
 user_id uuid not null references public.profiles on delete cascade,lesson_id uuid not null references public.lessons on delete cascade,
 created_at timestamptz not null default now(),primary key(user_id,lesson_id)
);
create table public.notes (
 id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles on delete cascade,
 lesson_id uuid not null references public.lessons on delete cascade,content text not null check(char_length(content)<=20000),updated_at timestamptz not null default now(),unique(user_id,lesson_id)
);
create table public.quizzes (
 id uuid primary key default gen_random_uuid(),lesson_id uuid references public.lessons on delete cascade,module_id uuid references public.modules on delete cascade,
 passing_score integer not null default 80 check(passing_score between 1 and 100),attempts_limit integer not null default 3 check(attempts_limit between 1 and 10),check(num_nonnulls(lesson_id,module_id)=1)
);
-- Answer keys are physically separate from the public question payload.
create table public.questions (
 id uuid primary key default gen_random_uuid(),quiz_id uuid not null references public.quizzes on delete cascade,
 type text not null check(type in ('multiple_choice','true_false','application','case_study')),prompt text not null,
 options jsonb not null default '[]' check(jsonb_typeof(options)='array'),position integer not null check(position>0),unique(quiz_id,position)
);
create table private.answer_keys (
 question_id uuid primary key references public.questions on delete cascade,correct_answer jsonb not null,explanation text not null
);
create table public.quiz_attempts (
 id uuid primary key default gen_random_uuid(),quiz_id uuid not null references public.quizzes on delete cascade,
 user_id uuid not null references public.profiles on delete cascade,score integer not null check(score between 0 and 100),submitted_at timestamptz not null default now()
);
create table public.assignments (
 id uuid primary key default gen_random_uuid(),lesson_id uuid not null references public.lessons on delete cascade,
 instructions text not null,rubric jsonb not null check(jsonb_typeof(rubric)='object'),is_final boolean not null default false
);
create table public.submissions (
 id uuid primary key default gen_random_uuid(),assignment_id uuid not null references public.assignments on delete cascade,
 user_id uuid not null references public.profiles on delete cascade,content text not null default '' check(char_length(content)<=50000),file_path text,
 status text not null default 'draft' check(status in ('draft','submitted','graded')),grade integer check(grade between 0 and 100),feedback text,
 unique(assignment_id,user_id),check(status<>'graded' or grade is not null)
);
create table public.certificates (
 id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles on delete cascade,course_id uuid not null references public.courses on delete cascade,
 verification_code uuid not null unique default gen_random_uuid(),issued_at timestamptz not null default now(),unique(user_id,course_id)
);
create table public.affiliate_events (
 id uuid primary key default gen_random_uuid(),tool_id uuid not null references public.tools on delete cascade,lesson_id uuid references public.lessons on delete set null,
 visitor_session_id uuid not null,event_type text not null check(event_type in ('view','click')),created_at timestamptz not null default now(),consent_status boolean not null check(consent_status)
);
create table public.audit_logs (
 id uuid primary key default gen_random_uuid(),actor_id uuid references public.profiles on delete set null,action text not null,
 entity_type text not null,entity_id uuid,created_at timestamptz not null default now()
);
create table public.consent_records (
 id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles on delete cascade,
 purpose text not null check(purpose in ('marketing','analytics')),granted boolean not null,recorded_at timestamptz not null default now()
);

-- No broad default grants: each capability is explicitly granted.
revoke all on all tables in schema public from anon,authenticated;
revoke all on all tables in schema private from anon,authenticated;
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.video_resources enable row level security;
alter table public.tools enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.bookmarks enable row level security;
alter table public.notes enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.certificates enable row level security;
alter table public.affiliate_events enable row level security;
alter table public.audit_logs enable row level security;
alter table public.consent_records enable row level security;
alter table private.answer_keys enable row level security;

grant select on public.profiles to authenticated;
grant update(display_name) on public.profiles to authenticated;
create policy profile_read on public.profiles for select to authenticated using(id=(select auth.uid()) or private.has_role(array['admin']::public.app_role[]));
create policy profile_rename on public.profiles for update to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()));
-- Role changes require a separately reviewed administrative procedure; no browser role grants.

grant select on public.courses,public.modules,public.tools,public.video_resources to anon,authenticated;
create policy published_courses on public.courses for select using(status='published');
create policy published_modules on public.modules for select using(exists(select 1 from public.courses c where c.id=course_id and c.status='published'));
create policy published_tools on public.tools for select using(status='published');
create policy verified_videos on public.video_resources for select using(embed_allowed_verified_at is not null and checked_at is not null);

create function private.can_learn(target_lesson uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.lessons l join public.modules m on m.id=l.module_id join public.courses c on c.id=m.course_id
 join public.enrollments e on e.course_id=c.id where l.id=target_lesson and l.status='published' and c.status='published' and e.user_id=(select auth.uid()));
$$;
revoke all on function private.can_learn(uuid) from public;
grant execute on function private.can_learn(uuid) to authenticated;

grant select on public.lessons,public.quizzes,public.questions,public.assignments to authenticated;
create policy enrolled_lessons on public.lessons for select to authenticated using(private.can_learn(id));
create policy enrolled_assignments on public.assignments for select to authenticated using(private.can_learn(lesson_id));
create policy enrolled_quizzes on public.quizzes for select to authenticated using(
 (lesson_id is not null and private.can_learn(lesson_id)) or
 (module_id is not null and exists(select 1 from public.modules m join public.courses c on c.id=m.course_id join public.enrollments e on e.course_id=c.id where m.id=module_id and c.status='published' and e.user_id=(select auth.uid())))
);
create policy enrolled_questions on public.questions for select to authenticated using(exists(select 1 from public.quizzes q where q.id=quiz_id));

grant select,insert on public.enrollments to authenticated;
create policy own_enrollment_read on public.enrollments for select to authenticated using(user_id=(select auth.uid()));
create policy own_enrollment_insert on public.enrollments for insert to authenticated with check(user_id=(select auth.uid()) and exists(select 1 from public.courses c where c.id=course_id and c.status='published'));
grant select,insert,update,delete on public.lesson_progress to authenticated;
create policy own_read on public.lesson_progress for select to authenticated using(user_id=(select auth.uid()));
create policy own_insert on public.lesson_progress for insert to authenticated with check(user_id=(select auth.uid()) and private.can_learn(lesson_id));
create policy own_update on public.lesson_progress for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()) and private.can_learn(lesson_id));
create policy own_delete on public.lesson_progress for delete to authenticated using(user_id=(select auth.uid()));
grant select,insert,update,delete on public.bookmarks to authenticated;
create policy own_read on public.bookmarks for select to authenticated using(user_id=(select auth.uid()));
create policy own_insert on public.bookmarks for insert to authenticated with check(user_id=(select auth.uid()) and private.can_learn(lesson_id));
create policy own_update on public.bookmarks for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()) and private.can_learn(lesson_id));
create policy own_delete on public.bookmarks for delete to authenticated using(user_id=(select auth.uid()));
grant select,insert,update,delete on public.notes to authenticated;
create policy own_read on public.notes for select to authenticated using(user_id=(select auth.uid()));
create policy own_insert on public.notes for insert to authenticated with check(user_id=(select auth.uid()) and private.can_learn(lesson_id));
create policy own_update on public.notes for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()) and private.can_learn(lesson_id));
create policy own_delete on public.notes for delete to authenticated using(user_id=(select auth.uid()));

grant select on public.quiz_attempts,public.certificates,public.submissions,public.consent_records to authenticated;
create policy own_attempt_read on public.quiz_attempts for select to authenticated using(user_id=(select auth.uid()));
create policy own_certificate_read on public.certificates for select to authenticated using(user_id=(select auth.uid()));
-- Grading and certificate issuance are deliberately inaccessible until their transactional RPCs exist.
create policy own_submission_read on public.submissions for select to authenticated using(user_id=(select auth.uid()));
grant insert(assignment_id,user_id,content,file_path),update(content,file_path,status) on public.submissions to authenticated;
create policy draft_submission_insert on public.submissions for insert to authenticated with check(user_id=(select auth.uid()) and status='draft' and grade is null and feedback is null and exists(select 1 from public.assignments a where a.id=assignment_id and private.can_learn(a.lesson_id)));
create policy draft_submission_update on public.submissions for update to authenticated using(user_id=(select auth.uid()) and status='draft') with check(user_id=(select auth.uid()) and status in ('draft','submitted') and grade is null and feedback is null and exists(select 1 from public.assignments a where a.id=assignment_id and private.can_learn(a.lesson_id)));
create policy own_consent_read on public.consent_records for select to authenticated using(user_id=(select auth.uid()));
grant insert(user_id,purpose,granted) on public.consent_records to authenticated;
create policy own_consent_insert on public.consent_records for insert to authenticated with check(user_id=(select auth.uid()));
grant select on public.audit_logs,public.affiliate_events to authenticated;
create policy admin_audit_read on public.audit_logs for select to authenticated using(private.has_role(array['admin']::public.app_role[]));
create policy admin_event_read on public.affiliate_events for select to authenticated using(private.has_role(array['admin']::public.app_role[]));

-- Editors may prepare drafts and reviews; only MFA-verified admins can publish.
grant insert,update,delete on public.courses to authenticated;
create policy staff_read on public.courses for select to authenticated using(private.has_role(array['editor','admin']::public.app_role[]));
create policy staff_insert on public.courses for insert to authenticated with check(private.has_role(array['admin']::public.app_role[]) or (status in ('draft','review') and private.has_role(array['editor']::public.app_role[])));
create policy staff_update on public.courses for update to authenticated using(private.has_role(array['admin']::public.app_role[]) or (status in ('draft','review') and private.has_role(array['editor']::public.app_role[]))) with check(private.has_role(array['admin']::public.app_role[]) or (status in ('draft','review') and private.has_role(array['editor']::public.app_role[])));
create policy admin_delete on public.courses for delete to authenticated using(private.has_role(array['admin']::public.app_role[]));
grant insert,update,delete on public.lessons to authenticated;
create policy staff_read on public.lessons for select to authenticated using(private.has_role(array['editor','admin']::public.app_role[]));
create policy staff_insert on public.lessons for insert to authenticated with check(private.has_role(array['admin']::public.app_role[]) or (status in ('draft','review') and private.has_role(array['editor']::public.app_role[])));
create policy staff_update on public.lessons for update to authenticated using(private.has_role(array['admin']::public.app_role[]) or (status in ('draft','review') and private.has_role(array['editor']::public.app_role[]))) with check(private.has_role(array['admin']::public.app_role[]) or (status in ('draft','review') and private.has_role(array['editor']::public.app_role[])));
create policy admin_delete on public.lessons for delete to authenticated using(private.has_role(array['admin']::public.app_role[]));
grant insert,update,delete on public.tools to authenticated;
create policy staff_read on public.tools for select to authenticated using(private.has_role(array['editor','admin']::public.app_role[]));
create policy staff_insert on public.tools for insert to authenticated with check(private.has_role(array['admin']::public.app_role[]) or (status in ('draft','review') and private.has_role(array['editor']::public.app_role[])));
create policy staff_update on public.tools for update to authenticated using(private.has_role(array['admin']::public.app_role[]) or (status in ('draft','review') and private.has_role(array['editor']::public.app_role[]))) with check(private.has_role(array['admin']::public.app_role[]) or (status in ('draft','review') and private.has_role(array['editor']::public.app_role[])));
create policy admin_delete on public.tools for delete to authenticated using(private.has_role(array['admin']::public.app_role[]));
grant insert,update,delete on public.modules to authenticated;
create policy staff_read on public.modules for select to authenticated using(private.has_role(array['editor','admin']::public.app_role[]));
create policy staff_insert on public.modules for insert to authenticated with check(private.has_role(array['admin']::public.app_role[]) or (private.has_role(array['editor']::public.app_role[]) and exists(select 1 from public.courses c where c.id=course_id and c.status in ('draft','review'))));
create policy staff_update on public.modules for update to authenticated using(private.has_role(array['admin']::public.app_role[]) or (private.has_role(array['editor']::public.app_role[]) and exists(select 1 from public.courses c where c.id=course_id and c.status in ('draft','review')))) with check(private.has_role(array['admin']::public.app_role[]) or (private.has_role(array['editor']::public.app_role[]) and exists(select 1 from public.courses c where c.id=course_id and c.status in ('draft','review'))));
create policy admin_delete on public.modules for delete to authenticated using(private.has_role(array['admin']::public.app_role[]));
grant insert,update,delete on public.quizzes to authenticated;
create policy staff_read on public.quizzes for select to authenticated using(private.has_role(array['editor','admin']::public.app_role[]));
create policy staff_insert on public.quizzes for insert to authenticated with check(private.has_role(array['admin']::public.app_role[]) or (private.has_role(array['editor']::public.app_role[]) and (exists(select 1 from public.lessons l where l.id=lesson_id and l.status in ('draft','review')) or exists(select 1 from public.modules m join public.courses c on c.id=m.course_id where m.id=module_id and c.status in ('draft','review')))));
create policy staff_update on public.quizzes for update to authenticated using(private.has_role(array['admin']::public.app_role[]) or (private.has_role(array['editor']::public.app_role[]) and (exists(select 1 from public.lessons l where l.id=lesson_id and l.status in ('draft','review')) or exists(select 1 from public.modules m join public.courses c on c.id=m.course_id where m.id=module_id and c.status in ('draft','review'))))) with check(private.has_role(array['admin']::public.app_role[]) or (private.has_role(array['editor']::public.app_role[]) and (exists(select 1 from public.lessons l where l.id=lesson_id and l.status in ('draft','review')) or exists(select 1 from public.modules m join public.courses c on c.id=m.course_id where m.id=module_id and c.status in ('draft','review')))));
create policy admin_delete on public.quizzes for delete to authenticated using(private.has_role(array['admin']::public.app_role[]));
grant insert,update,delete on public.questions to authenticated;
create policy staff_read on public.questions for select to authenticated using(private.has_role(array['editor','admin']::public.app_role[]));
create policy staff_insert on public.questions for insert to authenticated with check(private.has_role(array['admin']::public.app_role[]) or (private.has_role(array['editor']::public.app_role[]) and exists(select 1 from public.quizzes q left join public.lessons l on l.id=q.lesson_id left join public.modules m on m.id=q.module_id left join public.courses c on c.id=m.course_id where q.id=quiz_id and (l.status in ('draft','review') or c.status in ('draft','review')))));
create policy staff_update on public.questions for update to authenticated using(private.has_role(array['admin']::public.app_role[]) or (private.has_role(array['editor']::public.app_role[]) and exists(select 1 from public.quizzes q left join public.lessons l on l.id=q.lesson_id left join public.modules m on m.id=q.module_id left join public.courses c on c.id=m.course_id where q.id=quiz_id and (l.status in ('draft','review') or c.status in ('draft','review'))))) with check(private.has_role(array['admin']::public.app_role[]) or (private.has_role(array['editor']::public.app_role[]) and exists(select 1 from public.quizzes q left join public.lessons l on l.id=q.lesson_id left join public.modules m on m.id=q.module_id left join public.courses c on c.id=m.course_id where q.id=quiz_id and (l.status in ('draft','review') or c.status in ('draft','review')))));
create policy admin_delete on public.questions for delete to authenticated using(private.has_role(array['admin']::public.app_role[]));
grant insert,update,delete on public.assignments to authenticated;
create policy staff_read on public.assignments for select to authenticated using(private.has_role(array['editor','admin']::public.app_role[]));
create policy staff_insert on public.assignments for insert to authenticated with check(private.has_role(array['admin']::public.app_role[]) or (private.has_role(array['editor']::public.app_role[]) and exists(select 1 from public.lessons l where l.id=lesson_id and l.status in ('draft','review'))));
create policy staff_update on public.assignments for update to authenticated using(private.has_role(array['admin']::public.app_role[]) or (private.has_role(array['editor']::public.app_role[]) and exists(select 1 from public.lessons l where l.id=lesson_id and l.status in ('draft','review')))) with check(private.has_role(array['admin']::public.app_role[]) or (private.has_role(array['editor']::public.app_role[]) and exists(select 1 from public.lessons l where l.id=lesson_id and l.status in ('draft','review'))));
create policy admin_delete on public.assignments for delete to authenticated using(private.has_role(array['admin']::public.app_role[]));

-- Video verification controls published rendering; reserve mutation to MFA administrators.
grant insert,update,delete on public.video_resources to authenticated;
create policy admin_video_manage on public.video_resources for all to authenticated using(private.has_role(array['admin']::public.app_role[])) with check(private.has_role(array['admin']::public.app_role[]));
create index on public.modules(course_id);
create index on public.lessons(module_id);
create index on public.enrollments(course_id);
create index on public.lesson_progress(lesson_id);
create index on public.notes(lesson_id);
create index on public.bookmarks(lesson_id);
create index on public.quizzes(lesson_id);
create index on public.quizzes(module_id);
create index on public.questions(quiz_id);
create index on public.quiz_attempts(user_id);
create index on public.quiz_attempts(quiz_id);
create index on public.assignments(lesson_id);
create index on public.submissions(user_id);
create index on public.certificates(course_id);
create index on public.consent_records(user_id);
create index on public.affiliate_events(tool_id);
create index on public.audit_logs(actor_id);
