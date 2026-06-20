# Estado do schema Supabase vs. aplicação Kulex

Comparação entre `docs/database-schema.md` (modelo implícito na app), migrations em `supabase/migrations/` e ecrãs que ainda leem `constants/` / `lib/` em memória.

**Legenda:** ✅ implementado · 🟡 parcial · ❌ em falta

---

## Resumo executivo

| Área | Tabelas no doc | No Supabase (após `20250621000000`) | Integração na app |
|------|----------------|--------------------------------------|-------------------|
| Identidade / contas | 5 | 5 ✅ | 🟡 Auth + RPC registo; contas mockadas como fallback |
| Movimentos / pagamentos | 2 | 2 ✅ | 🟡 Lista lê API; fallback mock |
| Cartões | 4 | 4 ✅ | ❌ ainda `constants/card.ts`, `lib/postpaid-*.ts` |
| Scoring | 3 | 3 ✅ | ❌ ainda `constants/scoring.ts`, `lib/scoring.ts` |
| Crédito | 4 | 4 ✅ | ❌ ainda `lib/credit-loans.ts`, `lib/credit-advances.ts` |
| Catálogos pagamentos | 8+ | 8+ ✅ (seed parcial) | ❌ ecrãs ainda leem `constants/` |
| Transferências | 4 | 4 ✅ | ❌ send-money, contacts, bank, kwik |
| Remessas | 3 | 3 ✅ | ❌ `constants/remessas.ts`, `lib/remessas.ts` |
| Kixikila | 5 | 5 ✅ | 🟡 platform seed + join RPC; detalhe ainda usa mocks |
| Business | 4 | 4 ✅ | ❌ facturas, transacções |
| Agente | 4 | 4 ✅ | ❌ clientes, operações, comissões |
| Notificações | 3 tipos | 1 ✅ unificada | 🟡 API parcial |
| Referência (seed) | 10+ | 🟡 seed base | ❌ TV/streaming e serviços públicos ainda só em constants |

**Total aproximado:** ~45 entidades no documento · **~10 criadas** na fase 1–2 · **~35 adicionadas** nas migrations `20250621000000` + `20250621000001` (aplicar com `npm run db:migrate`).

---

## 1. O que já existe no Supabase

### Fase 1–2 (core)

| Tabela | Migration | Notas |
|--------|-----------|-------|
| `profiles` | `20250615000000` | Extensão de `auth.users`; PIN, KYC, telefone, BI, NIF |
| `kulex_accounts` | idem | UUID PK |
| `personal_data_profiles` | idem | Dados pessoais por conta |
| `business_profiles` | idem | KYB empresa |
| `movements` | idem | Extrato; seed demo no registo |
| `notifications` | idem | Unifica personal/agent/business |
| `kulex_scores` | idem + `20250621000000` | `score`, `tier`, `previous_score`, `band` |
| `kixikilas` | `20250615000001` | Inclui platform (`source=platform`) |
| `kixikila_memberships` | idem | Participação por conta |
| `kixikila_participants` | idem | Slots anónimos Kulex |

### Fase 3 (`20250621000000` + seed `20250621000001`)

| Domínio | Tabelas |
|---------|---------|
| Sub-carteiras | `my_accounts` |
| Pagamentos | `payment_transactions` |
| Cartões | `wallet_cards`, `postpaid_card_products`, `postpaid_wallet_states`, `postpaid_bills` |
| Scoring | `scoring_factors`, `score_history`, `score_bands` |
| Crédito | `credit_products`, `credit_loans`, `credit_advances`, `business_stock_credit` |
| Catálogos | `banks`, `payment_categories`, `telecom_*`, `tv_*`, `public_service_*`, `jogo_providers`, `insurance_products`, `payment_entities`, `countries`, `remittance_corridors` |
| Transferências | `contacts`, `p2p_transfers`, `bank_transfers`, `kwik_transfers` |
| Remessas | `incoming_remittances`, `outgoing_remittances` |
| Kixikila | `kixikila_cycles`, `kixikila_contributions` |
| Business | `invoice_clients`, `invoices`, `invoice_line_items`, `business_transactions` |
| Agente | `agent_clients`, `agent_operations`, `agent_balances`, `agent_rewards` |

### RPCs e funções

### Funções / auth (não são tabelas)

- Sessão: `auth.users` (Supabase Auth)
- Upload KYC: Storage buckets **não configurados**

---

## 2. Estado por domínio — schema vs. app

Legenda: **Schema** = tabela no Supabase · **App** = ecrãs ainda leem mocks em `constants/` / `lib/`

### 2.1 Contas e sub-carteiras

| Tabela | Schema | App | Ficheiros |
|--------|--------|-----|-----------|
| `my_accounts` | ✅ | ❌ | `constants/my-accounts.ts`, send-money |

### 2.2 Pagamentos unificados

| Tabela | Schema | App | Ficheiros |
|--------|--------|-----|-----------|
| `payment_transactions` | ✅ | ❌ | `lib/payment-completion.ts`, fluxos pagamento |

### 2.3 Cartões

| Tabela | Schema | App |
|--------|--------|-----|
| `wallet_cards` | ✅ | ❌ |
| `postpaid_card_products` | ✅ (seed) | ❌ |
| `postpaid_wallet_states` | ✅ | ❌ |
| `postpaid_bills` | ✅ | ❌ |

### 2.4 Scoring

