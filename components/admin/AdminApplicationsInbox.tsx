import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Copy, Eye, MessageCircle, Phone, RefreshCw, Search, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAdminApplicationsInbox } from '../../src/hooks/useAdminApplicationsInbox';
import type { AdminInboxApplication } from '../../src/hooks/useAdminApplicationsInbox';
import type { Course, CoursePlan } from '../../types';
import { normalizePlanDays, type NormalizedPlanDays } from '../../src/utils/planDays';
import { Bdi } from '../Bdi';
import { Alert } from '../Alert';
import { Language } from '../../types';

type AdminStatus = 'new' | 'approved' | 'payment_link_sent' | 'paid' | 'rejected';

type EnrichedApplication = AdminInboxApplication & {
  adminStatus: AdminStatus;
  contact: {
    fullName: string;
    phone: string | null;
    email: string | null;
    nationality: string | null;
  };
  courseInfo: {
    courseId: string | null;
    courseTitle: string;
    optionLabel: string | null;
    planDays: NormalizedPlanDays | null;
    needsOption: boolean;
    plans: CoursePlan[];
  };
  submittedAt: string | null;
  submittedLabel: string;
};

type ToastState = { message: string; variant: 'success' | 'error' } | null;

const deriveStatus = (application: AdminInboxApplication): AdminStatus => {
  if ((application.status ?? '').toLowerCase() === 'rejected') return 'rejected';
  if (application.paymentPaidAt) return 'paid';
  if (application.paymentLink && application.paymentLink.trim().length > 0) return 'payment_link_sent';
  if ((application.status ?? '').toLowerCase() === 'approved') return 'approved';
  return 'new';
};

