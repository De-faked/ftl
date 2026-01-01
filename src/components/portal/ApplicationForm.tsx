import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Alert } from '../../../components/Alert';
import { Bdi } from '../../../components/Bdi';

type ApplicationFormData = {
  fullName: string;
  phone: string;
  nationality: string;
  desiredLevel: string;
  notes: string;
  courseId: string;
};

type ApplicationFormProps = {
  initialData?: Record<string, unknown> | null;
  courseId?: string | null;
  loading?: boolean;
  error?: string | null;
  submit: (data: Record<string, unknown>) => Promise<{ error: string | null }>;
};

const parseString = (value: unknown) => (typeof value === 'string' ? value : '');

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  initialData,
  courseId,
  loading = false,
  error,
  submit,
}) => {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTimeoutRef = useRef<number | null>(null);

  const defaults = useMemo<ApplicationFormData>(() => {
    return {
      fullName: parseString(initialData?.fullName),
      phone: parseString(initialData?.phone),
      nationality: parseString(initialData?.nationality),
      desiredLevel: parseString(initialData?.desiredLevel),
      notes: parseString(initialData?.notes),
      courseId: parseString(initialData?.courseId) || parseString(courseId),
    };
  }, [initialData, courseId]);

  const [formData, setFormData] = useState<ApplicationFormData>(defaults);

  useEffect(() => {
    setFormData((prev) => ({
      fullName: prev.fullName || defaults.fullName,
      phone: prev.phone || defaults.phone,
      nationality: prev.nationality || defaults.nationality,
      desiredLevel: prev.desiredLevel || defaults.desiredLevel,
      notes: prev.notes || defaults.notes,
      courseId: defaults.courseId || prev.courseId,
    }));
  }, [defaults]);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) window.clearTimeout(redirectTimeoutRef.current);
    };
  }, []);

  const handleChange =
    (field: keyof ApplicationFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSuccess(false);
    setIsSubmitting(true);

    const result = await submit({
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      nationality: formData.nationality.trim(),
      desiredLevel: formData.desiredLevel.trim(),
      notes: formData.notes.trim(),
      courseId: formData.courseId,
    });

    setIsSubmitting(false);

    if (result.error) {
      setFormError(result.error);
      return;
    }

    setSuccess(true);
    redirectTimeoutRef.current = window.setTimeout(() => {
      navigate('/portal');
    }, 1200);
  };

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8" dir={dir}>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.applicationForm.title}</h1>
        </div>

        {(formError || error) && (
          <Alert variant="error">
            <Bdi dir="auto">{formError ?? error}</Bdi>
          </Alert>
        )}

        {success && (
          <Alert variant="success">
            <Bdi dir="auto">{t.home.contact.statusSuccess}</Bdi>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" aria-busy={isSubmitting || loading}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-semibold text-gray-700">
              {t.applicationForm.fields.fullName}
              <input
                type="text"
                value={formData.fullName}
                onChange={handleChange('fullName')}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold"
                dir="auto"
                required
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-700">
              {t.applicationForm.fields.phone}
              <input
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold"
                dir="auto"
                required
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-700">
              {t.applicationForm.fields.nationality}
              <input
                type="text"
                value={formData.nationality}
                onChange={handleChange('nationality')}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold"
                dir="auto"
                required
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-700">
              {t.home.courses.labels.level}
              <input
                type="text"
                value={formData.desiredLevel}
                onChange={handleChange('desiredLevel')}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold"
                dir="auto"
                required
              />
            </label>
          </div>

          <label className="space-y-1 text-sm font-semibold text-gray-700">
            {t.home.contact.messageLabel}
            <textarea
              value={formData.notes}
              onChange={handleChange('notes')}
              rows={4}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold"
              dir="auto"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-madinah-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-madinah-green/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting || loading ? t.applicationForm.buttons.submitting : t.applicationForm.buttons.submit}
          </button>
        </form>
      </div>
    </section>
  );
};