| Tabela | Schema | App |
|--------|--------|-----|
| `kulex_scores` | ✅ | ❌ |
| `scoring_factors` | ✅ | ❌ |
| `score_history` | ✅ | ❌ |
| `score_bands` | ✅ (seed) | ❌ |

### 2.5 Crédito

| Tabela | Schema | App |
|--------|--------|-----|
| `credit_products` | ✅ (seed) | ❌ |
| `credit_loans` | ✅ | ❌ |
| `credit_advances` | ✅ | ❌ |
| `business_stock_credit` | ✅ | ❌ |

### 2.6 Catálogos de serviços

| Tabela | Schema | App | Notas |
|--------|--------|-----|-------|
| `banks` | ✅ (seed) | ❌ | 17 bancos |
| `payment_categories` | ✅ (seed) | ❌ | |
| `telecom_*` | 🟡 seed parcial | ❌ | TV/streaming/serviços públicos: tabelas vazias |
| `tv_*` | ✅ vazias | ❌ | |
| `public_service_*` | ✅ vazias | ❌ | |
| `jogo_providers` | ✅ (seed) | ❌ | |
| `insurance_products` | ✅ (seed) | ❌ | |
| `payment_entities` | ✅ vazia | ❌ | RUPE / referência |

### 2.7 Transferências e contactos

| Tabela | Schema | App |
|--------|--------|-----|
| `contacts` | ✅ | ❌ |
| `p2p_transfers` | ✅ | ❌ |
| `bank_transfers` | ✅ | ❌ |
| `kwik_transfers` | ✅ | ❌ |

### 2.8 Remessas

| Tabela | Schema | App |
|--------|--------|-----|
| `remittance_corridors` | ✅ (seed) | ❌ |
| `incoming_remittances` | ✅ | ❌ |
| `outgoing_remittances` | ✅ | ❌ |

### 2.9 Kixikila

| Tabela | Schema | App |
|--------|--------|-----|
| `kixikilas` | ✅ | 🟡 API + mock detalhe |
| `kixikila_cycles` | ✅ | ❌ |
| `kixikila_contributions` | ✅ | ❌ |

### 2.10 Business

| Tabela | Schema | App |
|--------|--------|-----|
| `invoice_clients` | ✅ | ❌ |
| `invoices` | ✅ | ❌ |
| `invoice_line_items` | ✅ | ❌ |
| `business_transactions` | ✅ | ❌ |

### 2.11 Agente

| Tabela | Schema | App |
|--------|--------|-----|
| `agent_clients` | ✅ | ❌ |
| `agent_operations` | ✅ | ❌ |
| `agent_balances` | ✅ | ❌ |
| `agent_rewards` | ✅ | ❌ |

### 2.12 Dados de referência (seed)

| Tabela | Schema | App | Notas |
|--------|--------|-----|-------|
| `countries` | ✅ (seed) | ❌ | |
| `score_bands` | ✅ (seed) | ❌ | |
| `remittance_corridor_groups` | ❌ | ❌ | Só agrupamento UI — não é tabela |

*(Logos ficam na app como assets; na BD guarda-se `logo_key`.)*

---

## 3. Campos em falta nas tabelas existentes

### `profiles` / registo

O signup com consulta BI preenche nome e data na UI, mas **não persiste** ainda:

- `id_number`, `nif`, `birth_date`, `gender`, `nationality` no `profiles` / `personal_data_profiles`

### `kulex_scores`

Colunas `previous_score` e `band` adicionadas em `20250621000000`. Falta popular no registo e ligar `lib/scoring.ts` à API.

### `movements.id`

App usa UUID na BD; mocks usavam ids string (`"1"`, `"2"`).

---

## 4. Ordem recomendada de implementação

### Fase A — Core financeiro (bloqueia mocks principais)

1. `payment_transactions` + RPCs de transferência
2. `contacts`, `p2p_transfers`, `bank_transfers`, `kwik_transfers`
3. `my_accounts`
4. Remover fallbacks mock em hooks (`useAccountMovements`, `AccountContext`, etc.)

### Fase B — Produtos

5. Cartões (`wallet_cards`, postpaid_*)
6. Crédito (`credit_*`, `business_stock_credit`)
7. Remessas (`remittance_*`)

### Fase C — Contas especializadas

8. Business (facturas)
9. Agente (clientes, operações)
10. Kixikila user-created + contributions

### Fase D — Catálogos

11. Seed `banks`, telecom, TV, jogos, seguros, `payment_entities`
12. Migrar ecrãs de pagamentos para `select` na BD

---

## 5. Comandos

```bash
# Aplicar novas migrations
npm run db:migrate

# Ver tabelas no Studio
# http://127.0.0.1:8000 → Table Editor
```

---

## 6. Ficheiros de migration

| Ficheiro | Conteúdo |
|----------|----------|
| `20250615000000_kulex_schema.sql` | Core identidade, movimentos, notificações |
| `20250615000001_kulex_kixikila_and_seed.sql` | Kixikila + seed platform |
| `20250620000000_fix_pgcrypto.sql` | Fix PIN hash |
| `20250621000000_kulex_remaining_schema.sql` | Restantes tabelas + RLS + catálogos base |
| `20250621000001_kulex_catalog_seed.sql` | Seed bancos, produtos crédito, categorias, remessas |
| `20250621000002_fix_rls_policies.sql` | Completa RLS se `20250621000000` falhou a meio |

*Actualizado: Junho 2026*
