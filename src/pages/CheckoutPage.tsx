import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useMyPayments } from '../hooks/useMyPayments';
import { useLanguage } from '../../contexts/LanguageContext';
import { Bdi } from '../../components/Bdi';
import { Alert } from '../../components/Alert';
import { logDevError } from '../utils/logging';

import { BANK_ACCOUNTS, PAYMENT_MODE } from '../config/payments';
export const CheckoutPage: React.FC = () => {
  const { user, session } = useAuth();
  const { t, language } = useLanguage();
  const { payments, loading, error } = useMyPayments();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const pendingPayment = useMemo(
    () => payments.find((payment) => ['created', 'redirected'].includes(payment.status)) ?? null,
    [payments]
  );
  const paidPayment = useMemo(
    () => payments.find((payment) => payment.status === 'authorised') ?? null,
    [payments]
  );

  const handlePayNow = async () => {
    if (!pendingPayment) return;
    if (!session?.access_token) {
      setSubmitError(t.portal.payment.errors.authRequired);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

        if (PAYMENT_MODE !== 'paytabs') {
      setSubmitError(t.portal.payment.paymentsDisabled);
      setSubmitting(false);
      return;
    }

const response = await fetch('/api/paytabs/create', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        payment_id: pendingPayment.id,
        description: t.portal.payment.checkoutDescription,
        paypage_lang: language === 'ar' ? 'ar' : 'en'
      })
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.redirect_url) {
      logDevError('checkout payment create failed', payload ?? response.status);
      setSubmitError(t.portal.payment.errors.createFailed);
      setSubmitting(false);
      return;
    }

    if (payload.cart_id) {
      sessionStorage.setItem('paytabs_cart_id', payload.cart_id);
    }

    window.location.href = payload.redirect_url;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">{t.portal.payment.checkoutTitle}</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">{t.portal.payment.checkoutTitle}</h1>
          <p className="mt-2 text-sm text-gray-600">{t.portal.payment.checkoutSubtitle}</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          {loading ? (
            <div className="text-sm text-gray-500">{t.portal.payment.loading}</div>
          ) : error ? (
            <Alert variant="error">
              <Bdi>{error}</Bdi>
            </Alert>
          ) : pendingPayment ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-700">{t.portal.payment.summaryTitle}</p>
                <p className="mt-2 text-lg font-bold text-gray-900">
                  <Bdi>
                    {pendingPayment.amount} {pendingPayment.currency}
                  </Bdi>
                </p>
              </div>
              {submitError && (
                <Alert variant="error">
                  {submitError}
                </Alert>
              )}
              {PAYMENT_MODE === 'paytabs' ? (
<button
                type="button"
                onClick={handlePayNow}
                disabled={submitting}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-madinah-green px-5 py-3 text-sm font-semibold text-white hover:bg-madinah-green/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? t.portal.payment.redirecting : t.portal.payment.payNow}
              </button>
) : (

                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="text-lg font-semibold">{t.portal.payment.bankTransferTitle}</div>
                    <div className="text-sm text-muted-foreground">
                      {t.portal.payment.bankTransferIntro}
                    </div>

                    <div className="space-y-3">
                      {BANK_ACCOUNTS.map((b) => (
                        <div key={b.label} className="rounded-md bg-muted/30 p-3">
                          <div className="font-medium">{b.label}</div>
                          <div className="mt-2 space-y-1 text-sm">
                            <div>
                              <span className="font-medium">{t.portal.payment.bankTransferLabels.bankName}:</span>{' '}
                              <Bdi>{b.bankName}</Bdi>
                            </div>
                            <div>
                              <span className="font-medium">{t.portal.payment.bankTransferLabels.accountHolder}:</span>{' '}
                              <Bdi>{b.accountHolder}</Bdi>
                            </div>
                            {b.iban ? (
                              <div>
                                <span className="font-medium">{t.portal.payment.bankTransferLabels.iban}:</span>{' '}
                                <Bdi>{b.iban}</Bdi>
                              </div>
                            ) : null}
                            {b.swift ? (
                              <div>
                                <span className="font-medium">{t.portal.payment.bankTransferLabels.swift}:</span>{' '}
                                <Bdi>{b.swift}</Bdi>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {t.portal.payment.bankTransferReferenceHint}
                    </div>
                  </div>

)}
              <p className="text-xs text-gray-500">{t.portal.payment.secureNote}</p>
            </div>
          ) : paidPayment ? (
            <div className="space-y-3">
              <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
                {t.portal.payment.paidMessage}
              </div>
              <span className="inline-flex items-center self-start rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                {t.portal.payment.paidBadge}
              </span>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              {t.portal.payment.noPayment}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
