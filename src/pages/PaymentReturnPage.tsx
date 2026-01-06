import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../auth/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { Bdi } from '../../components/Bdi';
import { Alert } from '../../components/Alert';
import { logDevError } from '../utils/logging';

import { BANK_ACCOUNTS, PAYMENT_MODE } from '../config/payments';
import { getBankTransferCopy } from '../config/bankTransferCopy';
const finalStates = new Set(['authorised', 'failed', 'cancelled', 'expired']);

type PaymentStatus = 'processing' | 'authorised' | 'failed' | 'cancelled' | 'expired' | 'unknown';

export const PaymentReturnPage: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  
  const bankCopy = getBankTransferCopy(language);

  if (PAYMENT_MODE !== 'paytabs') {
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="rounded-lg border p-6 space-y-4">
          <h1 className="text-2xl font-semibold">{bankCopy.bankTransferTitle}</h1>
          <p className="text-sm text-muted-foreground">{bankCopy.bankTransferIntro}</p>

          <div className="space-y-3">
            {BANK_ACCOUNTS.map((b) => (
              <div key={b.label} className="rounded-md border p-3 text-sm space-y-1">
                <div className="font-medium">{b.label}</div>
                <div><span className="font-medium">{bankCopy.labels.bankName}:</span> {b.bankName}</div>
                <div><span className="font-medium">{bankCopy.labels.accountHolder}:</span> {b.accountHolder}</div>
                {b.iban ? (<div><span className="font-medium">{bankCopy.labels.iban}:</span> {b.iban}</div>) : null}
                {b.swift ? (<div><span className="font-medium">{bankCopy.labels.swift}:</span> {b.swift}</div>) : null}
                {b.note ? (<div className="text-xs text-muted-foreground">{b.note}</div>) : null}
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">{bankCopy.bankTransferReferenceHint}</p>
        </div>
      </div>
    );
  }
const [status, setStatus] = useState<PaymentStatus>('processing');
  const [message, setMessage] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const cartId = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return (
      sessionStorage.getItem('paytabs_cart_id') ||
      new URLSearchParams(window.location.search).get('cart_id') ||
      new URLSearchParams(window.location.search).get('cartId')
    );
  }, []);

  const fetchStatus = async () => {
    if (!user) return;
    setChecking(true);
    let query = supabase
      .from('payments')
      .select('status,cart_id,tran_ref,amount,currency,created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (cartId) {
      query = query.eq('cart_id', cartId).limit(1);
    }

    const { data, error } = await query.maybeSingle();
    setChecking(false);

    if (error) {
      logDevError('fetch payment status failed', error);
      setMessage(t.portal.payment.errors.statusFailed);
      return;
    }

    if (!data) {
      setStatus('processing');
      return;
    }

    const nextStatus = data.status ?? 'processing';
    if (finalStates.has(nextStatus) && typeof window !== 'undefined' && cartId) {
      sessionStorage.removeItem('paytabs_cart_id');
    }
    setStatus(finalStates.has(nextStatus) ? (nextStatus as PaymentStatus) : 'processing');
  };

  useEffect(() => {
    if (!user) return;
    fetchStatus();

    intervalRef.current = window.setInterval(fetchStatus, 4000);
    timeoutRef.current = window.setTimeout(() => {
      window.clearInterval(intervalRef.current ?? undefined);
      setStatus((prev) => (finalStates.has(prev) ? prev : 'unknown'));
    }, 60000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [user, cartId]);

  const statusLabel =
    t.portal.payment.statusLabels?.[status as keyof typeof t.portal.payment.statusLabels] ?? status;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">{t.portal.payment.returnTitle}</h1>
            <p className="mt-2 text-sm text-gray-600">{t.portal.payment.signInPrompt}</p>
            <Link
              to="/auth"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-madinah-green px-6 py-2 text-sm font-semibold text-white hover:bg-madinah-green/90"
            >
              {t.portal.payment.signInButton}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">{t.portal.payment.returnTitle}</h1>
          <p className="mt-2 text-sm text-gray-600">{t.portal.payment.returnSubtitle}</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-madinah-green" />
              <span>{t.portal.payment.processing}</span>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              <span className="font-semibold text-gray-700">{t.portal.payment.currentStatus}</span>{' '}
              <Bdi>{statusLabel}</Bdi>
            </div>
            {message && (
              <Alert variant="error">
                <Bdi>{message}</Bdi>
              </Alert>
            )}
            {status !== 'processing' && status !== 'unknown' && (
              <Alert variant={status === 'authorised' ? 'success' : 'error'}>
                {status === 'authorised'
                  ? t.portal.payment.authorisedMessage
                  : t.portal.payment.failedMessage}
              </Alert>
            )}
            {status === 'unknown' && (
              <Alert variant="warning">
                {t.portal.payment.stillProcessing}
              </Alert>
            )}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={fetchStatus}
                disabled={checking}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:border-madinah-gold disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checking ? t.portal.payment.refreshing : t.portal.payment.refresh}
              </button>
              <Link
                to="/portal"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-madinah-green px-5 py-2 text-sm font-semibold text-white hover:bg-madinah-green/90"
              >
                {t.portal.payment.backToPortal}
              </Link>
            </div>
            <p className="text-xs text-gray-500">{t.portal.payment.callbackNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
