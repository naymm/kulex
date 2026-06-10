import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { KwikTextField } from '@/components/send-money/KwikTextField';
import {
  KWIK_KEY_LABELS,
  KWIK_KEY_PLACEHOLDERS,
  KWIK_KEY_TYPES,
  type KwikKeyType,
} from '@/constants/kwik';
import { formatPhoneDisplay, kwikParamsToRoute, parsePhoneDigits } from '@/lib/kwik';
import { withOriginParams } from '@/lib/navigation';

function KeyTypeTabs({
  value,
  onChange,
}: {
  value: KwikKeyType;
  onChange: (next: KwikKeyType) => void;
}) {
  return (
    <View style={styles.tabs}>
      {KWIK_KEY_TYPES.map((tab) => {
        const selected = value === tab.id;
        return (
          <Pressable
            key={tab.id}
            style={[styles.tab, selected && styles.tabSelected]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(tab.id)}>
            <Text style={[styles.tabLabel, selected && styles.tabLabelSelected]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function KwikTransferFormScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [keyType, setKeyType] = useState<KwikKeyType>('telemovel');
  const [beneficiary, setBeneficiary] = useState('');
  const [kwikKey, setKwikKey] = useState('');
  const [personalDesc, setPersonalDesc] = useState('');
  const [destDesc, setDestDesc] = useState('');

  const keyValue = useMemo(() => {
    if (keyType === 'telemovel') return formatPhoneDisplay(kwikKey);
    return kwikKey;
  }, [keyType, kwikKey]);

  const onKeyChange = (text: string) => {
    if (keyType === 'telemovel') {
      setKwikKey(parsePhoneDigits(text));
      return;
    }
    setKwikKey(text);
  };

  const onKeyTypeChange = (next: KwikKeyType) => {
    setKeyType(next);
    setKwikKey('');
  };

  const continueToAmount = () => {
    router.push({
      pathname: '/send-money/kwik/amount',
      params: withOriginParams(from, kwikParamsToRoute({
        keyType,
        beneficiary,
        kwikKey,
        personalDesc,
        destDesc,
      })),
    });
  };

  return (
    <AddMoneyShell
      title="Transferência KWiK"
      footer={<AddMoneyPrimaryButton label="Continuar" onPress={continueToAmount} />}>
      <View style={styles.form}>
        <KeyTypeTabs value={keyType} onChange={onKeyTypeChange} />

        <KwikTextField
          label="Nome do Beneficiário"
          value={beneficiary}
          onChangeText={setBeneficiary}
          placeholder="Digite o nome do beneficiário"
        />

        <KwikTextField
          label={KWIK_KEY_LABELS[keyType]}
          value={keyValue}
          onChangeText={onKeyChange}
          placeholder={KWIK_KEY_PLACEHOLDERS[keyType]}
          keyboardType={keyType === 'telemovel' ? 'phone-pad' : 'email-address'}
        />

        <KwikTextField
          label="Descrição pessoal"
          value={personalDesc}
          onChangeText={setPersonalDesc}
          placeholder="Ex: Transferência Kulex"
        />

        <KwikTextField
          label="Descrição Destino"
          value={destDesc}
          onChangeText={setDestDesc}
          placeholder="Ex: Transferência Kulex"
        />
      </View>
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 28,
    gap: 24,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabSelected: {
    backgroundColor: '#C9A227',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tabLabelSelected: {
    color: '#1A1A4E',
  },
});
