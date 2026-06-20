-- Kulex — schema inicial (Supabase self-hosted)
-- Alinhado com docs/database-schema.md (fase 1: identidade, contas, movimentos, notificações)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tipos enumerados
-- ---------------------------------------------------------------------------

create type public.account_kind as enum ('personal', 'agent', 'business');
create type public.account_status as enum ('active', 'suspended', 'pending_kyc');
create type public.kyc_status as enum ('pendente', 'verificado');
create type public.movement_type as enum ('credit', 'debit');
create type public.notification_kind as enum (
  'transfer', 'payment', 'remittance', 'kyc', 'credit', 'card', 'system'
);

-- ---------------------------------------------------------------------------
-- Perfis (extensão de auth.users)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  phone text,
  country_code char(2) not null default 'AO',
  pin_hash text,
  full_name text,
  nickname text,
  birth_date date,
  gender text,
  nationality text,
  id_document_type text,
  id_number text,
  nif text,
  address text,
  kyc_status public.kyc_status not null default 'pendente',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_phone_idx on public.profiles (phone);

-- ---------------------------------------------------------------------------
-- Contas Kulex
-- ---------------------------------------------------------------------------

create table public.kulex_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind public.account_kind not null,
  name text not null,
  membership_id text not null unique,
  balance_cents bigint not null default 0 check (balance_cents >= 0),
  initials varchar(4) not null default 'KX',
  color char(7) not null default '#1A1A4E',
  avatar_url text,
  status public.account_status not null default 'pending_kyc',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index kulex_accounts_user_id_idx on public.kulex_accounts (user_id);
create unique index kulex_accounts_user_kind_idx on public.kulex_accounts (user_id, kind);

-- ---------------------------------------------------------------------------
-- Perfis por conta
-- ---------------------------------------------------------------------------

create table public.personal_data_profiles (
  account_id uuid primary key references public.kulex_accounts (id) on delete cascade,
  email text,
  phone text,
  full_name text,
  nickname text,
  birth_date date,
  gender text,
  nationality text,
  id_document_type text,
  id_number text,
  nif text,
  address text,
  membership_id text,
  kyc_status text,
  updated_at timestamptz not null default now()
);

create table public.business_profiles (
  account_id uuid primary key references public.kulex_accounts (id) on delete cascade,
  company_name text not null,
  trade_name text,
  location text,
  nif text,
  business_type text not null default 'company' check (business_type in ('individual', 'company')),
  kyb_status public.kyc_status not null default 'pendente',
  simplified_invoices_used int not null default 0,
  simplified_invoices_limit int not null default 300,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Movimentos e notificações
-- ---------------------------------------------------------------------------

create table public.movements (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.kulex_accounts (id) on delete cascade,
  title text not null,
  amount_cents bigint not null check (amount_cents > 0),
  type public.movement_type not null,
  iso_date date not null default current_date,
  reference text,
  status text not null default 'Concluído',
  channel text,
  category text,
  type_label text,
  created_at timestamptz not null default now()
);

create index movements_account_id_idx on public.movements (account_id, iso_date desc);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.kulex_accounts (id) on delete cascade,
  kind public.notification_kind not null default 'system',
  title text not null,
  message text not null,
  read boolean not null default false,
  action_href text,
  created_at timestamptz not null default now()
);

