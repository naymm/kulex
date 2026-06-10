import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SignupBackButton, signupPageInsets, signupPageStyles } from '@/components/signup/SignupShell';
import { ACCOUNT_TYPES } from '@/constants/signup';
import { useSignup } from '@/contexts/signup-context';

export default function SignupAccountTypeScreen() {
  const insets = useSafeAreaInsets();
  const { setAccountType } = useSignup();

  const select = (id: (typeof ACCOUNT_TYPES)[number]['id']) => {
    setAccountType(id);
    if (id === 'business') {
      router.push('/signup/business');
      return;
    }
    router.push('/signup/country');
  };

  return (
    <View style={[signupPageStyles.container, signupPageInsets(insets)]}>
      <View style={signupPageStyles.inner}>
        <SignupBackButton />
        <Text style={signupPageStyles.title}>Que tipo de conta você gostaria de abrir hoje?</Text>
        <Text style={signupPageStyles.subtitle}>
          Conta Agente e Conta Pessoal exigem os mesmos documentos e verificação KYC. Pode adicionar
          outra conta mais tarde.
        </Text>

        <View style={styles.list}>
          {ACCOUNT_TYPES.map((item) => (
            <Pressable
              key={item.id}
              style={styles.row}
              accessibilityRole="button"
              onPress={() => select(item.id)}>
              <View style={styles.iconWrap}>
                <Ionicons name={item.icon} size={22} color="#374151" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowDesc}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#111827" />
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={styles.legal}>
        Você deve usar a Kulex de acordo com a nossa{' '}
        <Text style={styles.legalLink}>Política de Uso Aceitável</Text>. Você não pode usar uma
        conta pessoal para fins comerciais.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: 32, gap: 28 },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  rowText: { flex: 1, paddingRight: 8 },
  rowTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  rowDesc: { marginTop: 4, fontSize: 13, lineHeight: 18, color: '#6B7280' },
  legal: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
  legalLink: { fontWeight: '700', color: '#111827', textDecorationLine: 'underline' },
});
