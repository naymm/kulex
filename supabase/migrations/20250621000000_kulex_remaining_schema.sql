-- Kulex — schema completo (tabelas em falta vs docs/database-schema.md)
-- Fase 3: cartões, crédito, transferências, remessas, business, agente, catálogos

-- ---------------------------------------------------------------------------
-- Tipos adicionais
-- ---------------------------------------------------------------------------

do $$ begin create type public.wallet_card_type as enum ('prepaid', 'postpaid'); exception when duplicate_object then null; end $$;
do $$ begin create type public.wallet_card_status as enum ('active', 'blocked', 'pending'); exception when duplicate_object then null; end $$;
do $$ begin create type public.postpaid_bill_status as enum ('open', 'paid', 'overdue'); exception when duplicate_object then null; end $$;
do $$ begin create type public.score_band as enum ('insuficiente', 'regular', 'bom', 'muito_bom', 'excelente'); exception when duplicate_object then null; end $$;
do $$ begin create type public.scoring_impact as enum ('positive', 'neutral', 'negative'); exception when duplicate_object then null; end $$;
do $$ begin create type public.loan_status as enum ('active', 'settled', 'defaulted'); exception when duplicate_object then null; end $$;
do $$ begin create type public.advance_category as enum ('servico', 'referencia', 'estado', 'seguro', 'qrcode'); exception when duplicate_object then null; end $$;
do $$ begin create type public.stock_credit_status as enum ('active', 'expired', 'suspended'); exception when duplicate_object then null; end $$;
do $$ begin create type public.payment_tx_category as enum (
  'p2p', 'bank', 'kwik', 'internal', 'qr', 'reference', 'estado', 'servico',
  'seguro', 'jogo', 'add_money', 'withdraw', 'card_load', 'card_bill', 'remittance'
); exception when duplicate_object then null; end $$;
do $$ begin create type public.payment_funding_source as enum ('balance', 'credit'); exception when duplicate_object then null; end $$;
do $$ begin create type public.payment_tx_status as enum ('pending', 'completed', 'failed', 'cancelled'); exception when duplicate_object then null; end $$;
do $$ begin create type public.transfer_status as enum ('pending', 'completed', 'failed', 'cancelled'); exception when duplicate_object then null; end $$;
do $$ begin create type public.kwik_key_type as enum ('telemovel', 'email'); exception when duplicate_object then null; end $$;
do $$ begin create type public.remittance_in_status as enum ('creditado', 'pendente', 'em_processamento'); exception when duplicate_object then null; end $$;
do $$ begin create type public.remittance_out_status as enum ('entregue', 'em_processamento', 'cancelada'); exception when duplicate_object then null; end $$;
do $$ begin create type public.remittance_payout_method as enum ('bank', 'mobile', 'cash'); exception when duplicate_object then null; end $$;
do $$ begin create type public.remittance_fee_mode as enum ('deduct', 'add'); exception when duplicate_object then null; end $$;
do $$ begin create type public.kixikila_contribution_status as enum ('paid', 'pending', 'late'); exception when duplicate_object then null; end $$;
do $$ begin create type public.invoice_type as enum ('simplified', 'normal'); exception when duplicate_object then null; end $$;
do $$ begin create type public.vat_regime as enum ('general', 'reduced', 'exempt'); exception when duplicate_object then null; end $$;
do $$ begin create type public.invoice_status as enum ('draft', 'sent', 'paid', 'cancelled'); exception when duplicate_object then null; end $$;
do $$ begin create type public.business_tx_type as enum ('income', 'expense'); exception when duplicate_object then null; end $$;
do $$ begin create type public.agent_client_status as enum ('activo', 'pendente'); exception when duplicate_object then null; end $$;
do $$ begin create type public.agent_operation_type as enum ('activation', 'cash_in', 'cash_out', 'card_issue'); exception when duplicate_object then null; end $$;
do $$ begin create type public.my_account_kind as enum ('pessoal', 'agente', 'poupanca'); exception when duplicate_object then null; end $$;
do $$ begin create type public.postpaid_product_id as enum ('branco', 'verde', 'gold', 'prata', 'black'); exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Helper RLS
-- ---------------------------------------------------------------------------

create or replace function public.account_belongs_to_user(p_account_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.kulex_accounts
    where id = p_account_id and user_id = auth.uid()
  );
$$;

-- Extender kulex_scores
alter table public.kulex_scores
  add column if not exists previous_score int,
  add column if not exists band public.score_band;

-- ---------------------------------------------------------------------------
-- Sub-carteiras
-- ---------------------------------------------------------------------------

