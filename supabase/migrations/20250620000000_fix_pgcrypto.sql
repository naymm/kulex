-- pgcrypto vive no schema `extensions` no Supabase — funções com search_path=public falham

create extension if not exists pgcrypto with schema extensions;

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

create or replace function public.verify_user_pin(p_pin text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
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

  return v_hash = extensions.crypt(p_pin, v_hash);
end;
$$;
