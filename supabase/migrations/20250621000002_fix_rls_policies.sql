-- Completa RLS da migration 20250621000000 (falhou parcialmente em my_accounts_own)
-- Idempotente: ignora políticas já existentes

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
  pol_name text;
begin
  foreach t in array tables loop
    pol_name := t || '_own';
    if exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = t and policyname = pol_name
    ) then
      continue;
    end if;

    col := case
      when t = 'my_accounts' then 'kulex_account_id'
      when t in ('agent_clients', 'agent_operations', 'agent_balances', 'agent_rewards') then 'agent_account_id'
      when t in ('invoice_clients', 'invoices', 'business_transactions') then 'business_account_id'
      when t = 'p2p_transfers' then 'from_account_id'
      else 'account_id'
    end;

    execute format(
      'create policy %I on public.%I for all to authenticated using (public.account_belongs_to_user(%I)) with check (public.account_belongs_to_user(%I))',
      pol_name, t, col, col
    );
  end loop;
end $$;

do $$ begin
  create policy "postpaid_wallet_states_own" on public.postpaid_wallet_states for all to authenticated
    using (exists (select 1 from public.wallet_cards wc where wc.id = card_id and public.account_belongs_to_user(wc.account_id)))
    with check (exists (select 1 from public.wallet_cards wc where wc.id = card_id and public.account_belongs_to_user(wc.account_id)));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "postpaid_bills_own" on public.postpaid_bills for all to authenticated
    using (exists (select 1 from public.wallet_cards wc where wc.id = card_id and public.account_belongs_to_user(wc.account_id)))
    with check (exists (select 1 from public.wallet_cards wc where wc.id = card_id and public.account_belongs_to_user(wc.account_id)));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "contacts_own" on public.contacts for all to authenticated
    using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "scoring_factors_own" on public.scoring_factors for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "score_history_own" on public.score_history for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "invoice_line_items_own" on public.invoice_line_items for all to authenticated
    using (exists (
      select 1 from public.invoices i
      where i.id = invoice_id and public.account_belongs_to_user(i.business_account_id)
    ))
    with check (exists (
      select 1 from public.invoices i
      where i.id = invoice_id and public.account_belongs_to_user(i.business_account_id)
    ));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "kixikila_cycles_select" on public.kixikila_cycles for select to authenticated using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "kixikila_contributions_select" on public.kixikila_contributions for select to authenticated using (true);
exception when duplicate_object then null; end $$;

grant usage on schema public to authenticated;
grant select on all tables in schema public to authenticated;
grant insert, update, delete on all tables in schema public to authenticated;

-- Marcar migration principal como aplicada (DDL já existia antes do fail de RLS)
insert into public.kulex_migrations (id)
values ('20250621000000_kulex_remaining_schema.sql')
on conflict do nothing;
