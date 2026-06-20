-- Seed financeiro por utilizador no registo + dados iniciais

create or replace function public.seed_user_financial_profile(p_user_id uuid, p_account_id uuid, p_account_name text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.kulex_scores (user_id, score, previous_score, band, tier)
  values (p_user_id, 550, 520, 'regular', 'regular')
  on conflict (user_id) do update set
    score = excluded.score,
    previous_score = excluded.previous_score,
    band = excluded.band,
    tier = excluded.tier,
    updated_at = now();

  insert into public.scoring_factors (user_id, id, impact, points, max_points) values
    (p_user_id, 'payments', 'positive', 120, 200),
    (p_user_id, 'activity', 'positive', 80, 150),
    (p_user_id, 'kyc', 'neutral', 0, 100),
    (p_user_id, 'diversity', 'positive', 45, 100),
    (p_user_id, 'tenure', 'positive', 30, 80),
    (p_user_id, 'delays', 'negative', 0, 0)
  on conflict (user_id, id) do nothing;

  delete from public.score_history where user_id = p_user_id;

  insert into public.score_history (user_id, month_label, score) values
    (p_user_id, to_char(now() - interval '3 months', 'Mon YYYY'), 480),
    (p_user_id, to_char(now() - interval '2 months', 'Mon YYYY'), 510),
    (p_user_id, to_char(now() - interval '1 month', 'Mon YYYY'), 520),
    (p_user_id, to_char(now(), 'Mon YYYY'), 550);

  insert into public.my_accounts (kulex_account_id, id, name, balance_cents, icon) values
    (p_account_id, 'pessoal', p_account_name, 0, 'person-outline'),
    (p_account_id, 'agente', 'Kulex Agente', 0, 'shield-checkmark-outline'),
    (p_account_id, 'poupanca', 'Poupança', 0, 'wallet-outline')
  on conflict (kulex_account_id, id) do nothing;
end;
$$;

-- Actualizar register_kulex_user para chamar seed financeiro
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
set search_path = public, extensions
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
    extensions.crypt(p_pin, extensions.gen_salt('bf'))
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

  perform public.seed_user_financial_profile(v_user_id, v_account_id, v_name);

  insert into public.notifications (account_id, kind, title, message, action_href)
  values (
    v_account_id, 'kyc', 'Verificação pendente',
    'Complete a verificação KYC para desbloquear todos os serviços.', '/kyc'
  );

  perform public.seed_demo_movements(v_account_id);

  return v_account_id;
end;
$$;

grant execute on function public.seed_user_financial_profile(uuid, uuid, text) to service_role;
