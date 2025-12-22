import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabaseClient';

type Mode = 'signIn' | 'signUp';

type FormValues = {
  email: string;
  password: string;
};

export function AuthPage(props: { onSuccess?: () => void }) {
  const [mode, setMode] = useState<Mode>('signIn');
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

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

  const title = useMemo(() => (mode === 'signIn' ? 'Sign in' : 'Sign up'), [mode]);

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setInfoMessage(null);
    clearErrors('root');

    if (mode === 'signIn') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError('root', { type: 'server', message: error.message });
        return;
      }
      props.onSuccess?.();
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError('root', { type: 'server', message: error.message });
      return;
    }

    if (data.session == null && data.user) {
      setInfoMessage('Check your email to confirm, then sign in.');
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
            Sign in
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
            Sign up
          </button>
        </div>
      </div>

      {infoMessage && (
        <div className="mb-4 rounded-lg border border-madinah-gold/30 bg-madinah-sand/30 px-4 py-3 text-sm text-gray-800">
          {infoMessage}
        </div>
      )}

      {errors.root?.message && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="auth-email">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-madinah-gold ${
              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            {...register('email', {
              required: 'Email is required',
              validate: (value) => (value.includes('@') ? true : 'Enter a valid email'),
            })}
          />
          {errors.email?.message && <p className="mt-1 text-sm text-red-700">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="auth-password">
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
            className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-madinah-gold ${
              errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          {errors.password?.message && <p className="mt-1 text-sm text-red-700">{errors.password.message}</p>}
          {mode === 'signIn' && (
            <div className="mt-2 flex justify-end">
              <Link
                to="/auth/forgot-password"
                className="inline-flex min-h-[44px] items-center text-sm font-medium text-madinah-green hover:text-madinah-green/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                Forgot password?
              </Link>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-madinah-green px-4 py-3 text-white font-semibold hover:bg-madinah-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mode === 'signIn' ? 'Sign in' : 'Sign up'}
        </button>
      </form>
    </div>
  );
}
