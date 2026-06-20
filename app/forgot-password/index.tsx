import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  SignupBackButton,
  signupPageInsets,
  signupPageStyles,
} from '@/components/signup/SignupShell';
import {
  useForgotPassword,
  type ForgotPasswordMethod,
} from '@/contexts/forgot-password-context';

const METHODS: {
  id: ForgotPasswordMethod;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    id: 'email',
    title: 'E-mail',
    description: 'Receba o código no seu endereço de e-mail.',
    icon: 'mail-outline',
  },
  {
    id: 'phone',
    title: 'Telefone',
    description: 'Receba o código por SMS no seu número.',
    icon: 'call-outline',
  },
];

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { setMethod } = useForgotPassword();

  const selectMethod = (method: ForgotPasswordMethod) => {
    setMethod(method);
    router.push('/forgot-password/contact');
  };

  return (
    <View style={[signupPageStyles.container, signupPageInsets(insets)]}>
      <View style={signupPageStyles.inner}>
        <SignupBackButton />
        <Text style={signupPageStyles.title}>Recuperar senha</Text>
        <Text style={signupPageStyles.subtitle}>
          Escolha como deseja receber o código de verificação para redefinir a sua senha.
        </Text>

        <View style={styles.list}>
          {METHODS.map((item) => (
            <Pressable
              key={item.id}
              style={styles.row}
              accessibilityRole="button"
              onPress={() => selectMethod(item.id)}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 32,
    gap: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  rowText: {
    flex: 1,
    paddingRight: 8,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  rowDesc: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
  },
});
