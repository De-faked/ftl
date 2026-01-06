import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Bdi } from '../../../components/Bdi';
import type { PaymentRecord } from '../../hooks/useMyPayments';
import { PAYMENT_MODE } from '../../config/payments';

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

export const PaymentStatusPanel: React.FC<{ payment: PaymentRecord }> = ({ payment }) => {
  const { t, dir } = useLanguage();
  const isPaid = payment.status === 'authorised';
  const statusLabel =
    t.portal.payment.statusLabels?.[payment.status as keyof typeof t.portal.payment.statusLabels] ??
    payment.status;

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm" dir={dir}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 space-y-2">
          <h2 className="text-lg font-bold text-gray-900">{t.portal.payment.title}</h2>
          <p className="text-sm text-gray-600 break-words">
            {isPaid ? t.portal.payment.paidMessage : t.portal.payment.requiredMessage}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span>
              {t.portal.payment.amountLabel}{' '}
              <Bdi dir="auto">
                {payment.amount} {payment.currency}
              </Bdi>
            </span>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${statusTone(
                payment.status
              )}`}
            >
              <Bdi dir="auto">{statusLabel}</Bdi>
            </span>
          </div>
        </div>
        {!isPaid && PAYMENT_MODE === 'paytabs' && (
          <Link
            to="/checkout"
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-madinah-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-madinah-green/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold focus-visible:ring-offset-2 md:w-auto"
          >
            {t.portal.payment.payNow}
          </Link>
        )}
        {isPaid && (
          <span className="inline-flex items-center self-start rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            {t.portal.payment.paidBadge}
          </span>
        )}
      </div>
    </section>
  );
};