const formatDateTime = (value: string | null, language: Language, fallback: string): string => {
  if (!value) return fallback;
  try {
    const locale = language === 'ar' ? 'ar-SA' : language === 'id' ? 'id-ID' : 'en-US';
    return new Date(value).toLocaleString(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch (err) {
    return fallback;
  }
};

const buildWhatsappNumber = (phone: string | null): string | null => {
  if (!phone) return null;
  const digits = phone.replace(/\D+/g, '');
  if (!digits) return null;
  return digits;
};

const copyToClipboard = async (value: string) => {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};

type ActionButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'danger' | 'ghost';
};

const ActionButton: React.FC<ActionButtonProps> = ({ label, onClick, disabled, variant = 'ghost' }) => {
  const base =
    'inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[40px]';
  const variants: Record<'primary' | 'danger' | 'ghost', string> = {
    primary: 'bg-madinah-green text-white hover:bg-madinah-green/90 disabled:bg-madinah-green/40',
    danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-50',
    ghost:
      'border border-gray-200 text-gray-700 hover:border-madinah-gold hover:text-madinah-gold disabled:opacity-50',
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]}`}>
      {label}
    </button>
  );
};

const Modal: React.FC<{
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  dir: 'ltr' | 'rtl';
}> = ({ open, title, onClose, children, dir }) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" dir={dir}>
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 p-2 text-gray-500 hover:text-gray-900"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

type PaymentLinkModalProps = {
  application: EnrichedApplication;
  open: boolean;
  onClose: () => void;
  onSave: (link: string) => Promise<{ error: string | null }>;
  saving: boolean;
  t: typeof import('../../utils/translations').translations['ar']['admin']['applicationsInbox'];
  template: string;
  dir: 'ltr' | 'rtl';
};

const PaymentLinkModal: React.FC<PaymentLinkModalProps> = ({ application, open, onClose, onSave, saving, t, template, dir }) => {
  const [linkValue, setLinkValue] = useState(application.paymentLink ?? '');
  const [localError, setLocalError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLinkValue(application.paymentLink ?? '');
    setLocalError(null);
    setSaved(false);
  }, [application, open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);
    const trimmed = linkValue.trim();
    if (!trimmed || !trimmed.toLowerCase().startsWith('https://')) {
      setLocalError(t.payment.modal.invalidLink);
      return;
    }
    const result = await onSave(trimmed);
    if (result.error) {
      setLocalError(result.error);
      return;
    }
    setSaved(true);
  };

  const buildMessage = () => {
    return template.replace('{applicationId}', application.publicId).replace('{paymentLink}', linkValue.trim() || application.paymentLink || '');
  };

  const whatsappNumber = buildWhatsappNumber(application.contact.phone);
  const messageText = buildMessage();
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`
    : null;

  return (
    <Modal open={open} onClose={onClose} title={t.payment.modal.title} dir={dir}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700" htmlFor="payment-link-input">
            {t.payment.modal.inputLabel}
          </label>
          <input
            id="payment-link-input"
            type="url"
            value={linkValue}
            onChange={(event) => setLinkValue(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
            placeholder="https://"
            dir="ltr"
          />
          {localError && <p className="text-sm text-red-600">{localError}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-madinah-green px-4 text-sm font-semibold text-white hover:bg-madinah-green/90 disabled:opacity-60"
            disabled={saving}
          >
            {saving ? t.payment.modal.saving : t.payment.modal.save}
          </button>
          {saved && <span className="text-sm text-madinah-green font-semibold">{t.payment.modal.saved}</span>}
        </div>
        {(linkValue.trim() || application.paymentLink) && (
          <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-700">{t.payment.modal.actionsTitle}</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-700 hover:border-madinah-gold"
                onClick={() => void copyToClipboard(linkValue.trim() || application.paymentLink || '')}
              >
                <Copy className="h-4 w-4" />
                {t.payment.actions.copyLink}
              </button>
              <button
                type="button"
                className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-700 hover:border-madinah-gold"
                onClick={() => void copyToClipboard(messageText)}
              >
                <MessageCircle className="h-4 w-4" />
                {t.payment.actions.copyMessage}
              </button>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-700 hover:border-madinah-gold"
                >
                  <Phone className="h-4 w-4" />
                  {t.payment.actions.openWhatsapp}
                </a>
              )}
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

type RejectModalProps = {
  application: EnrichedApplication;
  open: boolean;
  onClose: () => void;
  onReject: (payload: { preset: string; details: string }) => Promise<{ error: string | null }>;
  rejecting: boolean;
  t: typeof import('../../utils/translations').translations['ar']['admin']['applicationsInbox'];
  dir: 'ltr' | 'rtl';
};

const RejectModal: React.FC<RejectModalProps> = ({ application, open, onClose, onReject, rejecting, t, dir }) => {
  const [preset, setPreset] = useState('missing_info');
  const [details, setDetails] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setPreset('missing_info');
    setDetails('');
    setLocalError(null);
  }, [open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);
    const result = await onReject({ preset, details: details.trim() });
    if (result.error) {
      setLocalError(result.error);
      return;
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={t.rejectModal.title.replace('{id}', application.publicId)} dir={dir}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700" htmlFor="reject-reason-select">
            {t.rejectModal.reasonLabel}
          </label>
          <select
            id="reject-reason-select"
            value={preset}
            onChange={(event) => setPreset(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
          >
            {Object.entries(t.rejectModal.reasonOptions).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700" htmlFor="reject-details">
            {t.rejectModal.notesLabel}
          </label>
          <textarea
            id="reject-details"
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
            rows={3}
          />
        </div>
        {localError && <p className="text-sm text-red-600">{localError}</p>}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            disabled={rejecting}
          >
            {rejecting ? t.rejectModal.rejecting : t.rejectModal.reject}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:border-madinah-gold"
          >
            {t.rejectModal.cancel}
          </button>
        </div>
      </form>
    </Modal>
  );
};

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  confirming: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  dir: 'ltr' | 'rtl';
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  confirming,
  title,
  body,
  confirmLabel,
  cancelLabel,
  dir,
}) => {
  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title={title} dir={dir}>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">{body}</p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void onConfirm()}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-madinah-green px-4 text-sm font-semibold text-white hover:bg-madinah-green/90 disabled:opacity-60"
            disabled={confirming}
          >
            {confirming ? `${confirmLabel}…` : confirmLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:border-madinah-gold"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

type DetailsModalProps = {
  application: EnrichedApplication;
  open: boolean;
  onClose: () => void;
  dir: 'ltr' | 'rtl';
  t: typeof import('../../utils/translations').translations['ar']['admin']['applicationsInbox'];
  onAssignPlan: (plan: NormalizedPlanDays) => void;
  assigningPlan: boolean;
  onOpenPaymentModal: () => void;
  onMarkPaid: () => void;
  language: Language;
  emptyValue: string;
};

const ApplicationDetailsModal: React.FC<DetailsModalProps> = ({
  application,
  open,
  onClose,
  dir,
  t,
  onAssignPlan,
  assigningPlan,
  onOpenPaymentModal,
  onMarkPaid,
  language,
  emptyValue,
}) => {
  const plans = application.courseInfo.plans;
  const [planSelection, setPlanSelection] = useState<NormalizedPlanDays | ''>(
    application.courseInfo.planDays ?? (plans[0]?.id ?? '')
  );

  useEffect(() => {
    setPlanSelection(application.courseInfo.planDays ?? (plans[0]?.id ?? ''));
  }, [application.courseInfo.planDays, plans]);

  const timeline = [
    {
      key: 'submitted',
      label: t.details.timeline.submitted,
      done: true,
      timestamp: application.submittedAt,
    },
    {
      key: 'approved',
      label: t.details.timeline.approved,
      done: application.adminStatus !== 'new' && application.adminStatus !== 'rejected',
      timestamp: application.adminStatus !== 'new' ? application.updatedAt : null,
    },
    {
      key: 'payment_link_sent',
      label: t.details.timeline.paymentLink,
      done: Boolean(application.paymentLinkSentAt),
      timestamp: application.paymentLinkSentAt,
    },
    {
      key: 'paid',
      label: t.details.timeline.paid,
      done: Boolean(application.paymentPaidAt),
      timestamp: application.paymentPaidAt,
    },
    {
      key: 'rejected',
      label: t.details.timeline.rejected,
      done: application.adminStatus === 'rejected',
      timestamp: application.adminStatus === 'rejected' ? application.updatedAt : null,
    },
  ];

  const whatsappNumber = buildWhatsappNumber(application.contact.phone);
  const paymentMessage = (application.paymentLink ?? '')
    ? t.payment.messageTemplate
        .replace('{applicationId}', application.publicId)
        .replace('{paymentLink}', application.paymentLink ?? '')
    : '';

  const canMarkPaid = application.adminStatus === 'payment_link_sent';

  const handlePlanAssign = () => {
    if (!planSelection) return;
    onAssignPlan(planSelection as NormalizedPlanDays);
  };

  return (
    <Modal open={open} onClose={onClose} title={t.details.title.replace('{id}', application.publicId)} dir={dir}>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-600">{t.details.applicationId}</p>
          <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1 text-base font-semibold text-gray-900">
            <Bdi dir="auto">{application.publicId}</Bdi>
            <button
              type="button"
              className="rounded-full border border-gray-200 p-1 text-gray-500 hover:border-madinah-gold hover:text-madinah-gold"
              onClick={() => void copyToClipboard(application.publicId)}
              aria-label={t.copyId}
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-700">{t.details.contactTitle}</p>
            <div className="space-y-1 text-sm text-gray-600">
              <div>
                <span className="font-semibold text-gray-900">{t.details.contactName}:</span>{' '}
                <Bdi dir="auto">{application.contact.fullName}</Bdi>
              </div>
              <div>
                <span className="font-semibold text-gray-900">{t.details.contactNationality}:</span>{' '}
                <Bdi dir="auto">{application.contact.nationality ?? emptyValue}</Bdi>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="font-semibold text-gray-900">{t.details.contactEmail}:</span>
                {application.contact.email ? (
                  <a className="text-madinah-green hover:underline" href={`mailto:${application.contact.email}`}>
                    {application.contact.email}
                  </a>
                ) : (
                  <span>{emptyValue}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="font-semibold text-gray-900">{t.details.contactPhone}:</span>
                {application.contact.phone ? (
                  <a className="text-madinah-green hover:underline" href={`tel:${application.contact.phone}`}>
                    {application.contact.phone}
                  </a>
                ) : (
                  <span>{emptyValue}</span>
                )}
              </div>
              {whatsappNumber && (
                <a
                  className="inline-flex items-center gap-2 text-sm font-semibold text-madinah-green hover:underline"
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t.details.openWhatsapp}
                </a>
              )}
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-700">{t.details.courseTitle}</p>
            <div className="space-y-1 text-sm text-gray-700">
              <div className="font-semibold text-gray-900">
                <Bdi dir="auto">{application.courseInfo.courseTitle}</Bdi>
              </div>
              <div>
                <span className="font-semibold text-gray-900">{t.details.courseOption}:</span>{' '}
                {application.courseInfo.optionLabel ? (
                  <Bdi dir="auto">{application.courseInfo.optionLabel}</Bdi>
                ) : (
                  <span>{emptyValue}</span>
                )}
              </div>
              {application.courseInfo.needsOption && plans.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold uppercase text-gray-500" htmlFor="plan-select">
                    {t.details.assignPlan}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <select
                      id="plan-select"
                      value={planSelection}
                      onChange={(event) => setPlanSelection(event.target.value as NormalizedPlanDays | '')}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                    >
                      {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.duration}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handlePlanAssign}
                      className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-madinah-green px-4 text-sm font-semibold text-white hover:bg-madinah-green/90 disabled:opacity-50"
                      disabled={!planSelection || assigningPlan}
                    >
                      {assigningPlan ? t.details.assigning : t.details.savePlan}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-gray-100 bg-white p-4">
          <p className="text-sm font-semibold text-gray-700">{t.details.timeline.title}</p>
          <div className="space-y-3">
            {timeline.map((entry) => (
              <div key={entry.key} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${entry.done ? 'border-madinah-green bg-madinah-green/10 text-madinah-green' : 'border-gray-200 text-gray-400'}`}
                  >
                    {entry.done ? '✓' : '•'}
                  </span>
                  <span className="font-semibold text-gray-900">{entry.label}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {entry.timestamp
                    ? formatDateTime(entry.timestamp, language, emptyValue)
                    : t.details.timeline.pending}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">{t.payment.sectionTitle}</p>
              <p className="text-xs text-gray-500">{t.payment.sectionSubtitle}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onOpenPaymentModal}
                className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:border-madinah-gold"
              >
                {application.paymentLink ? t.payment.actions.resend : t.payment.actions.addLink}
              </button>
              {canMarkPaid && (
                <button
                  type="button"
                  onClick={onMarkPaid}
                  className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-madinah-green px-4 text-sm font-semibold text-white hover:bg-madinah-green/90"
                >
                  {t.payment.actions.markPaid}
                </button>
              )}
            </div>
          </div>
          {application.paymentLink ? (
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{t.payment.linkLabel}:</span>
                <a className="text-madinah-green hover:underline" href={application.paymentLink} target="_blank" rel="noreferrer">
                  {application.paymentLink}
                </a>
              </div>
              {application.paymentLinkSentAt && (
                <div className="text-xs text-gray-500">
                  {t.payment.sentLabel} {formatDateTime(application.paymentLinkSentAt, language, emptyValue)}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <ActionButton
                  label={t.payment.actions.copyLink}
                  onClick={() => void copyToClipboard(application.paymentLink ?? '')}
                />
                <ActionButton
                  label={t.payment.actions.copyMessage}
                  onClick={() => void copyToClipboard(paymentMessage)}
                />
                {whatsappNumber && (
                  <ActionButton
                    label={t.payment.actions.openWhatsapp}
                    onClick={() => {
                      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(paymentMessage)}`;
                      window.open(url, '_blank', 'noopener');
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
              {t.payment.empty}
            </div>
          )}
        </div>

        {application.rejectionReason && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">{t.details.rejectionReason}</p>
            <p className="mt-1 whitespace-pre-wrap">{application.rejectionReason}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export const AdminApplicationsInbox: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const {
    applications,
    loading,
    error,
    refresh,
    approve,
    reject,
    sendPaymentLink,
    markPaid,
    assignPlan,
  } = useAdminApplicationsInbox();
  const courses = useMemo(() => t.home.courses.list as Course[], [t]);
  const courseMap = useMemo(() => new Map(courses.map((course) => [course.id, course])), [courses]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AdminStatus>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paymentModalId, setPaymentModalId] = useState<string | null>(null);
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [markPaidId, setMarkPaidId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [pendingActionKey, setPendingActionKey] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const adminStrings = t.admin.applicationsInbox;

  const enrichedApplications = useMemo<EnrichedApplication[]>(() => {
    return applications.map((application) => {
      const adminStatus = deriveStatus(application);
      const data = application.data ?? {};
      const rawFullName = typeof data.fullName === 'string' ? data.fullName.trim() : '';
      const contact = {
        fullName: rawFullName || application.profileName || application.publicId,
        phone: typeof data.phone === 'string' && data.phone.trim() ? data.phone.trim() : null,
        email: application.profileEmail ?? null,
        nationality: typeof data.nationality === 'string' && data.nationality.trim() ? data.nationality.trim() : null,
      };
      const courseId =
        typeof data.courseId === 'string' && data.courseId.trim() ? data.courseId.trim() : null;
      const course = courseId ? courseMap.get(courseId) ?? null : null;
      const planDays = normalizePlanDays(data.planDays);
      const plans = course?.plans ?? [];
      const selectedPlan = plans.find((plan) => plan.id === planDays) ?? null;
      const needsOption = Boolean(plans.length > 0 && !selectedPlan);
      const optionLabel = selectedPlan ? `${course?.title ?? ''} • ${selectedPlan.duration}` : needsOption ? adminStrings.needsOption : null;
      const courseTitle = course?.title ?? (courseId ?? adminStrings.courseUnknown);

      return {
        ...application,
        adminStatus,
        contact,
        courseInfo: {
          courseId,
          courseTitle,
          optionLabel,
          planDays,
          needsOption,
          plans,
        },
        submittedAt: application.createdAt ?? application.updatedAt ?? null,
        submittedLabel: formatDateTime(application.createdAt ?? application.updatedAt, language, t.common.emptyValue),
      };
    });
  }, [adminStrings.courseUnknown, adminStrings.needsOption, applications, courseMap, language, t.common.emptyValue]);

  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return enrichedApplications.filter((application) => {
      const matchesStatus = statusFilter === 'all' ? true : application.adminStatus === statusFilter;
      const searchHaystack = [
        application.publicId,
        application.contact.fullName,
        application.contact.email,
        application.contact.phone,
        application.courseInfo.courseTitle,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesSearch = normalizedSearch ? searchHaystack.includes(normalizedSearch) : true;
      return matchesStatus && matchesSearch;
    });
  }, [enrichedApplications, search, statusFilter]);

  const selectedApplication = selectedId
    ? enrichedApplications.find((application) => application.id === selectedId) ?? null
    : null;
  const paymentModalApplication = paymentModalId
    ? enrichedApplications.find((application) => application.id === paymentModalId) ?? null
    : null;
  const rejectModalApplication = rejectModalId
    ? enrichedApplications.find((application) => application.id === rejectModalId) ?? null
    : null;
  const markPaidApplication = markPaidId
    ? enrichedApplications.find((application) => application.id === markPaidId) ?? null
    : null;

  const isActionPending = (id: string, type: string) => pendingActionKey === `${id}:${type}`;

  const runAction = useCallback(
    async (
      applicationId: string,
      type: string,
      action: () => Promise<{ error: string | null }>,
      successMessage: string
    ) => {
      const key = `${applicationId}:${type}`;
      setPendingActionKey(key);
      const result = await action();
      setPendingActionKey((current) => (current === key ? null : current));
      if (result.error) {
        setToast({ message: result.error, variant: 'error' });
      } else {
        setToast({ message: successMessage, variant: 'success' });
      }
      return result;
    },
    []
  );

  const handleApprove = (application: EnrichedApplication) => {
    if (application.courseInfo.needsOption) {
      setToast({ message: adminStrings.errors.planRequired, variant: 'error' });
      return;
    }
    void runAction(application.id, 'approve', () => approve(application.id), adminStrings.success.approved);
  };

  const handleReject = (payload: { preset: string; details: string }) => {
    if (!rejectModalApplication) return Promise.resolve({ error: null });
    const reasonBase = adminStrings.rejectModal.reasonOptions[payload.preset] ?? '';
    const reason = payload.details ? `${reasonBase} — ${payload.details}` : reasonBase;
    return runAction(
      rejectModalApplication.id,
      'reject',
      () => reject(rejectModalApplication.id, reason),
      adminStrings.success.rejected
    );
  };

  const handlePaymentLinkSave = (link: string) => {
    if (!paymentModalApplication) return Promise.resolve({ error: null });
    return runAction(
      paymentModalApplication.id,
      'payment',
      () => sendPaymentLink(paymentModalApplication.id, link),
      adminStrings.success.paymentLinkSaved
    );
  };

  const handleMarkPaid = async () => {
    if (!markPaidApplication) return;
    const result = await runAction(
      markPaidApplication.id,
      'markPaid',
      () => markPaid(markPaidApplication.id),
      adminStrings.success.markedPaid
    );
    if (!result.error) {
      setMarkPaidId(null);
    }
  };

  const handleAssignPlan = (application: EnrichedApplication, plan: NormalizedPlanDays) => {
    void runAction(
      application.id,
      'plan',
      () => assignPlan(application.id, plan),
      adminStrings.success.planAssigned
    );
  };

  return (
    <section id="applications" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{adminStrings.title}</h2>
          <p className="text-sm text-gray-600">{adminStrings.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-madinah-gold"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {adminStrings.refresh}
        </button>
      </div>

      {toast && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
            toast.variant === 'success'
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {toast.message}
        </div>
      )}

      {error && (
        <Alert variant="error">
          <Bdi dir="auto">{error}</Bdi>
        </Alert>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="grid gap-4 md:grid-cols-[2fr_1fr_auto]">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-gray-500" htmlFor="applications-search">
                {adminStrings.searchLabel}
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="applications-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                  placeholder={adminStrings.searchPlaceholder}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-gray-500" htmlFor="applications-status-filter">
                {adminStrings.statusFilter}
              </label>
              <select
                id="applications-status-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as 'all' | AdminStatus)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
              >
                <option value="all">{adminStrings.statusOptions.all}</option>
                <option value="new">{adminStrings.statusOptions.new}</option>
                <option value="approved">{adminStrings.statusOptions.approved}</option>
                <option value="payment_link_sent">{adminStrings.statusOptions.paymentLinkSent}</option>
                <option value="paid">{adminStrings.statusOptions.paid}</option>
                <option value="rejected">{adminStrings.statusOptions.rejected}</option>
              </select>
            </div>
            <div className="flex items-end">
              {(search || statusFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('all');
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-madinah-gold"
                >
                  <X className="h-4 w-4" />
                  {adminStrings.clearFilters}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3">{adminStrings.tableHeaders.id}</th>
                <th className="px-6 py-3">{adminStrings.tableHeaders.contact}</th>
                <th className="px-6 py-3">{adminStrings.tableHeaders.course}</th>
                <th className="px-6 py-3">{adminStrings.tableHeaders.submitted}</th>
                <th className="px-6 py-3">{adminStrings.tableHeaders.status}</th>
                <th className="px-6 py-3">{adminStrings.tableHeaders.actions}</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filteredApplications.length === 0 && (
                <tr>
                  <td className="px-6 py-10 text-center text-sm text-gray-500" colSpan={6}>
                    {search || statusFilter !== 'all' ? adminStrings.emptyFiltered : adminStrings.emptyDefault}
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td className="px-6 py-10 text-center text-sm text-gray-500" colSpan={6}>
                    {adminStrings.loading}
                  </td>
                </tr>
              )}
              {!loading &&
                filteredApplications.map((application) => (
                  <tr key={application.id} className="border-b border-gray-100">
                    <td className="px-6 py-4 align-top">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        <Bdi dir="auto">{application.publicId}</Bdi>
                        <button
                          type="button"
                          className="rounded-full border border-gray-200 p-1 text-gray-500 hover:border-madinah-gold hover:text-madinah-gold"
                          onClick={() => void copyToClipboard(application.publicId)}
                          aria-label={adminStrings.copyId}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="font-semibold text-gray-900">
                        <Bdi dir="auto">{application.contact.fullName}</Bdi>
                      </div>
                      <div className="text-xs text-gray-500 flex flex-col gap-1">
                        {application.contact.nationality ? (
                          <Bdi dir="auto">{application.contact.nationality}</Bdi>
                        ) : (
                          <span>{t.common.emptyValue}</span>
                        )}
                        {application.contact.phone ? (
                          <a
                            className="text-madinah-green hover:underline"
                            href={`tel:${application.contact.phone}`}
                          >
                            {application.contact.phone}
                          </a>
                        ) : (
                          <span>{t.common.emptyValue}</span>
                        )}
                        {application.contact.email ? (
                          <a
                            className="text-madinah-green hover:underline"
                            href={`mailto:${application.contact.email}`}
                          >
                            {application.contact.email}
                          </a>
                        ) : (
                          <span>{t.common.emptyValue}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="font-semibold text-gray-900">
                        <Bdi dir="auto">{application.courseInfo.courseTitle}</Bdi>
                      </div>
                      <div className="text-xs text-gray-500">
                        {application.courseInfo.optionLabel ? (
                          <Bdi dir="auto">{application.courseInfo.optionLabel}</Bdi>
                        ) : (
                          <span>{t.common.emptyValue}</span>
                        )}
                      </div>
                      {application.courseInfo.needsOption && (
                        <div className="mt-1 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                          {adminStrings.needsOption}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top text-gray-700">{application.submittedLabel}</td>
                    <td className="px-6 py-4 align-top">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          application.adminStatus === 'rejected'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : application.adminStatus === 'paid'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : application.adminStatus === 'payment_link_sent'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : application.adminStatus === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-50 text-gray-700 border border-gray-200'
                        }`}
                      >
                        {adminStrings.statusLabels[application.adminStatus]}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-wrap gap-2">
                        <ActionButton label={adminStrings.actions.view} onClick={() => setSelectedId(application.id)} />
                        {application.adminStatus === 'new' && (
                          <>
                            <ActionButton
                              label={adminStrings.actions.approve}
                              onClick={() => handleApprove(application)}
                              disabled={isActionPending(application.id, 'approve')}
                              variant="primary"
                            />
                            <ActionButton
                              label={adminStrings.actions.reject}
                              onClick={() => setRejectModalId(application.id)}
                              disabled={isActionPending(application.id, 'reject')}
                              variant="danger"
                            />
                          </>
                        )}
                        {application.adminStatus === 'approved' && (
                          <ActionButton
                            label={adminStrings.actions.paymentLink}
                            onClick={() => setPaymentModalId(application.id)}
                            disabled={isActionPending(application.id, 'payment')}
                            variant="primary"
                          />
                        )}
                        {application.adminStatus === 'payment_link_sent' && (
                          <>
                            <ActionButton
                              label={adminStrings.actions.copyLink}
                              onClick={() => void copyToClipboard(application.paymentLink ?? '')}
                            />
                            <ActionButton
                              label={adminStrings.actions.copyMessage}
                              onClick={() =>
                                void copyToClipboard(
                                  adminStrings.payment.messageTemplate
                                    .replace('{applicationId}', application.publicId)
                                    .replace('{paymentLink}', application.paymentLink ?? '')
                                )
                              }
                            />
                            <ActionButton
                              label={adminStrings.actions.whatsapp}
                              onClick={() => {
                                const number = buildWhatsappNumber(application.contact.phone);
                                if (!number) return;
                                const url = `https://wa.me/${number}?text=${encodeURIComponent(
                                  adminStrings.payment.messageTemplate
                                    .replace('{applicationId}', application.publicId)
                                    .replace('{paymentLink}', application.paymentLink ?? '')
                                )}`;
                                window.open(url, '_blank', 'noopener');
                              }}
                            />
                            <ActionButton
                              label={adminStrings.actions.markPaid}
                              onClick={() => setMarkPaidId(application.id)}
                              disabled={isActionPending(application.id, 'markPaid')}
                              variant="primary"
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          open={Boolean(selectedApplication)}
          onClose={() => setSelectedId(null)}
          dir={dir}
          t={adminStrings}
          onAssignPlan={(plan) => handleAssignPlan(selectedApplication, plan)}
          assigningPlan={isActionPending(selectedApplication.id, 'plan')}
          onOpenPaymentModal={() => setPaymentModalId(selectedApplication.id)}
          onMarkPaid={() => setMarkPaidId(selectedApplication.id)}
          language={language}
          emptyValue={t.common.emptyValue}
        />
      )}

      {paymentModalApplication && (
        <PaymentLinkModal
          application={paymentModalApplication}
          open
          onClose={() => setPaymentModalId(null)}
          onSave={handlePaymentLinkSave}
          saving={isActionPending(paymentModalApplication.id, 'payment')}
          t={adminStrings}
          template={adminStrings.payment.messageTemplate}
          dir={dir}
        />
      )}

      {rejectModalApplication && (
        <RejectModal
          application={rejectModalApplication}
          open
          onClose={() => setRejectModalId(null)}
          onReject={(payload) => handleReject(payload)}
          rejecting={isActionPending(rejectModalApplication.id, 'reject')}
          t={adminStrings}
          dir={dir}
        />
      )}

      <ConfirmDialog
        open={Boolean(markPaidApplication)}
        onClose={() => setMarkPaidId(null)}
        onConfirm={handleMarkPaid}
        confirming={markPaidApplication ? isActionPending(markPaidApplication.id, 'markPaid') : false}
        title={adminStrings.payment.confirmTitle}
        body={adminStrings.payment.confirmBody}
        confirmLabel={adminStrings.payment.confirm}
        cancelLabel={adminStrings.payment.cancel}
        dir={dir}
      />
    </section>
  );
};
