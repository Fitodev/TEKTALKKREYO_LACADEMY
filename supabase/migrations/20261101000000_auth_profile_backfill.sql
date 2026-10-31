-- Apply after the foundation migration. Existing Auth accounts must also have a profile.
create or replace function private.on_signup() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
 insert into public.profiles(id,display_name)
 values(new.id,left(coalesce(
   nullif(trim(new.raw_user_meta_data->>'display_name'),''),
   nullif(trim(new.raw_user_meta_data->>'full_name'),''),
   nullif(trim(new.raw_user_meta_data->>'name'),''),'Elèv'),80));
 return new;
end;
$$;
revoke all on function private.on_signup() from public;

-- Omit role deliberately: the trusted database default is always student.
-- Preserve existing profiles, including their reviewed roles and display names.
insert into public.profiles(id,display_name)
select id,left(coalesce(
 nullif(trim(raw_user_meta_data->>'display_name'),''),
 nullif(trim(raw_user_meta_data->>'full_name'),''),
 nullif(trim(raw_user_meta_data->>'name'),''),'Elèv'),80)
from auth.users
on conflict(id) do nothing;