create table if not exists public.my_accounts (
  id public.my_account_kind not null,
  kulex_account_id uuid not null references public.kulex_accounts (id) on delete cascade,
  name text not null,
  balance_cents bigint not null default 0 check (balance_cents >= 0),
  icon text,
  primary key (kulex_account_id, id)
);

-- ---------------------------------------------------------------------------
-- Pagamentos agregados
-- ---------------------------------------------------------------------------

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.kulex_accounts (id) on delete cascade,
  movement_id uuid references public.movements (id) on delete set null,
  category public.payment_tx_category not null,
  amount_cents bigint not null check (amount_cents > 0),
  fee_cents bigint not null default 0 check (fee_cents >= 0),
  funding_source public.payment_funding_source not null default 'balance',
  status public.payment_tx_status not null default 'pending',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists payment_transactions_account_idx on public.payment_transactions (account_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Cartões
-- ---------------------------------------------------------------------------

create table if not exists public.postpaid_card_products (
  id public.postpaid_product_id primary key,
  min_score int not null default 0,
  min_plafond_cents bigint not null,
  max_plafond_cents bigint not null,
  range_label text not null
);

create table if not exists public.wallet_cards (
  id text primary key,
  account_id uuid not null references public.kulex_accounts (id) on delete cascade,
  card_type public.wallet_card_type not null,
  pan_masked varchar(20) not null,
  pan_encrypted bytea,
  expiry_month smallint,
  expiry_year smallint,
  cvv_encrypted bytea,
  holder_name text,
  billing_address text,
  status public.wallet_card_status not null default 'pending',
  product_id public.postpaid_product_id references public.postpaid_card_products (id),
  created_at timestamptz not null default now()
);

create index if not exists wallet_cards_account_idx on public.wallet_cards (account_id);

create table if not exists public.postpaid_wallet_states (
  card_id text primary key references public.wallet_cards (id) on delete cascade,
  plafond_cents bigint not null default 0,
  available_cents bigint not null default 0,
  used_cents bigint not null default 0,
  billing_cycle_closing_day smallint not null default 1,
  due_day smallint not null default 10,
  updated_at timestamptz not null default now()
);

create table if not exists public.postpaid_bills (
  id uuid primary key default gen_random_uuid(),
  card_id text not null references public.wallet_cards (id) on delete cascade,
  period_label text not null,
  closing_date date not null,
  due_date date not null,
  total_debt_cents bigint not null,
  minimum_payment_cents bigint not null,
  status public.postpaid_bill_status not null default 'open'
);

-- ---------------------------------------------------------------------------
-- Scoring
-- ---------------------------------------------------------------------------

create table if not exists public.scoring_factors (
  id text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  impact public.scoring_impact not null,
  points int not null default 0,
  max_points int not null default 0,
  primary key (user_id, id)
);

create table if not exists public.score_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  month_label text not null,
  score int not null,
  recorded_at timestamptz not null default now()
);

create index if not exists score_history_user_idx on public.score_history (user_id, recorded_at desc);

-- ---------------------------------------------------------------------------
-- Crédito
-- ---------------------------------------------------------------------------

create table if not exists public.credit_products (
  id text primary key,
  title text not null,
  montante_min_cents bigint not null,
  montante_max_cents bigint not null,
  prazo_dias int not null,
  comissao_percent numeric(8,4) not null default 0,
  iva_percent numeric(8,4) not null default 0,
  juro_mora_percent numeric(8,4) not null default 0,
  taeg_percent numeric(8,4) not null default 0
);

