import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import {
  DEFAULT_SOURCE_ACCOUNT,
  MY_ACCOUNTS,
  type MyAccount,
  type MyAccountId,
} from '@/constants/my-accounts';
import { myAccountsParamsToRoute } from '@/lib/my-accounts';

function AccountRow({
  account,
  selected,
  disabled,
  onPress,
}: {
  account: MyAccount;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.row, disabled && styles.rowDisabled]}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}>
      <View style={styles.rowLeft}>
        <View style={styles.iconWrap}>
          <Ionicons name={account.icon} size={20} color="#FFFFFF" />
        </View>
        <View style={styles.rowText}>
          <Text style={styles.rowName}>{account.name}</Text>
          <Text style={styles.rowSubtitle}>
            {account.subtitle} · AOA {account.balance}
          </Text>
        </View>
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]} />
    </Pressable>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export default function MyAccountsTransferScreen() {
  const { accountFrom } = useLocalSearchParams<{ accountFrom?: string }>();
  const initialFrom: MyAccountId =
    accountFrom === 'agente' || accountFrom === 'poupanca' || accountFrom === 'pessoal'
      ? accountFrom
      : DEFAULT_SOURCE_ACCOUNT;
  const [fromId, setFromId] = useState<MyAccountId>(initialFrom);
  const [toId, setToId] = useState<MyAccountId>(initialFrom === 'agente' ? 'pessoal' : 'agente');

  const destinationAccounts = useMemo(
    () => MY_ACCOUNTS.filter((account) => account.id !== fromId),
    [fromId]
  );

  const effectiveToId = destinationAccounts.some((account) => account.id === toId)
    ? toId
    : destinationAccounts[0]?.id ?? (fromId === 'agente' ? 'pessoal' : 'agente');

  const continueToAmount = () => {
    router.push({
      pathname: '/send-money/minhas-contas/amount',
      params: myAccountsParamsToRoute({ from: fromId, to: effectiveToId }),
    });
  };

  return (
    <AddMoneyShell
      title="Minhas Contas"
      footer={<AddMoneyPrimaryButton label="Continuar" onPress={continueToAmount} />}>
      <View style={styles.content}>
        <SectionTitle>De</SectionTitle>
        <View style={styles.list}>
          {MY_ACCOUNTS.map((account) => (
            <AccountRow
              key={`from-${account.id}`}
              account={account}
              selected={fromId === account.id}
              onPress={() => setFromId(account.id)}
            />
          ))}
        </View>

        <SectionTitle>Para</SectionTitle>
        <View style={styles.list}>
          {destinationAccounts.map((account) => (
            <AccountRow
              key={`to-${account.id}`}
              account={account}
              selected={effectiveToId === account.id}
              onPress={() => setToId(account.id)}
            />
          ))}
        </View>
      </View>
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: 28,
    gap: 8,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 4,
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  list: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowDisabled: {
    opacity: 0.4,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rowSubtitle: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  radioSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
});
