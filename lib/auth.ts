import type { AccountType } from '@/constants/signup';
import { getCountryDialCode } from '@/constants/country-dial-codes';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export type AuthErrorCode =
  | 'not_configured'
  | 'invalid_credentials'
  | 'invalid_otp'
  | 'email_not_confirmed'
  | 'network'
  | 'unknown';

export class AuthError extends Error {
  code: AuthErrorCode;

  constructor(message: string, code: AuthErrorCode = 'unknown') {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

const INVALID_OTP_MESSAGE = 'Código inválido.';
const EXPIRED_OTP_MESSAGE = 'Código expirado. Peça um novo código.';

function mapAuthError(error: { message: string; status?: number }): AuthError {
  const msg = error.message.toLowerCase();
  if (msg.includes('anonymous sign-ins are disabled')) {
    return new AuthError(
      'Erro de configuração do servidor. Reinicie a app após npm run supabase:keys.',
      'unknown',
    );
  }
  if (msg.includes('invalid login credentials')) {
    return new AuthError('E-mail ou senha incorrectos.', 'invalid_credentials');
  }
  if (msg.includes('phone provider') || msg.includes('sms provider')) {
    return new AuthError(
      'SMS não configurado no servidor. Verifique Twilio em docker/supabase/.env.',
      'unknown',
    );
  }
  if (msg.includes('unsupported phone') || msg.includes('invalid phone')) {
    return new AuthError('Número de telefone inválido.', 'unknown');
  }
  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return new AuthError('Demasiados pedidos. Aguarde e tente novamente.', 'unknown');
  }
  if (
    msg.includes('invalid otp') ||
    msg.includes('invalid token') ||
    msg.includes('token has expired or is invalid') ||
    msg.includes('otp is invalid') ||
    msg.includes('invalid grant') ||
    msg.includes('verification check') ||
    msg.includes('no pending') ||
    msg.includes('incorrect')
  ) {
    return new AuthError(INVALID_OTP_MESSAGE, 'invalid_otp');
  }
  if (msg.includes('token has expired') || msg.includes('otp_expired') || msg.includes('expired')) {
    return new AuthError(EXPIRED_OTP_MESSAGE, 'invalid_otp');
  }
  if (msg.includes('email not confirmed')) {
    return new AuthError('Confirme o seu e-mail antes de iniciar sessão.', 'email_not_confirmed');
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return new AuthError('Sem ligação ao servidor. Verifique a rede.', 'network');
  }
  return new AuthError(error.message || 'Ocorreu um erro. Tente novamente.');
}

function assertConfigured() {
  if (!isSupabaseConfigured) {
    throw new AuthError(
      'Backend não configurado. Defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY.',
      'not_configured',
    );
  }
}

export async function signInWithEmail(email: string, password: string) {
  assertConfigured();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw mapAuthError(error);
  return data.session;
}

export async function signOut() {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw mapAuthError(error);
}

export type CompleteSignupParams = {
  email: string;
  password: string;
  phone: string;
  countryCode: string;
  accountType: AccountType;
  pin: string;
  fullName?: string | null;
};

export async function completeKulexSignup(params: CompleteSignupParams) {
  assertConfigured();

  const email = params.email.trim();
  const password = params.password;

  if (!email || !password) {
    throw new AuthError('E-mail e senha são obrigatórios para criar a conta.', 'unknown');
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const hasPhoneSession = Boolean(sessionData.session?.user.phone);

  if (hasPhoneSession) {
    const { error: updateError } = await supabase.auth.updateUser({ email, password });
    if (updateError) throw mapAuthError(updateError);
  } else {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) throw mapAuthError(signUpError);

    if (!signUpData.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw mapAuthError(signInError);
    }
  }

  const { data: accountId, error: rpcError } = await supabase.rpc('register_kulex_user', {
    p_phone: params.phone,
    p_country_code: params.countryCode,
    p_account_kind: params.accountType,
    p_pin: params.pin,
    p_full_name: params.fullName ?? null,
  });

  if (rpcError) {
    throw new AuthError(rpcError.message || 'Não foi possível criar a conta Kulex.');
  }

  return accountId;
}

export async function sendPasswordRecoveryOtp(email: string) {
  assertConfigured();
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: { shouldCreateUser: false },
  });
  if (error) throw mapAuthError(error);
}

export async function verifyPasswordRecoveryOtp(email: string, token: string) {
  assertConfigured();
  const { error } = await supabase.auth.verifyOtp({
    email: email.trim(),
    token: token.replace(/\D/g, ''),
    type: 'email',
  });
  if (error) throw mapAuthError(error);
}

export async function updatePassword(password: string) {
  assertConfigured();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw mapAuthError(error);
}

function formatPhoneE164(countryCode: string, phone: string) {
  const dial = getCountryDialCode(countryCode).replace(/\s/g, '');
  const digits = phone.replace(/\D/g, '');
  return `${dial}${digits}`;
}

export async function sendPhoneOtp(
  countryCode: string,
  phone: string,
  options?: { shouldCreateUser?: boolean },
) {
  assertConfigured();
  const e164 = formatPhoneE164(countryCode, phone);

  const { error } = await supabase.auth.signInWithOtp({
    phone: e164,
    options: { shouldCreateUser: options?.shouldCreateUser ?? false },
  });
  if (error) throw mapAuthError(error);

  return e164;
}

export async function verifyPhoneOtp(phoneE164: string, token: string) {
  assertConfigured();
  const { error } = await supabase.auth.verifyOtp({
    phone: phoneE164,
    token: token.replace(/\D/g, ''),
    type: 'sms',
  });
  if (error) throw mapAuthError(error);
}

export async function sendPhoneRecoveryOtp(countryCode: string, phone: string) {
  return sendPhoneOtp(countryCode, phone, { shouldCreateUser: false });
}

export async function verifyPhoneRecoveryOtp(phoneE164: string, token: string) {
  return verifyPhoneOtp(phoneE164, token);
}

export async function sendSignupPhoneOtp(countryCode: string, phone: string) {
  return sendPhoneOtp(countryCode, phone, { shouldCreateUser: true });
}

export async function verifySignupPhoneOtp(phoneE164: string, token: string) {
  return verifyPhoneOtp(phoneE164, token);
}
