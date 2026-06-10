import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AddMoneyPrimaryButton, AddMoneyShell } from '@/components/add-money/AddMoneyShell';
import { AgentClientPreview } from '@/components/agent/AgentClientPreview';
import { NumericKeypad } from '@/components/send-money/NumericKeypad';
import {
  AGENT_PHONE_LENGTH,
  formatAgentPhone,
  isAgentPhoneComplete,
  lookupAgentClient,
  normalizeAgentPhone,
} from '@/lib/agent-clients';

export default function AgentCarregarClienteScreen() {
  const { phone: initialPhone } = useLocalSearchParams<{ phone?: string }>();
  const [phoneDigits, setPhoneDigits] = useState(
    typeof initialPhone === 'string' ? normalizeAgentPhone(initialPhone) : '',
  );

  const client = useMemo(() => lookupAgentClient(phoneDigits), [phoneDigits]);
  const phoneDisplay = formatAgentPhone(phoneDigits);
  const phoneComplete = isAgentPhoneComplete(phoneDigits);
  const unknownClient = phoneComplete && !client;

  const addDigit = (digit: string) => {
    setPhoneDigits((prev) => {
      const next = normalizeAgentPhone(prev + digit);
      return next.length <= AGENT_PHONE_LENGTH ? next : prev;
    });
  };

  const deleteDigit = () => {
    setPhoneDigits((prev) => prev.slice(0, -1));
  };

  const continueToAmount = () => {
    if (!client) return;
    router.push({
      pathname: '/agent/carregar/valor',
      params: { phone: client.phone, clientName: client.name },
    });
  };

  return (
    <AddMoneyShell
      title="Carregar cliente"
      footer={
        <AddMoneyPrimaryButton
          label="Continuar"
          onPress={continueToAmount}
          disabled={!client}
        />
      }>
      <View style={styles.section}>
        <Text style={styles.label}>Número do cliente</Text>
        <Text style={[styles.phoneValue, !phoneDigits && styles.phoneEmpty]}>
          {phoneDigits ? phoneDisplay : '9XX XXX XXX'}
        </Text>
        <Text style={styles.hint}>Introduza os 9 dígitos do telemóvel Kulex</Text>
      </View>

      {client ? <AgentClientPreview phone={client.phone} name={client.name} /> : null}

      {unknownClient ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Cliente não encontrado</Text>
          <Text style={styles.errorText}>
            O número {phoneDisplay} não está associado a uma conta Kulex activa.
          </Text>
        </View>
      ) : null}

      <NumericKeypad onDigit={addDigit} onDelete={deleteDigit} variant="dark" />
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  section: {
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  phoneValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  phoneEmpty: {
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '600',
  },
  hint: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  errorCard: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.35)',
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FCA5A5',
  },
  errorText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
  },
});
