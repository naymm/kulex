import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAVY = '#1A1A4E';
const BORDER = '#E6E6E6';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    router.replace('/(tabs)');
  };

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/onboarding');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 12,
            paddingBottom: Math.max(insets.bottom, 24),
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <Pressable
          style={styles.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          onPress={handleClose}>
          <Ionicons name="close" size={20} color="#111827" />
        </Pressable>

        <Text style={styles.title}>Início de Sessão</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Seu email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            underlineColorAndroid="transparent"
          />

          <Text style={[styles.label, styles.labelSpacing]}>Sua senha</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            underlineColorAndroid="transparent"
          />

          <Pressable
            style={styles.forgotWrap}
            accessibilityRole="button"
            onPress={() => {}}>
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.primaryButton}
          accessibilityRole="button"
          onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Iniciar Sessão</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Você é um novo usuário? </Text>
          <Pressable accessibilityRole="button" onPress={() => router.push('/signup')}>
            <Text style={styles.footerLink}>Criar conta</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 28,
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  form: {
    marginTop: 36,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 10,
  },
  labelSpacing: {
    marginTop: 22,
  },
  input: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
    color: NAVY,
  },
  primaryButton: {
    marginTop: 40,
    height: 56,
    borderRadius: 28,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  footerText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '400',
  },
  footerLink: {
    fontSize: 15,
    fontWeight: '600',
    color: NAVY,
  },
});
