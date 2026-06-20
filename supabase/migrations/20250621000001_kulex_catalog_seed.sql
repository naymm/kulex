-- Seed de catálogos de referência (espelha constants/ da app)

-- Bancos
insert into public.banks (id, name, select_label, logo_key) values
  ('bai', 'BAI', 'Banco BAI', 'bai'),
  ('bfa', 'BFA', 'Banco BFA', 'bfa'),
  ('millennium', 'Millennium Atlântico', 'Millennium Atlântico', 'millennium'),
  ('bpc', 'BPC', 'Banco BPC', 'bpc'),
  ('standard', 'Standard bank', 'Standard bank', 'standard'),
  ('sol', 'Sol', 'Banco Sol', 'sol'),
  ('caixa', 'Caixa Geral', 'Caixa Geral', 'caixa'),
  ('keve', 'Keve', 'Keve', 'keve'),
  ('bni', 'BNI', 'BNI', 'bni'),
  ('bca', 'BCA', 'BCA', 'bca'),
  ('bci', 'BCI', 'BCI', 'bci'),
  ('bir', 'BIR', 'BIR', 'bir'),
  ('yetu', 'YETU', 'YETU', 'yetu'),
  ('valor', 'VALOR', 'VALOR', 'valor'),
  ('vbt', 'VBT África', 'VBT África', 'vbt'),
  ('bcs', 'BCS', 'BCS', 'bcs'),
  ('comercial', 'Comercial Huambo', 'Comercial Huambo', 'comercial')
on conflict (id) do nothing;

-- Categorias de pagamento
insert into public.payment_categories (id, title, sort_order) values
  ('qrcode', 'QR Code', 1),
  ('referencia', 'Pagamento Por Referência', 2),
  ('servicos', 'Serviços', 3),
  ('jogos', 'Jogos', 4),
  ('estado', 'Pagamento ao Estado', 5),
  ('seguro', 'Seguros', 6)
on conflict (id) do nothing;

-- Faixas de scoring
insert into public.score_bands (id, label, min_score, max_score) values
  ('insuficiente', 'Insuficiente', 300, 549),
  ('regular', 'Regular', 550, 649),
  ('bom', 'Bom', 650, 749),
  ('muito_bom', 'Muito Bom', 750, 849),
  ('excelente', 'Excelente', 850, 1000)
on conflict (id) do nothing;

-- Produtos cartão pós-pago (valores em cêntimos AOA)
insert into public.postpaid_card_products (id, min_score, min_plafond_cents, max_plafond_cents, range_label) values
  ('branco', 550, 5000000, 100000000, '50.000,00 – 1.000.000,00'),
  ('verde', 600, 100000000, 250000000, '1.000.000,00 – 2.500.000,00'),
  ('gold', 700, 250000000, 500000000, '2.500.000,00 – 5.000.000,00'),
  ('prata', 750, 500000000, 750000000, '5.000.000,00 – 7.500.000,00'),
  ('black', 850, 750000000, 1500000000, '7.500.000,00 – 15.000.000,00')
on conflict (id) do nothing;

-- Produtos de crédito
insert into public.credit_products (id, title, montante_min_cents, montante_max_cents, prazo_dias, comissao_percent, iva_percent, juro_mora_percent, taeg_percent) values
  ('maka-zero', 'Maka Zero', 200000, 5000000, 60, 15, 14, 4, 105),
  ('empreendedor', 'Empreendedor', 200000, 5000000, 60, 15, 14, 4, 105),
  ('familia', 'Família', 200000, 5000000, 60, 15, 14, 4, 105)
on conflict (id) do nothing;

-- Telecom — operadores
insert into public.telecom_providers (id, name, logo_key) values
  ('unitel', 'Unitel', 'unitel'),
  ('africell', 'Africell', 'africell'),
  ('movicel', 'Movicel', 'movicel'),
  ('netone', 'Net One', 'netone')
on conflict (id) do nothing;

