create table if not exists public.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  teacher_profile_id uuid references public.user_profiles(id) on delete set null,
  attendance_date date not null,
  status text not null default 'submitted' check (status in ('draft', 'submitted')),
  notes text not null default '',
  created_by_profile_id uuid references public.user_profiles(id) on delete set null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (class_id, attendance_date)
);

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.attendance_sessions(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  status text not null check (status in ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED')),
  remarks text not null default '',
  marked_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (session_id, student_id)
);

create index if not exists attendance_sessions_class_date_idx on public.attendance_sessions(class_id, attendance_date);
create index if not exists attendance_sessions_teacher_idx on public.attendance_sessions(teacher_profile_id);
create index if not exists attendance_records_session_idx on public.attendance_records(session_id);
create index if not exists attendance_records_student_idx on public.attendance_records(student_id);

alter table public.attendance_sessions enable row level security;
alter table public.attendance_records enable row level security;

drop trigger if exists set_attendance_sessions_updated_at on public.attendance_sessions;
create trigger set_attendance_sessions_updated_at
before update on public.attendance_sessions
for each row execute function public.set_updated_at();

drop trigger if exists set_attendance_records_updated_at on public.attendance_records;
create trigger set_attendance_records_updated_at
before update on public.attendance_records
for each row execute function public.set_updated_at();

grant select, insert, update, delete on public.attendance_sessions to authenticated;
grant select, insert, update, delete on public.attendance_records to authenticated;

create policy "School admins can manage attendance sessions"
on public.attendance_sessions
for all
to authenticated
using (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = any (array['SUPER_ADMIN'::text, 'BRANCH_ADMIN'::text]))
with check (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = any (array['SUPER_ADMIN'::text, 'BRANCH_ADMIN'::text]));

create policy "Assigned teachers can manage attendance sessions"
on public.attendance_sessions
for all
to authenticated
using (
  exists (
    select 1
    from public.user_profiles teacher_profile
    where teacher_profile.id = attendance_sessions.teacher_profile_id
      and teacher_profile.auth_user_id = auth.uid()
      and teacher_profile.role = 'TEACHER'
  )
)
with check (
  exists (
    select 1
    from public.classes c
    join public.user_profiles teacher_profile on teacher_profile.id = c.teacher_profile_id
    where c.id = attendance_sessions.class_id
      and teacher_profile.auth_user_id = auth.uid()
      and teacher_profile.role = 'TEACHER'
  )
);

create policy "Students and parents can read linked attendance sessions"
on public.attendance_sessions
for select
to authenticated
using (
  exists (
    select 1
    from public.students s
    left join public.user_profiles student_profile on student_profile.id = s.user_profile_id
    left join public.user_profiles parent_profile on parent_profile.id = s.parent_profile_id
    where s.class_id = attendance_sessions.class_id
      and (student_profile.auth_user_id = auth.uid() or parent_profile.auth_user_id = auth.uid())
  )
);

create policy "School admins can manage attendance records"
on public.attendance_records
for all
to authenticated
using (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = any (array['SUPER_ADMIN'::text, 'BRANCH_ADMIN'::text]))
with check (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = any (array['SUPER_ADMIN'::text, 'BRANCH_ADMIN'::text]));

create policy "Assigned teachers can manage attendance records"
on public.attendance_records
for all
to authenticated
using (
  exists (
    select 1
    from public.attendance_sessions session
    join public.user_profiles teacher_profile on teacher_profile.id = session.teacher_profile_id
    where session.id = attendance_records.session_id
      and teacher_profile.auth_user_id = auth.uid()
      and teacher_profile.role = 'TEACHER'
  )
)
with check (
  exists (
    select 1
    from public.attendance_sessions session
    join public.user_profiles teacher_profile on teacher_profile.id = session.teacher_profile_id
    where session.id = attendance_records.session_id
      and teacher_profile.auth_user_id = auth.uid()
      and teacher_profile.role = 'TEACHER'
  )
);

create policy "Students and parents can read linked attendance records"
on public.attendance_records
for select
to authenticated
using (
  exists (
    select 1
    from public.students s
    left join public.user_profiles student_profile on student_profile.id = s.user_profile_id
    left join public.user_profiles parent_profile on parent_profile.id = s.parent_profile_id
    where s.id = attendance_records.student_id
      and (student_profile.auth_user_id = auth.uid() or parent_profile.auth_user_id = auth.uid())
  )
);
