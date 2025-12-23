import type { AuthError } from '@supabase/supabase-js';
import type { translations } from '../../utils/translations';

type TranslationShape = typeof translations['ar'];
export type AuthErrorKey = keyof TranslationShape['auth']['errors'];

const fallbackKey: AuthErrorKey = 'unexpected';

const codeToKey: Record<string, AuthErrorKey> = {
  invalid_credentials: 'invalidCredentials',
  email_not_confirmed: 'emailNotConfirmed',
  weak_password: 'weakPassword',
  user_already_exists: 'userAlreadyExists',
  user_already_registered: 'userAlreadyExists',
  email_address_invalid: 'invalidEmail',
  user_not_found: 'userNotFound',
  password_too_short: 'passwordTooShort',
  over_request_rate_limit: 'rateLimit',
  over_email_send_rate_limit: 'rateLimit',
  signup_disabled: 'signupDisabled',
};

export function mapAuthError(error: unknown): { key: AuthErrorKey; fallbackKey: AuthErrorKey } {
  const err = error as Partial<AuthError> & { status?: number; code?: string; message?: string };
  const code = typeof err?.code === 'string' ? err.code : undefined;

  if (code && codeToKey[code]) {
    return { key: codeToKey[code], fallbackKey };
  }

  const status = typeof err?.status === 'number' ? err.status : undefined;
  const message = typeof err?.message === 'string' ? err.message.toLowerCase() : '';

  if (!code && status === 400 && message) {
    const invalidLogin = message.includes('invalid login') || message.includes('invalid credentials');
    if (invalidLogin) {
      return { key: 'invalidCredentials', fallbackKey };
    }
  }

  return { key: fallbackKey, fallbackKey };
}

export function getAuthErrorMessage(error: unknown, t: TranslationShape): string {
  const { key, fallbackKey: fallback } = mapAuthError(error);
  return t.auth.errors[key] ?? t.auth.errors[fallback];
}
