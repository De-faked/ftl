import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';
import { Bdi } from '../../components/Bdi';
import { getAuthErrorMessage } from '../utils/authError';
import { Alert } from '../../components/Alert';

type FormState = {
  password: string;
  confirm: string;
};

export const UpdatePasswordPage: React.FC = () => {
  const [form, setForm] = useState<FormState>({ password: '', confirm: '' });
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);
  const [exchanging, setExchanging] = useState(false);
  const [checkedRecovery, setCheckedRecovery] = useState(false);
  const [invalidRecovery, setInvalidRecovery] = useState(false);
  const { t } = useLanguage();

  const validationMessage = useMemo(() => {
    if (!form.password && !form.confirm) return null;
    if (form.password.length > 0 && form.password.length < 6) {
      return t.auth.updatePassword.validation.passwordMin;
    }
    if (form.confirm && form.password !== form.confirm) {
      return t.auth.updatePassword.validation.passwordMismatch;
    }
    return null;
  }, [form, t]);

  useEffect(() => {
    let active = true;
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
// Support hash-style recovery links:
// /auth/update-password#access_token=...&refresh_token=...&type=recovery
const rawHash = window.location.hash?.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
const hashParams = new URLSearchParams(rawHash ?? '');
const access_token = hashParams.get('access_token');
const refresh_token = hashParams.get('refresh_token');

if (!code && access_token && refresh_token) {
  const { error: sessionError } = await supabase.auth.setSession({ access_token, refresh_token });
  if (sessionError) throw sessionError;
}

      if (code && typeof supabase.auth.exchangeCodeForSession === 'function') {
        setExchanging(true);
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (active) {
          if (exchangeError) {
            setInvalidRecovery(true);
          }
          setExchanging(false);
        }
      }

      const { data } = await supabase.auth.getSession();
      if (active && data.session) {
        setCanUpdate(true);
        setInvalidRecovery(false);
      } else if (active) {
        setInvalidRecovery(true);
      }
      if (active) {
        setCheckedRecovery(true);
      }

      if (window.location.search || window.location.hash) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handleAuth();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setCanUpdate(true);
        setInvalidRecovery(false);
      }
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: form.password });
    if (!updateError) {
      await supabase.auth.signOut({ scope: 'others' });
    }
    setSubmitting(false);

    if (updateError) {
      setError(getAuthErrorMessage(updateError, t));
      return;
    }

    setInfo(t.auth.updatePassword.success);
    setForm({ password: '', confirm: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-serif font-bold text-madinah-green">{t.auth.updatePassword.title}</h1>
          <p className="text-sm text-gray-600 mt-2">
            {t.auth.updatePassword.subtitle}
          </p>

          {exchanging && (
            <div className="mt-4">
              <Alert variant="info">
                {t.auth.updatePassword.verifying}
              </Alert>
            </div>
          )}

          {error && (
            <div className="mt-4">
              <Alert variant="error">
                <Bdi>{error}</Bdi>
              </Alert>
            </div>
          )}

          {info && (
            <div className="mt-4">
              <Alert variant="success">
                {info}
              </Alert>
            </div>
          )}

          {checkedRecovery && invalidRecovery && !exchanging && (
            <div className="mt-4">
              <Alert variant="warning">
                <span>
                  {t.auth.updatePassword.invalidLink}{' '}
                  <Link to="/auth/forgot-password" className="font-semibold text-madinah-green hover:underline">
                    {t.auth.updatePassword.requestNewLink}
                  </Link>
                </span>
              </Alert>
            </div>
          )}

          {canUpdate && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="update-password">
                {t.auth.updatePassword.newPassword}
              </label>
              <input
                id="update-password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange('password')}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-madinah-gold disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="update-confirm">
                {t.auth.updatePassword.confirmPassword}
              </label>
              <input
                id="update-confirm"
                type="password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={handleChange('confirm')}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-madinah-gold disabled:bg-gray-50"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[48px] rounded-lg bg-madinah-green px-4 py-3 text-white font-semibold hover:bg-madinah-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? t.auth.updatePassword.submitting : t.auth.updatePassword.submit}
            </button>
          </form>
          )}

          <Link
            to="/"
            className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:border-madinah-gold"
          >
            {t.auth.updatePassword.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
};