create table if not exists public.credit_loans (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.kulex_accounts (id) on delete cascade,
  product_id text not null references public.credit_products (id),
  principal_cents bigint not null,
  outstanding_cents bigint not null,
  term_days int not null,
  progress numeric(5,4) not null default 0,
  status public.loan_status not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.credit_advances (
  id text primary key,
  account_id uuid not null references public.kulex_accounts (id) on delete cascade,
  category public.advance_category not null,
  title text not null,
  description text,
  amount_cents bigint not null,
  due_date date not null,
  settled boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.business_stock_credit (
  account_id uuid primary key references public.kulex_accounts (id) on delete cascade,
  pre_approved_limit_cents bigint not null default 0,
  available_cents bigint not null default 0,
  used_cents bigint not null default 0,
  tan_percent numeric(8,4) not null default 0,
  term_days int not null default 30,
  next_renewal date,
  status public.stock_credit_status not null default 'active'
);

-- ---------------------------------------------------------------------------
-- Catálogos
-- ---------------------------------------------------------------------------

create table if not exists public.banks (
  id text primary key,
  name text not null,
  select_label text not null,
  logo_key text
);

create table if not exists public.payment_categories (
  id text primary key,
  title text not null,
  sort_order int not null default 0
);

create table if not exists public.telecom_providers (
  id text primary key,
  name text not null,
  logo_key text
);

create table if not exists public.telecom_products (
  id text primary key,
  provider_id text not null references public.telecom_providers (id) on delete cascade,
  label text not null,
  route text
);

create table if not exists public.telecom_values (
  id text primary key,
  product_id text not null references public.telecom_products (id) on delete cascade,
  label text not null,
  price_cents bigint not null
);

create table if not exists public.tv_providers (
  id text primary key,
  name text not null,
  logo_key text
);

create table if not exists public.tv_products (
  id text primary key,
  provider_id text not null references public.tv_providers (id) on delete cascade,
  label text not null,
  route text
);

create table if not exists public.tv_values (
  id text primary key,
  product_id text not null references public.tv_products (id) on delete cascade,
  label text not null,
  price_cents bigint not null
);

create table if not exists public.public_service_providers (
  id text primary key,
  name text not null,
  logo_key text
);

create table if not exists public.public_service_products (
  id text primary key,
  provider_id text not null references public.public_service_providers (id) on delete cascade,
  label text not null,
  route text
);

create table if not exists public.jogo_providers (
  id text primary key,
  label text not null,
  logo_url text
);

create table if not exists public.insurance_products (
  id text primary key,
  title text not null,
  route text
);

create table if not exists public.payment_entities (
  entity_code char(5) primary key,
  name text not null,
  category text
);

create table if not exists public.countries (
  code char(2) primary key,
  name text not null,
  dial_code text
);

create table if not exists public.score_bands (
  id public.score_band primary key,
  label text not null,
  min_score int not null,
  max_score int not null
);

-- ---------------------------------------------------------------------------
-- Transferências
-- ---------------------------------------------------------------------------

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  phone text,
  initials varchar(4),
  color char(7),
  avatar_url text,
  membership_id text,
  created_at timestamptz not null default now()
);

create index if not exists contacts_owner_idx on public.contacts (owner_user_id);

create table if not exists public.p2p_transfers (
  id uuid primary key default gen_random_uuid(),
  from_account_id uuid not null references public.kulex_accounts (id) on delete restrict,
  to_contact_id uuid references public.contacts (id) on delete set null,
  to_membership_id text,
  amount_cents bigint not null,
  reference text,
  receipt_data jsonb not null default '{}',
  status public.transfer_status not null default 'completed',
  created_at timestamptz not null default now()
);

create table if not exists public.bank_transfers (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.kulex_accounts (id) on delete restrict,
  bank_id text not null references public.banks (id),
  iban varchar(25) not null,
  titular text not null,
  amount_cents bigint not null,
  commission_cents bigint not null default 0,
  iva_cents bigint not null default 0,
  status public.transfer_status not null default 'pending',
  reference text,
  created_at timestamptz not null default now()
);

create table if not exists public.kwik_transfers (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.kulex_accounts (id) on delete restrict,
  key_type public.kwik_key_type not null,
  kwik_key text not null,
  beneficiary_name text,
  amount_cents bigint not null,
  description text,
  status public.transfer_status not null default 'pending',
  reference text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Remessas
-- ---------------------------------------------------------------------------

create table if not exists public.remittance_corridors (
  id text primary key,
  country_code char(2) not null,
  country_name text not null,
  currency char(3) not null,
  rate_aoa_per_unit numeric(18,6) not null,
  fee_percent numeric(8,4) not null default 0,
  min_amount_aoa_cents bigint not null default 0,
  payout_methods text[] not null default '{}'
);

create table if not exists public.incoming_remittances (
  id text primary key,
  account_id uuid not null references public.kulex_accounts (id) on delete cascade,
  sender_name text not null,
  sender_country_code char(2),
  amount_foreign_cents bigint not null,
  currency char(3) not null,
  amount_aoa_cents bigint not null,
  status public.remittance_in_status not null default 'pendente',
  reference text,
  payout_method public.remittance_payout_method,
  created_at timestamptz not null default now()
);

create table if not exists public.outgoing_remittances (
  id text primary key,
  account_id uuid not null references public.kulex_accounts (id) on delete cascade,
  corridor_id text not null references public.remittance_corridors (id),
  beneficiary_name text not null,
  beneficiary_phone text,
  beneficiary_account text,
  beneficiary_bank text,
  payout_method public.remittance_payout_method not null,
  amount_foreign_cents bigint not null,
  currency char(3) not null,
  total_debited_aoa_cents bigint not null,
  fee_aoa_cents bigint not null default 0,
  fee_mode public.remittance_fee_mode not null default 'deduct',
  status public.remittance_out_status not null default 'em_processamento',
  reference text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Kixikila — ciclos e contribuições
-- ---------------------------------------------------------------------------

create table if not exists public.kixikila_cycles (
  id uuid primary key default gen_random_uuid(),
  kixikila_id text not null references public.kixikilas (id) on delete cascade,
  cycle_number int not null,
  receiver_participant_id text,
  starts_at date,
  ends_at date,
  unique (kixikila_id, cycle_number)
);

create table if not exists public.kixikila_contributions (
  id uuid primary key default gen_random_uuid(),
  kixikila_id text not null references public.kixikilas (id) on delete cascade,
  participant_id text not null,
  cycle_number int not null,
  amount_cents bigint not null,
  contributed_at timestamptz,
  status public.kixikila_contribution_status not null default 'pending'
);

-- ---------------------------------------------------------------------------
-- Business
-- ---------------------------------------------------------------------------

create table if not exists public.invoice_clients (
  id uuid primary key default gen_random_uuid(),
  business_account_id uuid not null references public.kulex_accounts (id) on delete cascade,
  name text not null,
  email text,
  nif text
);

create table if not exists public.invoices (
  id text primary key,
  business_account_id uuid not null references public.kulex_accounts (id) on delete cascade,
  client_id uuid references public.invoice_clients (id) on delete set null,
  invoice_type public.invoice_type not null default 'simplified',
  title text not null,
  due_date date,
  discount_cents bigint not null default 0,
  vat_regime public.vat_regime not null default 'general',
  notes text,
  status public.invoice_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists public.invoice_line_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id text not null references public.invoices (id) on delete cascade,
  description text not null,
  quantity numeric(12,3) not null default 1,
  price_cents bigint not null
);

create table if not exists public.business_transactions (
  id uuid primary key default gen_random_uuid(),
  business_account_id uuid not null references public.kulex_accounts (id) on delete cascade,
  type public.business_tx_type not null,
  title text not null,
  description text,
  amount_cents bigint not null,
  tx_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Agente
-- ---------------------------------------------------------------------------

create table if not exists public.agent_clients (
  phone text not null,
  agent_account_id uuid not null references public.kulex_accounts (id) on delete cascade,
  name text not null,
  membership_id text,
  nif text,
  email text,
  status public.agent_client_status not null default 'pendente',
  kyc_status text,
  balance_cents bigint not null default 0,
  activated_at timestamptz,
  last_operation_at timestamptz,
  primary key (agent_account_id, phone)
);

create table if not exists public.agent_operations (
  id text primary key,
  agent_account_id uuid not null references public.kulex_accounts (id) on delete cascade,
  client_phone text not null,
  type public.agent_operation_type not null,
  amount_cents bigint not null default 0,
  commission_cents bigint not null default 0,
  reference text,
  created_at timestamptz not null default now()
);

create table if not exists public.agent_balances (
  agent_account_id uuid primary key references public.kulex_accounts (id) on delete cascade,
  available_cents bigint not null default 0,
  pending_cents bigint not null default 0,
  total_earned_cents bigint not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_rewards (
  id uuid primary key default gen_random_uuid(),
  agent_account_id uuid not null references public.kulex_accounts (id) on delete cascade,
  title text not null,
  description text,
  amount_cents bigint not null default 0,
  claimed boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS — tabelas por utilizador/conta
-- ---------------------------------------------------------------------------

alter table public.my_accounts enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.wallet_cards enable row level security;
alter table public.postpaid_wallet_states enable row level security;
alter table public.postpaid_bills enable row level security;
alter table public.scoring_factors enable row level security;
alter table public.score_history enable row level security;
alter table public.credit_loans enable row level security;
alter table public.credit_advances enable row level security;
alter table public.business_stock_credit enable row level security;
alter table public.contacts enable row level security;
alter table public.p2p_transfers enable row level security;
alter table public.bank_transfers enable row level security;
alter table public.kwik_transfers enable row level security;
alter table public.incoming_remittances enable row level security;
alter table public.outgoing_remittances enable row level security;
alter table public.kixikila_contributions enable row level security;
alter table public.kixikila_cycles enable row level security;
alter table public.invoice_clients enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_line_items enable row level security;
alter table public.business_transactions enable row level security;
alter table public.agent_clients enable row level security;
alter table public.agent_operations enable row level security;
alter table public.agent_balances enable row level security;
alter table public.agent_rewards enable row level security;

-- Catálogos: leitura pública autenticada
alter table public.banks enable row level security;
alter table public.payment_categories enable row level security;
alter table public.telecom_providers enable row level security;
alter table public.telecom_products enable row level security;
alter table public.telecom_values enable row level security;
alter table public.tv_providers enable row level security;
alter table public.tv_products enable row level security;
alter table public.tv_values enable row level security;
alter table public.public_service_providers enable row level security;
alter table public.public_service_products enable row level security;
alter table public.jogo_providers enable row level security;
alter table public.insurance_products enable row level security;
alter table public.payment_entities enable row level security;
alter table public.credit_products enable row level security;
alter table public.postpaid_card_products enable row level security;
alter table public.remittance_corridors enable row level security;
alter table public.countries enable row level security;
alter table public.score_bands enable row level security;

create policy "catalog_select" on public.banks for select to authenticated using (true);
create policy "catalog_select" on public.payment_categories for select to authenticated using (true);
create policy "catalog_select" on public.telecom_providers for select to authenticated using (true);
create policy "catalog_select" on public.telecom_products for select to authenticated using (true);
create policy "catalog_select" on public.telecom_values for select to authenticated using (true);
create policy "catalog_select" on public.tv_providers for select to authenticated using (true);
create policy "catalog_select" on public.tv_products for select to authenticated using (true);
create policy "catalog_select" on public.tv_values for select to authenticated using (true);
create policy "catalog_select" on public.public_service_providers for select to authenticated using (true);
create policy "catalog_select" on public.public_service_products for select to authenticated using (true);
create policy "catalog_select" on public.jogo_providers for select to authenticated using (true);
create policy "catalog_select" on public.insurance_products for select to authenticated using (true);
create policy "catalog_select" on public.payment_entities for select to authenticated using (true);
create policy "catalog_select" on public.credit_products for select to authenticated using (true);
create policy "catalog_select" on public.postpaid_card_products for select to authenticated using (true);
create policy "catalog_select" on public.remittance_corridors for select to authenticated using (true);
create policy "catalog_select" on public.countries for select to authenticated using (true);
create policy "catalog_select" on public.score_bands for select to authenticated using (true);

-- Conta-scoped policies (padrão)
do $$
declare
  t text;
  tables text[] := array[
    'my_accounts', 'payment_transactions', 'wallet_cards', 'credit_loans',
    'credit_advances', 'business_stock_credit', 'p2p_transfers', 'bank_transfers',
    'kwik_transfers', 'incoming_remittances', 'outgoing_remittances',
    'invoice_clients', 'invoices', 'business_transactions',
    'agent_clients', 'agent_operations', 'agent_balances', 'agent_rewards'
  ];
  col text;
begin
  foreach t in array tables loop
    col := case
      when t = 'my_accounts' then 'kulex_account_id'
      when t in ('agent_clients', 'agent_operations', 'agent_balances', 'agent_rewards') then 'agent_account_id'
      when t in ('invoice_clients', 'invoices', 'business_transactions') then 'business_account_id'
      when t = 'p2p_transfers' then 'from_account_id'
      else 'account_id'
    end;
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.account_belongs_to_user(%I)) with check (public.account_belongs_to_user(%I))',
      t || '_own', t, col, col
    );
  end loop;
end $$;

create policy "postpaid_wallet_states_own" on public.postpaid_wallet_states for all to authenticated
  using (exists (select 1 from public.wallet_cards wc where wc.id = card_id and public.account_belongs_to_user(wc.account_id)))
  with check (exists (select 1 from public.wallet_cards wc where wc.id = card_id and public.account_belongs_to_user(wc.account_id)));

create policy "postpaid_bills_own" on public.postpaid_bills for all to authenticated
  using (exists (select 1 from public.wallet_cards wc where wc.id = card_id and public.account_belongs_to_user(wc.account_id)))
  with check (exists (select 1 from public.wallet_cards wc where wc.id = card_id and public.account_belongs_to_user(wc.account_id)));

create policy "contacts_own" on public.contacts for all to authenticated
  using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);

create policy "scoring_factors_own" on public.scoring_factors for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "score_history_own" on public.score_history for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "invoice_line_items_own" on public.invoice_line_items for all to authenticated
  using (exists (
    select 1 from public.invoices i
    where i.id = invoice_id and public.account_belongs_to_user(i.business_account_id)
  ))
  with check (exists (
    select 1 from public.invoices i
    where i.id = invoice_id and public.account_belongs_to_user(i.business_account_id)
  ));

create policy "kixikila_cycles_select" on public.kixikila_cycles for select to authenticated using (true);
create policy "kixikila_contributions_select" on public.kixikila_contributions for select to authenticated using (true);

grant usage on schema public to authenticated;
grant select on all tables in schema public to authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
