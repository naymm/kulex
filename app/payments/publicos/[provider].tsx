import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InsuranceSelectSheet } from '@/components/insurance/InsuranceSelectSheet';
import {
  PaymentSelectField,
  PaymentTextField,
} from '@/components/payments/PaymentFormFields';
import {
  getDefaultPublicServiceForm,
  getPublicServiceProvider,
  isValidPublicServiceCustomerNumber,
  PUBLIC_SERVICE_PRODUCTS,
  type PublicServiceId,
} from '@/constants/public-services';

const NAVY = '#1A1A4E';

type SelectField = 'product' | 'value' | null;

export default function PublicServiceProviderScreen() {
  const insets = useSafeAreaInsets();
  const { provider: providerId } = useLocalSearchParams<{ provider?: string }>();
  const provider = getPublicServiceProvider(providerId);

  const resolvedProviderId = (provider?.id ?? 'ende') as PublicServiceId;
  const products = PUBLIC_SERVICE_PRODUCTS[resolvedProviderId];
  const defaults = useMemo(
    () => getDefaultPublicServiceForm(resolvedProviderId),
    [resolvedProviderId],
  );

  const [productId, setProductId] = useState(defaults.productId);
  const [valueId, setValueId] = useState(defaults.valueId);
  const [customerNumber, setCustomerNumber] = useState('');
  const [selectField, setSelectField] = useState<SelectField>(null);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId) ?? products[0],
    [productId, products],
  );

  const selectedValue = useMemo(
    () => selectedProduct.values.find((value) => value.id === valueId) ?? selectedProduct.values[0],
    [selectedProduct, valueId],
  );

  const productOptions = useMemo(() => products.map((product) => product.label), [products]);
  const valueOptions = useMemo(
    () => selectedProduct.values.map((value) => value.label),
    [selectedProduct],
  );

  const canContinue = isValidPublicServiceCustomerNumber(customerNumber);

  const handleProductSelect = (label: string) => {
    const product = products.find((item) => item.label === label);
    if (!product) return;
    setProductId(product.id);
    setValueId(product.values[0].id);
  };

  const handleValueSelect = (label: string) => {
    const value = selectedProduct.values.find((item) => item.label === label);
    if (!value) return;
    setValueId(value.id);
  };

  if (!provider) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
        <View style={styles.missingWrap}>
          <Text style={styles.missingText}>Serviço não encontrado.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>{provider.label}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 24) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <PaymentSelectField
          label="Produto"
          value={selectedProduct.label}
          onPress={() => setSelectField('product')}
        />
        <PaymentSelectField
          label="Valores"
          value={selectedValue.label}
          onPress={() => setSelectField('value')}
        />
        <PaymentTextField
          label="Número de cliente ou contrato"
          value={customerNumber}
          placeholder="Número de cliente ou contrato"
          onChangeText={setCustomerNumber}
        />

        <Pressable
          style={[styles.primaryBtn, !canContinue && styles.primaryBtnDisabled]}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canContinue }}
          disabled={!canContinue}
          onPress={() => {
            if (!canContinue) return;
            router.push({
              pathname: '/payments/publicos/confirm',
              params: {
                provider: provider.id,
                providerLabel: provider.label,
                product: selectedProduct.label,
                value: selectedValue.label,
                customerNumber,
              },
            });
          }}>
          <Text style={styles.primaryBtnText}>Continuar</Text>
        </Pressable>
      </ScrollView>

      {selectField === 'product' ? (
        <InsuranceSelectSheet
          visible
          title="Produto"
          options={productOptions}
          selected={selectedProduct.label}
          onClose={() => setSelectField(null)}
          onSelect={handleProductSelect}
        />
      ) : null}

      {selectField === 'value' ? (
        <InsuranceSelectSheet
          visible
          title="Valores"
          options={valueOptions}
          selected={selectedValue.label}
          onClose={() => setSelectField(null)}
          onSelect={handleValueSelect}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  headerPattern: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 80,
    transform: [{ scaleX: 1.4 }, { translateY: -20 }],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  primaryBtn: {
    marginTop: 8,
    height: 52,
    borderRadius: 26,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnDisabled: {
    opacity: 0.45,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  missingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  missingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
});
