create table if not exists public.fee_payments (
  id uuid primary key default gen_random_uuid(),
  receipt_number text not null unique,
  challan_id uuid not null references public.fee_challans(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  parent_profile_id uuid references public.user_profiles(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  class_id uuid references public.classes(id) on delete set null,
  amount numeric not null default 0 check (amount >= 0),
  payment_method text not null default 'cash',
  payment_date date not null default current_date,
  received_from text not null default '',
  reference_number text not null default '',
  notes text not null default '',
  received_by_profile_id uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fee_payments_challan_id_idx on public.fee_payments(challan_id);
create index if not exists fee_payments_student_id_idx on public.fee_payments(student_id);
create index if not exists fee_payments_parent_profile_id_idx on public.fee_payments(parent_profile_id);
create index if not exists fee_payments_branch_id_idx on public.fee_payments(branch_id);
create index if not exists fee_payments_payment_date_idx on public.fee_payments(payment_date);

drop trigger if exists fee_payments_set_updated_at on public.fee_payments;
create trigger fee_payments_set_updated_at
  before update on public.fee_payments
  for each row
  execute function public.set_updated_at();

alter table public.fee_payments enable row level security;

drop policy if exists "School admins can manage fee payments" on public.fee_payments;
create policy "School admins can manage fee payments"
  on public.fee_payments
  for all
  to authenticated
  using (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = any (array['SUPER_ADMIN'::text, 'BRANCH_ADMIN'::text]))
  with check (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = any (array['SUPER_ADMIN'::text, 'BRANCH_ADMIN'::text]));

drop policy if exists "Students and parents can read linked fee payments" on public.fee_payments;
create policy "Students and parents can read linked fee payments"
  on public.fee_payments
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.students s
      join public.user_profiles student_profile on student_profile.id = s.user_profile_id
      where s.id = fee_payments.student_id
        and student_profile.auth_user_id = auth.uid()
    )
    or exists (
      select 1
      from public.students s
      join public.user_profiles parent_profile on parent_profile.id = s.parent_profile_id
      where s.id = fee_payments.student_id
        and parent_profile.auth_user_id = auth.uid()
    )
  );

grant select, insert, update, delete on public.fee_payments to authenticated;
