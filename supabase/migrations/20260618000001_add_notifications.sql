create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  target_profile_id uuid not null references public.user_profiles(id) on delete cascade,
  created_by_profile_id uuid references public.user_profiles(id) on delete set null,
  type text not null default 'system',
  priority text not null default 'normal',
  title text not null,
  message text not null default '',
  entity_type text not null default '',
  entity_id text not null default '',
  action_url text not null default '',
  read_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notifications_type_check check (
    type = any (array[
      'system',
      'announcement',
      'attendance',
      'fees',
      'payment',
      'challan',
      'student',
      'teacher',
      'schedule',
      'message',
      'exam',
      'result',
      'admission',
      'profile',
      'security'
    ])
  ),
  constraint notifications_priority_check check (
    priority = any (array['low', 'normal', 'high', 'urgent'])
  )
);

create index if not exists notifications_target_profile_id_idx on public.notifications(target_profile_id);
create index if not exists notifications_created_at_idx on public.notifications(created_at desc);
create index if not exists notifications_read_at_idx on public.notifications(read_at);
create index if not exists notifications_type_idx on public.notifications(type);

drop trigger if exists notifications_set_updated_at on public.notifications;
create trigger notifications_set_updated_at
  before update on public.notifications
  for each row
  execute function public.set_updated_at();

alter table public.notifications enable row level security;

drop policy if exists "Users can read their notifications" on public.notifications;
create policy "Users can read their notifications"
  on public.notifications
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.user_profiles profile
      where profile.id = notifications.target_profile_id
        and profile.auth_user_id = auth.uid()
    )
    or (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = any (array['SUPER_ADMIN'::text, 'BRANCH_ADMIN'::text]))
  );

drop policy if exists "Users can update their notification read state" on public.notifications;
create policy "Users can update their notification read state"
  on public.notifications
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.user_profiles profile
      where profile.id = notifications.target_profile_id
        and profile.auth_user_id = auth.uid()
    )
    or (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = any (array['SUPER_ADMIN'::text, 'BRANCH_ADMIN'::text]))
  )
  with check (
    exists (
      select 1
      from public.user_profiles profile
      where profile.id = notifications.target_profile_id
        and profile.auth_user_id = auth.uid()
    )
    or (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = any (array['SUPER_ADMIN'::text, 'BRANCH_ADMIN'::text]))
  );

drop policy if exists "School admins can manage notifications" on public.notifications;
create policy "School admins can manage notifications"
  on public.notifications
  for all
  to authenticated
  using (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = any (array['SUPER_ADMIN'::text, 'BRANCH_ADMIN'::text]))
  with check (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = any (array['SUPER_ADMIN'::text, 'BRANCH_ADMIN'::text]));

grant select, insert, update, delete on public.notifications to authenticated;