create index notifications_account_id_idx on public.notifications (account_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Kulex Score
-- ---------------------------------------------------------------------------

create table public.kulex_scores (
  user_id uuid primary key references auth.users (id) on delete cascade,
  score int not null default 0 check (score between 0 and 1000),
  tier text not null default 'bronze',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Funções auxiliares
-- ---------------------------------------------------------------------------

create or replace function public.generate_membership_id()
returns text
language plpgsql
as $$
declare
  candidate text;
begin
  loop
    candidate := 'KLX-' || lpad((floor(random() * 100000000))::text, 8, '0');
    exit when not exists (
      select 1 from public.kulex_accounts where membership_id = candidate
    );
  end loop;
  return candidate;
end;
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

create trigger kulex_accounts_updated_at
  before update on public.kulex_accounts
  for each row execute function public.touch_updated_at();

create or replace function public.account_kind_label(p_kind public.account_kind)
returns text
language sql
immutable
as $$
  select case p_kind
    when 'personal' then 'Conta Pessoal'
    when 'agent' then 'Conta Agente'
    when 'business' then 'Conta Empresa'
  end;
$$;

create or replace function public.account_initials(p_name text)
returns varchar(4)
language sql
immutable
as $$
  select upper(
    coalesce(
      left(split_part(trim(p_name), ' ', 1), 1) ||
      left(split_part(trim(p_name), ' ', 2), 1),
      'KX'
    )
  )::varchar(4);
$$;

create or replace function public.account_color(p_kind public.account_kind)
returns char(7)
language sql
immutable
as $$
  select case p_kind
    when 'personal' then '#2FB7A9'
    when 'agent' then '#C9A227'
    when 'business' then '#1A1A4E'
  end::char(7);
$$;

-- Registo pós-signup (chamado pelo cliente após auth.signUp)
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
    user_id,
    kind,
    name,
    membership_id,
    initials,
    color,
    status
  )
  values (
    v_user_id,
    p_account_kind,
    v_name,
    v_membership_id,
    public.account_initials(v_name),
    public.account_color(p_account_kind),
    'pending_kyc'
  )
  on conflict (user_id, kind) do update set
    name = excluded.name,
    updated_at = now()
  returning id into v_account_id;

  if p_account_kind in ('personal', 'agent') then
    insert into public.personal_data_profiles (
      account_id,
      email,
      phone,
      full_name,
      membership_id,
      kyc_status
    )
    values (
      v_account_id,
      v_email,
      nullif(trim(p_phone), ''),
      v_name,
      v_membership_id,
      'pendente'
    )
    on conflict (account_id) do update set
      email = excluded.email,
      phone = excluded.phone,
      full_name = excluded.full_name,
      updated_at = now();
  elsif p_account_kind = 'business' then
    insert into public.business_profiles (account_id, company_name)
    values (v_account_id, v_name)
    on conflict (account_id) do update set
      company_name = excluded.company_name,
      updated_at = now();
  end if;

  insert into public.kulex_scores (user_id)
  values (v_user_id)
  on conflict (user_id) do nothing;

  insert into public.notifications (account_id, kind, title, message, action_href)
  values (
    v_account_id,
    'kyc',
    'Verificação pendente',
    'Complete a verificação KYC para desbloquear todos os serviços.',
    '/kyc'
  );

  return v_account_id;
end;
$$;

create or replace function public.verify_user_pin(p_pin text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_hash text;
begin
  if v_user_id is null then
    return false;
  end if;

  select pin_hash into v_hash from public.profiles where id = v_user_id;

  if v_hash is null then
    return false;
  end if;

  return v_hash = crypt(p_pin, v_hash);
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.kulex_accounts enable row level security;
alter table public.personal_data_profiles enable row level security;
alter table public.business_profiles enable row level security;
alter table public.movements enable row level security;
alter table public.notifications enable row level security;
alter table public.kulex_scores enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "kulex_accounts_select_own"
  on public.kulex_accounts for select
  using (auth.uid() = user_id);

create policy "kulex_accounts_update_own"
  on public.kulex_accounts for update
  using (auth.uid() = user_id);

create policy "personal_data_select_own"
  on public.personal_data_profiles for select
  using (
    exists (
      select 1 from public.kulex_accounts a
      where a.id = account_id and a.user_id = auth.uid()
    )
  );

create policy "personal_data_update_own"
  on public.personal_data_profiles for update
  using (
    exists (
      select 1 from public.kulex_accounts a
      where a.id = account_id and a.user_id = auth.uid()
    )
  );

create policy "business_profiles_select_own"
  on public.business_profiles for select
  using (
    exists (
      select 1 from public.kulex_accounts a
      where a.id = account_id and a.user_id = auth.uid()
    )
  );

create policy "business_profiles_update_own"
  on public.business_profiles for update
  using (
    exists (
      select 1 from public.kulex_accounts a
      where a.id = account_id and a.user_id = auth.uid()
    )
  );

create policy "movements_select_own"
  on public.movements for select
  using (
    exists (
      select 1 from public.kulex_accounts a
      where a.id = account_id and a.user_id = auth.uid()
    )
  );

create policy "notifications_select_own"
  on public.notifications for select
  using (
    exists (
      select 1 from public.kulex_accounts a
      where a.id = account_id and a.user_id = auth.uid()
    )
  );

create policy "notifications_update_own"
  on public.notifications for update
  using (
    exists (
      select 1 from public.kulex_accounts a
      where a.id = account_id and a.user_id = auth.uid()
    )
  );

create policy "kulex_scores_select_own"
  on public.kulex_scores for select
  using (auth.uid() = user_id);

grant usage on schema public to anon, authenticated, service_role;
grant execute on function public.register_kulex_user(text, text, public.account_kind, text, text) to authenticated;
grant execute on function public.verify_user_pin(text) to authenticated;