insert into public.telecom_products (id, provider_id, label) values
  ('unitel-dados-15gb', 'unitel', 'DADOS ATÉ 15GB'),
  ('unitel-voz', 'unitel', 'VOZ'),
  ('africell-dados', 'africell', 'DADOS'),
  ('movicel-dados', 'movicel', 'DADOS'),
  ('netone-dados', 'netone', 'DADOS')
on conflict (id) do nothing;

insert into public.telecom_values (id, product_id, label, price_cents) values
  ('unitel-2gb-31d', 'unitel-dados-15gb', '2GB/31D', 200000),
  ('unitel-5gb-31d', 'unitel-dados-15gb', '5GB/31D', 350000),
  ('unitel-10gb-31d', 'unitel-dados-15gb', '10GB/31D', 550000),
  ('unitel-15gb-31d', 'unitel-dados-15gb', '15GB/31D', 750000)
on conflict (id) do nothing;

-- Corredores de remessas (min_amount em cêntimos AOA)
insert into public.remittance_corridors (id, country_code, country_name, currency, rate_aoa_per_unit, fee_percent, min_amount_aoa_cents, payout_methods) values
  ('pt', 'PT', 'Portugal', 'EUR', 1050, 1.5, 500000, array['bank','cash']),
  ('mz', 'MZ', 'Moçambique', 'MZN', 13.5, 1.2, 300000, array['bank','mobile','cash']),
  ('cv', 'CV', 'Cabo Verde', 'CVE', 9.5, 1.2, 300000, array['bank','mobile']),
  ('gw', 'GW', 'Guiné-Bissau', 'XOF', 1.6, 1.3, 300000, array['bank','mobile','cash']),
  ('st', 'ST', 'São Tomé e Príncipe', 'STN', 48, 1.2, 300000, array['bank','mobile']),
  ('cd', 'CD', 'RDC', 'CDF', 0.35, 1.8, 500000, array['bank','mobile']),
  ('na', 'NA', 'Namíbia', 'NAD', 52, 1.5, 500000, array['bank','mobile']),
  ('zm', 'ZM', 'Zâmbia', 'ZMW', 38, 1.5, 500000, array['bank','mobile','cash']),
  ('za', 'ZA', 'África do Sul', 'ZAR', 52, 1.6, 500000, array['bank','mobile']),
  ('ml', 'ML', 'Mali', 'XOF', 1.6, 1.7, 500000, array['bank','mobile','cash']),
  ('sn', 'SN', 'Senegal', 'XOF', 1.6, 1.6, 500000, array['bank','mobile']),
  ('mr', 'MR', 'Mauritânia', 'MRU', 23, 1.7, 500000, array['bank','mobile','cash']),
  ('gn', 'GN', 'Guiné', 'GNF', 0.11, 1.8, 500000, array['bank','mobile','cash']),
  ('ci', 'CI', 'Costa do Marfim', 'XOF', 1.6, 1.7, 500000, array['bank','mobile']),
  ('br', 'BR', 'Brasil', 'BRL', 180, 2.0, 500000, array['bank','mobile']),
  ('us', 'US', 'Estados Unidos', 'USD', 950, 2.5, 1000000, array['bank','mobile'])
on conflict (id) do nothing;

-- Países (amostra PALOP + Angola)
insert into public.countries (code, name, dial_code) values
  ('AO', 'Angola', '+244'),
  ('PT', 'Portugal', '+351'),
  ('MZ', 'Moçambique', '+258'),
  ('CV', 'Cabo Verde', '+238'),
  ('GW', 'Guiné-Bissau', '+245'),
  ('ST', 'São Tomé e Príncipe', '+239'),
  ('BR', 'Brasil', '+55'),
  ('US', 'Estados Unidos', '+1')
on conflict (code) do nothing;

-- Seguros (rotas da app)
insert into public.insurance_products (id, title, route) values
  ('viagem', 'Seguro de Viagem', '/pagamentos/seguros/viagem'),
  ('automovel', 'Seguro Automóvel', '/pagamentos/seguros/automovel')
on conflict (id) do nothing;

-- Jogos
insert into public.jogo_providers (id, label) values
  ('placard', 'Placard'),
  ('betway', 'Betway'),
  ('1xbet', '1xBet')
on conflict (id) do nothing;
