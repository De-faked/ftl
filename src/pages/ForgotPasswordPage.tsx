import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setStatus('sending');
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (resetError) {
      setStatus('idle');
    } else {
      setStatus('sent');
    }
    setCooldown(60);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-serif font-bold text-madinah-green">Forgot password</h1>
          <p className="text-sm text-gray-600 mt-2">
            Enter your email and we’ll send a password reset link.
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {(status === 'sent' || cooldown > 0) && !error && (
            <div className="mt-4 rounded-lg border border-madinah-gold/30 bg-madinah-sand/30 px-4 py-3 text-sm text-gray-800">
              If an account exists for this email, you will receive a reset link.
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="forgot-email">
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-madinah-gold"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending' || cooldown > 0}
              className="w-full min-h-[48px] rounded-lg bg-madinah-green px-4 py-3 text-white font-semibold hover:bg-madinah-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'sending'
                ? 'Sending…'
                : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : 'Send reset link'}
            </button>
          </form>

          <Link
            to="/"
            className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:border-madinah-gold"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};
