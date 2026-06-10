import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { flagEmojiFromIso2 } from '@/constants/countries';
import { getCorridorById, getPayoutLabel } from '@/lib/remessas';
import { parseRemessaParams, remessaParamsToRoute } from '@/lib/remessas-route';

function FieldLabel({ children }: { children: string }) {
  return <Text style={styles.label}>{children}</Text>;
}

export default function RemessaBeneficiarioScreen() {
  const raw = useLocalSearchParams();
  const params = parseRemessaParams(raw);
  const corridor = useMemo(
    () => (params.corridorId ? getCorridorById(params.corridorId) : undefined),
    [params.corridorId],
  );

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [account, setAccount] = useState('');
  const [bank, setBank] = useState('');

  const payout = params.payoutMethod ?? 'bank';
  const isBank = payout === 'bank';
  const isMobile = payout === 'mobile';
  const isCash = payout === 'cash';

  const canContinue = useMemo(() => {
    if (!name.trim()) return false;
    if (isMobile || isCash) return phone.trim().length >= 9;
    if (isBank) return account.trim().length >= 6;
    return false;
  }, [account, isBank, isCash, isMobile, name, phone]);

  return (
    <AddMoneyShell
      title="Beneficiário"
      footer={
        <AddMoneyPrimaryButton
          label="Continuar"
          disabled={!canContinue}
          onPress={() =>
            router.push({
              pathname: '/remessas/enviar/valor',
              params: remessaParamsToRoute({
                ...params,
                beneficiaryName: name.trim(),
                beneficiaryPhone: phone.trim() || undefined,
                beneficiaryAccount: account.trim() || undefined,
                beneficiaryBank: bank.trim() || undefined,
              }),
            })
          }
        />
      }>
      {corridor ? (
        <View style={styles.destinationPill}>
          <Text style={styles.destinationFlag}>{flagEmojiFromIso2(corridor.countryCode)}</Text>
          <Text style={styles.destinationText}>
            {corridor.countryName} · {getPayoutLabel(payout)}
          </Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <View style={styles.field}>
          <FieldLabel>Nome completo</FieldLabel>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nome do beneficiário"
            placeholderTextColor="rgba(255,255,255,0.35)"
            autoCapitalize="words"
          />
        </View>

        {(isMobile || isCash) && (
          <View style={styles.field}>
            <FieldLabel>Telefone</FieldLabel>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Número com indicativo"
              placeholderTextColor="rgba(255,255,255,0.35)"
              keyboardType="phone-pad"
            />
          </View>
        )}

        {isBank && (
          <>
            <View style={styles.field}>
              <FieldLabel>Banco</FieldLabel>
              <TextInput
                style={styles.input}
                value={bank}
                onChangeText={setBank}
                placeholder="Nome do banco"
                placeholderTextColor="rgba(255,255,255,0.35)"
              />
            </View>
            <View style={styles.field}>
              <FieldLabel>IBAN ou conta</FieldLabel>
              <TextInput
                style={styles.input}
                value={account}
                onChangeText={setAccount}
                placeholder="Número da conta"
                placeholderTextColor="rgba(255,255,255,0.35)"
                autoCapitalize="characters"
              />
            </View>
            <View style={styles.field}>
              <FieldLabel>Telefone (opcional)</FieldLabel>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Contacto do beneficiário"
                placeholderTextColor="rgba(255,255,255,0.35)"
                keyboardType="phone-pad"
              />
            </View>
          </>
        )}

        {isCash && (
          <View style={styles.field}>
            <FieldLabel>Cidade do agente</FieldLabel>
            <TextInput
              style={styles.input}
              value={bank}
              onChangeText={setBank}
              placeholder="Ex.: Lisboa, São Paulo"
              placeholderTextColor="rgba(255,255,255,0.35)"
            />
          </View>
        )}
      </View>
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  destinationPill: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  destinationFlag: {
    fontSize: 18,
  },
  destinationText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  form: {
    marginTop: 28,
    gap: 22,
  },
  field: {
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.2,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
