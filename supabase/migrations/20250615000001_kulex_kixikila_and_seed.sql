-- Kulex — Kixikila, seed de movimentos demo e funções de participação

-- ---------------------------------------------------------------------------
-- Tipos Kixikila
-- ---------------------------------------------------------------------------

create type public.kixikila_source as enum ('user', 'platform');
create type public.kixikila_status as enum ('pending', 'active', 'completed');
create type public.kixikila_frequency as enum ('diaria', 'semanal', 'mensal');
create type public.kixikila_role as enum ('organizer', 'member');
create type public.kixikila_commission_mode as enum ('deduct_from_pool', 'separate_accounts');

create table public.kixikilas (
  id text primary key,
  title text not null,
  description text,
  source public.kixikila_source not null default 'platform',
  organizer_account_id uuid references public.kulex_accounts (id) on delete set null,
  status public.kixikila_status not null default 'pending',
  balance_cents bigint not null default 0 check (balance_cents >= 0),
  invite_code text not null default '',
  amount_per_member_cents bigint not null check (amount_per_member_cents > 0),
  member_capacity int not null check (member_capacity >= 2),
  current_members int not null default 0 check (current_members >= 0),
  debit_day smallint not null default 5 check (debit_day between 1 and 22),
  duration_months int not null default 5,
  frequency public.kixikila_frequency not null default 'mensal',
  protection text not null default 'Com seguro',
  commission_mode public.kixikila_commission_mode not null default 'deduct_from_pool',
  next_receiver_order int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kixikila_memberships (
  id uuid primary key default gen_random_uuid(),
  kixikila_id text not null references public.kixikilas (id) on delete cascade,
  account_id uuid not null references public.kulex_accounts (id) on delete cascade,
  role public.kixikila_role not null default 'member',
  participant_order int,
  joined_at timestamptz not null default now(),
  unique (kixikila_id, account_id)
);

create index kixikila_memberships_account_idx on public.kixikila_memberships (account_id);

create table public.kixikila_participants (
  id text not null,
  kixikila_id text not null references public.kixikilas (id) on delete cascade,
  account_id uuid references public.kulex_accounts (id) on delete set null,
  display_name text not null,
  initials varchar(4) not null,
  color char(7) not null,
  participant_order int not null,
  role public.kixikila_role not null default 'member',
  is_anonymous boolean not null default false,
  is_slot boolean not null default false,
  contributed boolean not null default false,
  primary key (kixikila_id, id)
);

-- ---------------------------------------------------------------------------
-- Seed: Kixikilas da plataforma Kulex
-- ---------------------------------------------------------------------------

insert into public.kixikilas (
  id, title, description, source, status,
  amount_per_member_cents, member_capacity, current_members,
  debit_day, duration_months, frequency, protection, commission_mode, next_receiver_order
) values
  (
    'kulex-20k',
    'Kixikila Família 20.000',
    'Grupo mensal gerido pela Kulex. Participantes anónimos.',
    'platform', 'pending',
    2000000, 5, 3,
    5, 5, 'mensal', 'Com seguro', 'deduct_from_pool', 1
  ),
  (
    'kulex-50k',
    'Kixikila Empreendedor 50.000',
    'Ideal para pequenos negócios. Identidades protegidas.',
    'platform', 'pending',
    5000000, 8, 6,
    5, 8, 'mensal', 'Com seguro', 'deduct_from_pool', 2
  ),
  (
    'kulex-100k',
    'Kixikila Premium 100.000',
    'Grupo de maior valor com gestão automática pela Kulex.',
    'platform', 'active',
    10000000, 10, 7,
    5, 10, 'mensal', 'Com seguro', 'deduct_from_pool', 4
  )
on conflict (id) do nothing;

-- Participantes anónimos (slots + placeholders)
insert into public.kixikila_participants (
  id, kixikila_id, display_name, initials, color, participant_order, is_anonymous, is_slot, contributed
)
select
  'participant-' || gs,
  k.id,
  case when gs <= k.current_members then 'Participante ' || gs else 'Vaga ' || gs end,
  lpad(gs::text, 2, '0'),
  (array['#2FB7A9','#D6D64A','#2F78B7','#EC4899','#F97316','#8B5CF6','#14B8A6','#F59E0B','#6366F1','#EF4444'])[1 + ((gs - 1) % 10)],
  gs,
  true,
  gs > k.current_members,
  gs < k.next_receiver_order
from public.kixikilas k
cross join generate_series(1, k.member_capacity) gs
where k.source = 'platform'
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Movimentos demo ao criar conta
-- ---------------------------------------------------------------------------

create or replace function public.seed_demo_movements(p_account_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.movements where account_id = p_account_id limit 1) then
    return;
  end if;

  insert into public.movements (
    account_id, title, amount_cents, type, iso_date, reference, status, channel, category, type_label, created_at
  ) values
    (p_account_id, 'Transferência recebida', 1500000, 'credit', current_date - 1, 'TW-2026-004821', 'Concluído', 'App Kulex', 'transferências', 'Crédito', now() - interval '1 hour'),
    (p_account_id, 'Pagamento Serviço', 1081100, 'debit', current_date - 5, 'TW-2026-004715', 'Concluído', 'App Kulex', 'serviços', 'Débito', now() - interval '5 days'),
    (p_account_id, 'Remessa', 39563080, 'debit', current_date - 12, 'RMX-2026-001204', 'Concluído', 'App Kulex', 'remessas', 'Débito', now() - interval '12 days'),
    (p_account_id, 'Depósito Multicaixa', 12000000, 'credit', current_date - 18, 'TW-2026-004102', 'Concluído', 'App Kulex', 'depósitos', 'Crédito', now() - interval '18 days'),
    (p_account_id, 'Pagamento KWIK', 425000, 'debit', current_date - 20, 'TW-2026-004089', 'Concluído', 'App Kulex', 'serviços', 'Débito', now() - interval '20 days');

  update public.kulex_accounts
  set balance_cents = 82541556
  where id = p_account_id;
end;
$$;

-- Actualizar registo para incluir movimentos demo
create or replace function public.register_kulex_user(
  p_phone text,
  p_country_code text,
  p_account_kind public.account_kind,
  p_pin text,
  p_full_name text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_account_id uuid;
  v_membership_id text;
  v_name text;
  v_email text;
begin
  if v_user_id is null then
    raise exception 'Não autenticado';
  end if;

  if p_pin is null or length(p_pin) <> 4 or p_pin !~ '^\d{4}$' then
    raise exception 'PIN inválido';
  end if;

  select email into v_email from auth.users where id = v_user_id;
  v_name := coalesce(nullif(trim(p_full_name), ''), 'Utilizador Kulex');
  v_membership_id := public.generate_membership_id();

  insert into public.profiles (id, phone, country_code, full_name, pin_hash)
  values (
    v_user_id,
    nullif(trim(p_phone), ''),
    upper(coalesce(nullif(trim(p_country_code), ''), 'AO')),
    v_name,
    crypt(p_pin, gen_salt('bf'))
  )
  on conflict (id) do update set
    phone = excluded.phone,
    country_code = excluded.country_code,
    full_name = excluded.full_name,
    pin_hash = excluded.pin_hash,
    updated_at = now();

  insert into public.kulex_accounts (
    user_id, kind, name, membership_id, initials, color, status
  )
  values (
    v_user_id, p_account_kind, v_name, v_membership_id,
    public.account_initials(v_name), public.account_color(p_account_kind), 'pending_kyc'
  )
  on conflict (user_id, kind) do update set
    name = excluded.name, updated_at = now()
  returning id into v_account_id;

  if p_account_kind in ('personal', 'agent') then
    insert into public.personal_data_profiles (
      account_id, email, phone, full_name, membership_id, kyc_status
    )
    values (v_account_id, v_email, nullif(trim(p_phone), ''), v_name, v_membership_id, 'pendente')
    on conflict (account_id) do update set
      email = excluded.email, phone = excluded.phone, full_name = excluded.full_name, updated_at = now();
  elsif p_account_kind = 'business' then
    insert into public.business_profiles (account_id, company_name)
    values (v_account_id, v_name)
    on conflict (account_id) do update set company_name = excluded.company_name, updated_at = now();
  end if;

  insert into public.kulex_scores (user_id) values (v_user_id) on conflict (user_id) do nothing;

  insert into public.notifications (account_id, kind, title, message, action_href)
  values (
    v_account_id, 'kyc', 'Verificação pendente',
    'Complete a verificação KYC para desbloquear todos os serviços.', '/kyc'
  );

  perform public.seed_demo_movements(v_account_id);

  return v_account_id;
end;
$$;

-- Participar numa Kixikila Kulex
create or replace function public.join_platform_kixikila(p_kixikila_id text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_account_id uuid;
  v_kixikila public.kixikilas%rowtype;
  v_slot_id text;
  v_order int;
  v_membership_id uuid;
begin
  if v_user_id is null then
    raise exception 'Não autenticado';
  end if;

  select id into v_account_id
  from public.kulex_accounts
  where user_id = v_user_id and kind = 'personal'
  limit 1;

  if v_account_id is null then
    raise exception 'Conta pessoal não encontrada';
  end if;

  select * into v_kixikila
  from public.kixikilas
  where id = p_kixikila_id and source = 'platform';

  if not found then
    raise exception 'Kixikila não encontrada';
  end if;

  if exists (
    select 1 from public.kixikila_memberships
    where kixikila_id = p_kixikila_id and account_id = v_account_id
  ) then
    raise exception 'Já participa nesta Kixikila';
  end if;

  if v_kixikila.current_members >= v_kixikila.member_capacity then
    raise exception 'Grupo completo';
  end if;

  select id, participant_order into v_slot_id, v_order
  from public.kixikila_participants
  where kixikila_id = p_kixikila_id and is_slot = true
  order by participant_order
  limit 1
  for update;

  if v_slot_id is null then
    v_order := v_kixikila.current_members + 1;
    v_slot_id := 'participant-' || v_order;
    insert into public.kixikila_participants (
      id, kixikila_id, account_id, display_name, initials, color,
      participant_order, is_anonymous, is_slot, contributed
    ) values (
      v_slot_id, p_kixikila_id, v_account_id, 'Tu', 'TU',
      public.account_color('personal'::public.account_kind),
      v_order, true, false, false
    );
  else
    update public.kixikila_participants
    set account_id = v_account_id, display_name = 'Tu', initials = 'TU', is_slot = false
    where kixikila_id = p_kixikila_id and id = v_slot_id;
  end if;

  insert into public.kixikila_memberships (kixikila_id, account_id, role, participant_order)
  values (p_kixikila_id, v_account_id, 'member', v_order)
  returning id into v_membership_id;

  update public.kixikilas
  set
    current_members = current_members + 1,
    status = case when current_members + 1 >= member_capacity then 'active'::public.kixikila_status else status end,
    updated_at = now()
  where id = p_kixikila_id;

  insert into public.notifications (account_id, kind, title, message, action_href)
  values (
    v_account_id, 'system', 'Kixikila confirmada',
    'Entrou no grupo ' || v_kixikila.title || '.', '/kixikila/' || p_kixikila_id
  );

  return v_membership_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS Kixikila
-- ---------------------------------------------------------------------------

alter table public.kixikilas enable row level security;
alter table public.kixikila_memberships enable row level security;
alter table public.kixikila_participants enable row level security;

create policy "kixikilas_select_all"
  on public.kixikilas for select using (true);

create policy "kixikila_participants_select_all"
  on public.kixikila_participants for select using (true);

create policy "kixikila_memberships_select_own"
  on public.kixikila_memberships for select
  using (
    exists (
      select 1 from public.kulex_accounts a
      where a.id = account_id and a.user_id = auth.uid()
    )
  );

create policy "kixikila_memberships_insert_own"
  on public.kixikila_memberships for insert
  with check (
    exists (
      select 1 from public.kulex_accounts a
      where a.id = account_id and a.user_id = auth.uid()
    )
  );

grant execute on function public.seed_demo_movements(uuid) to service_role;
grant execute on function public.join_platform_kixikila(text) to authenticated;
