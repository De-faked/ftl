import React, { useMemo, useState } from 'react';
import { useAdminPayments } from '../../src/hooks/useAdminPayments';
import { useAuth } from '../../src/auth/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { Bdi } from '../Bdi';
import { Alert } from '../Alert';
import { logDevError } from '../../src/utils/logging';

const statusTone = (status: string) => {
  switch (status) {
    case 'authorised':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'failed':
    case 'cancelled':
    case 'expired':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200';
  }
};

export const AdminPaymentsPanel: React.FC = () => {
  const { payments, loading, error, refresh } = useAdminPayments();
  const { session } = useAuth();
  const { t } = useLanguage();
  const [userId, setUserId] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('SAR');
  const [description, setDescription] = useState(t.admin.payments.descriptionDefault);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [reconcilingId, setReconcilingId] = useState<string | null>(null);
  const [reconcileAlert, setReconcileAlert] = useState<{ message: string; variant: 'error' | 'success' } | null>(null);

  const rows = useMemo(() => payments, [payments]);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!session?.access_token) {
      setSubmitError(t.admin.payments.errors.authRequired);
      return;
    }

    const trimmedUserId = userId.trim();
    const amountValue = Number(amount);

    if (!trimmedUserId) {
      setSubmitError(t.admin.payments.errors.userRequired);
      return;
    }

    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      setSubmitError(t.admin.payments.errors.amountRequired);
      return;
    }

    setSubmitting(true);

    const response = await fetch('/api/paytabs/create', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        target_user_id: trimmedUserId,
        application_id: applicationId.trim() || null,
        amount: amountValue,
        currency: currency.trim().toUpperCase(),
        description: description.trim() || t.admin.payments.descriptionDefault
      })
    });

    const payload = await response.json().catch(() => null);
    setSubmitting(false);

    if (!response.ok || !payload?.redirect_url) {
      logDevError('admin payment create failed', payload ?? response.status);
      setSubmitError(t.admin.payments.errors.createFailed);
      return;
    }

    setSubmitSuccess(payload.redirect_url as string);
    setUserId('');
    setApplicationId('');
    setAmount('');
    await refresh();
  };

  const handleReconcile = async (cartId: string, tranRef: string | null) => {
    if (!session?.access_token) {
      setReconcileAlert({ message: t.admin.payments.errors.authRequired, variant: 'error' });
      return;
    }

    setReconcilingId(cartId);
    setReconcileAlert(null);

    const response = await fetch('/api/paytabs/query', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify(tranRef ? { tran_ref: tranRef } : { cart_id: cartId })
    });

    const payload = await response.json().catch(() => null);
    setReconcilingId(null);

    if (!response.ok) {
      logDevError('admin payment reconcile failed', payload ?? response.status);
      setReconcileAlert({ message: t.admin.payments.errors.reconcileFailed, variant: 'error' });
      return;
    }

    setReconcileAlert({ message: t.admin.payments.reconcileSuccess, variant: 'success' });
    await refresh();
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">{t.admin.payments.title}</h2>
        <p className="text-sm text-gray-500">{t.admin.payments.subtitle}</p>
      </div>

      <div className="p-6 border-b border-gray-100">
        <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm font-semibold text-gray-600">
            {t.admin.payments.userIdLabel}
            <input
              type="text"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
              placeholder={t.admin.payments.userIdPlaceholder}
              disabled={submitting}
            />
          </label>
          <label className="space-y-1 text-sm font-semibold text-gray-600">
            {t.admin.payments.applicationIdLabel}
            <input
              type="text"
              value={applicationId}
              onChange={(event) => setApplicationId(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
              placeholder={t.admin.payments.applicationIdPlaceholder}
              disabled={submitting}
            />
          </label>
          <label className="space-y-1 text-sm font-semibold text-gray-600">
            {t.admin.payments.amountLabel}
            <input
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
              placeholder={t.admin.payments.amountPlaceholder}
              min={1}
              step="0.01"
              disabled={submitting}
            />
          </label>
          <label className="space-y-1 text-sm font-semibold text-gray-600">
            {t.admin.payments.currencyLabel}
            <input
              type="text"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
              disabled={submitting}
            />
          </label>
          <label className="md:col-span-2 space-y-1 text-sm font-semibold text-gray-600">
            {t.admin.payments.descriptionLabel}
            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
              disabled={submitting}
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-madinah-green px-5 py-2 text-sm font-semibold text-white hover:bg-madinah-green/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              disabled={submitting}
            >
              {submitting ? t.admin.payments.creating : t.admin.payments.createButton}
            </button>
          </div>
        </form>
        {submitError && (
          <div className="mt-3">
            <Alert variant="error">
              <Bdi>{submitError}</Bdi>
            </Alert>
          </div>
        )}
        {submitSuccess && (
          <div className="mt-3">
            <Alert variant="success">
              <span>
                {t.admin.payments.createSuccess}{' '}
                <a
                  href={submitSuccess}
                  className="font-semibold text-madinah-green hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.admin.payments.paymentLink}
                </a>
              </span>
            </Alert>
          </div>
        )}
      </div>

      <div className="p-6">
        {reconcileAlert && (
          <div className="mb-4">
            <Alert variant={reconcileAlert.variant}>
              <Bdi>{reconcileAlert.message}</Bdi>
            </Alert>
          </div>
        )}
        {loading ? (
          <div className="text-sm text-gray-500">{t.admin.payments.loading}</div>
        ) : error ? (
          <Alert variant="error">
            <Bdi>{error}</Bdi>
          </Alert>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            {t.admin.payments.empty}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">{t.admin.payments.headers.user}</th>
                  <th className="px-3 py-2 text-left">{t.admin.payments.headers.amount}</th>
                  <th className="px-3 py-2 text-left">{t.admin.payments.headers.status}</th>
                  <th className="px-3 py-2 text-left">{t.admin.payments.headers.cart}</th>
                  <th className="px-3 py-2 text-left">{t.admin.payments.headers.tran}</th>
                  <th className="px-3 py-2 text-left">{t.admin.payments.headers.created}</th>
                  <th className="px-3 py-2 text-left">{t.admin.payments.headers.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                  <tr key={row.id} className="text-gray-700">
                    <td className="px-3 py-3"><Bdi>{row.user_id}</Bdi></td>
                    <td className="px-3 py-3">
                      <Bdi>
                        {row.amount} {row.currency}
                      </Bdi>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${statusTone(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-3"><Bdi>{row.cart_id}</Bdi></td>
                    <td className="px-3 py-3"><Bdi>{row.tran_ref ?? t.common.emptyValue}</Bdi></td>
                    <td className="px-3 py-3">
                      <Bdi>{row.created_at ? new Date(row.created_at).toLocaleDateString() : t.common.emptyValue}</Bdi>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => handleReconcile(row.cart_id, row.tran_ref)}
                        disabled={reconcilingId === row.cart_id}
                        className="inline-flex min-h-[36px] items-center justify-center rounded-lg border border-gray-200 px-3 text-xs font-semibold text-gray-700 hover:border-madinah-gold disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {reconcilingId === row.cart_id ? t.admin.payments.reconciling : t.admin.payments.reconcile}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
