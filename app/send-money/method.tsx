import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { KwikLogo } from '@/components/send-money/KwikLogo';
import { SEND_MONEY_METHODS, AGENT_SEND_MONEY_METHODS, type SendMoneyMethodId } from '@/constants/send-money';
import { withOriginParams } from '@/lib/navigation';

function MethodRow({
  label,
  icon,
  selected,
  onPress,
  showLogo,
}: {
  label: string;
  icon: 'person-outline' | 'business-outline' | 'flower-outline' | 'flash-outline';
  selected: boolean;
  onPress: () => void;
  showLogo?: boolean;
}) {
  return (
    <Pressable
      style={styles.row}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}>
      <View style={styles.rowLeft}>
        {showLogo ? (
          <KwikLogo height={22} />
        ) : (
          <>
            <Ionicons name={icon} size={22} color="#FFFFFF" />
            <Text style={styles.rowLabel}>{label}</Text>
          </>
        )}
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]} />
    </Pressable>
  );
}

export default function SendMoneyMethodScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const isAgentTransfer = from === 'agent' || from === 'agent-home';
  const methods = isAgentTransfer ? AGENT_SEND_MONEY_METHODS : SEND_MONEY_METHODS;
  const [method, setMethod] = useState<SendMoneyMethodId>(
    isAgentTransfer ? 'minhascontas' : 'contacto',
  );

  const navigate = (pathname: string, extra: Record<string, string> = {}) => {
    router.push({
      pathname: pathname as never,
      params: withOriginParams(from, extra),
    });
  };

  return (
    <AddMoneyShell
      title="Método"
      footer={
        <AddMoneyPrimaryButton
          label="Continuar"
          onPress={() => {
            if (method === 'contacto') {
              navigate('/send-money/contacts');
              return;
            }
            if (method === 'banco') {
              navigate('/send-money/banco');
              return;
            }
            if (method === 'kwik') {
              navigate('/send-money/kwik');
              return;
            }
            if (method === 'minhascontas') {
              navigate(
                '/send-money/minhas-contas',
                isAgentTransfer ? { accountFrom: 'agente' } : {},
              );
            }
          }}
        />
      }>
      <View style={styles.list}>
        {methods.map((item) => (
          <MethodRow
            key={item.id}
            label={item.label}
            icon={item.icon}
            showLogo={item.id === 'kwik'}
            selected={method === item.id}
            onPress={() => setMethod(item.id)}
          />
        ))}
      </View>
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 36,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
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
