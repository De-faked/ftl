import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';
import { Bdi } from '../../components/Bdi';
import { getAuthErrorMessage } from '../utils/authError';
import { Alert } from '../../components/Alert';

type Mode = 'signIn' | 'signUp';

type FormValues = {
  email: string;
  password: string;
};

export function AuthPage(props: { onSuccess?: () => void }) {
  const [mode, setMode] = useState<Mode>('signIn');
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<FormValues>({
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const title = useMemo(() => (mode === 'signIn' ? t.auth.page.titleLogin : t.auth.page.titleSignup), [mode, t]);

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setInfoMessage(null);
    clearErrors('root');

    if (mode === 'signIn') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError('root', { type: 'server', message: getAuthErrorMessage(error, t) });
        return;
      }
      props.onSuccess?.();
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError('root', { type: 'server', message: getAuthErrorMessage(error, t) });
      return;
    }

    if (data.session == null && data.user) {
      setInfoMessage(t.auth.page.infoConfirmEmail);
      setMode('signIn');
      return;
    }

    props.onSuccess?.();
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-madinah-green">{title}</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setMode('signIn');
              setInfoMessage(null);
              clearErrors('root');
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
              mode === 'signIn'
                ? 'bg-madinah-green text-white border-madinah-green'
                : 'bg-white text-gray-700 border-gray-200 hover:border-madinah-gold'
            }`}
          >
            {t.auth.page.toggleLogin}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signUp');
              setInfoMessage(null);
              clearErrors('root');
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
              mode === 'signUp'
                ? 'bg-madinah-green text-white border-madinah-green'
                : 'bg-white text-gray-700 border-gray-200 hover:border-madinah-gold'
            }`}
          >
            {t.auth.page.toggleSignup}
          </button>
        </div>
      </div>

      {infoMessage && (
        <div className="mb-4">
          <Alert variant="info">
            {infoMessage}
          </Alert>
        </div>
      )}

      {errors.root?.message && (
        <div className="mb-4">
          <Alert variant="error">
            <Bdi>{errors.root.message}</Bdi>
          </Alert>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="auth-email">
            {t.auth.page.emailLabel}
          </label>
          <input
            id="auth-email"
            type="email"
            inputMode="email"
            dir="ltr"
            autoComplete="email"
            className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-madinah-gold text-left ${
              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            {...register('email', {
              required: t.auth.page.validation.emailRequired,
              validate: (value) => (value.includes('@') ? true : t.auth.page.validation.emailInvalid),
            })}
          />
          {errors.email?.message && <p className="mt-1 text-sm text-red-700">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="auth-password">
            {t.auth.page.passwordLabel}
          </label>
          <input
            id="auth-password"
            type="password"
            autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
            className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-madinah-gold ${
              errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            {...register('password', {
              required: t.auth.page.validation.passwordRequired,
              minLength: { value: 6, message: t.auth.page.validation.passwordMin },
            })}
          />
          {errors.password?.message && <p className="mt-1 text-sm text-red-700">{errors.password.message}</p>}
          {mode === 'signIn' && (
            <div className="mt-2 flex justify-end">
              <Link
                to="/auth/forgot-password"
                className="inline-flex min-h-[44px] items-center text-sm font-medium text-madinah-green hover:text-madinah-green/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                {t.auth.page.forgotPassword}
              </Link>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-madinah-green px-4 py-3 text-white font-semibold hover:bg-madinah-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mode === 'signIn' ? t.auth.page.submitLogin : t.auth.page.submitSignup}
        </button>
      </form>
    </div>
  );
}
