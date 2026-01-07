import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Alert } from '../../../components/Alert';
import { Bdi } from '../../../components/Bdi';
import { normalizePlanDays } from '../../utils/planDays';
import { CoursePlan } from '../../../types';

type ApplicationFormData = {
  fullName: string;
  phone: string;
  nationality: string;
  desiredLevel: string;
  notes: string;
  courseId: string;
  planDays: string | null;
};

type ApplicationFormProps = {
  initialData?: Record<string, unknown> | null;
  courseId?: string | null;
  initialPlanDays?: string | null;
  courseHasPlans?: boolean;
  coursePlans?: CoursePlan[] | null;
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
  initialPlanDays,
  courseHasPlans = false,
  coursePlans = null,
}) => {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTimeoutRef = useRef<number | null>(null);

  const planOptions = useMemo(() => {
    if (!coursePlans || coursePlans.length === 0) return null;
    return [...coursePlans].sort((a, b) => {
      const parseDuration = (value: string) => {
        const match = value.match(/(\d{1,4})/);
        return match ? Number(match[1]) : 0;
      };
      return parseDuration(b.duration) - parseDuration(a.duration);
    });
  }, [coursePlans]);

  const defaults = useMemo<ApplicationFormData>(() => {
    const courseParam = parseString(courseId);
    const dataCourseId = parseString(initialData?.courseId);
    const normalizedInitialPlan = normalizePlanDays(initialPlanDays);
    const normalizedPlanFromData = normalizePlanDays(initialData?.planDays);
    const fallbackPlan = planOptions?.[0]?.id ?? null;
    const resolvedPlanDays = courseHasPlans
      ? normalizedInitialPlan ?? normalizedPlanFromData ?? fallbackPlan
      : null;

    return {
      fullName: parseString(initialData?.fullName),
      phone: parseString(initialData?.phone),
      nationality: parseString(initialData?.nationality),
      desiredLevel: parseString(initialData?.desiredLevel),
      notes: parseString(initialData?.notes),
      courseId: courseParam || dataCourseId,
      planDays: resolvedPlanDays,
    };
  }, [initialData, courseId, initialPlanDays, courseHasPlans, planOptions]);

  const [formData, setFormData] = useState<ApplicationFormData>(defaults);

  useEffect(() => {
    setFormData((prev) => ({
      fullName: prev.fullName || defaults.fullName,
      phone: prev.phone || defaults.phone,
      nationality: prev.nationality || defaults.nationality,
      desiredLevel: prev.desiredLevel || defaults.desiredLevel,
      notes: prev.notes || defaults.notes,
      courseId: defaults.courseId || prev.courseId,
      planDays: defaults.planDays,
    }));
  }, [defaults]);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) window.clearTimeout(redirectTimeoutRef.current);
    };
  }, []);

  const planOptionsAvailable = Boolean(courseHasPlans && planOptions?.length);
  const activePlan = useMemo(() => {
    if (!planOptionsAvailable || !planOptions?.length) return null;
    const fallback = planOptions[0];
    if (!formData.planDays) return fallback;
    return planOptions.find((plan) => plan.id === formData.planDays) ?? fallback;
  }, [formData.planDays, planOptions, planOptionsAvailable]);

  const handlePlanSelect = (planId: string) => {
    setFormData((prev) => {
      if (prev.planDays === planId) return prev;
      return { ...prev, planDays: planId };
    });
  };

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

    if (!formData.courseId) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Application submission blocked: missing courseId.');
      }
      setFormError(t.applicationForm.errors.submitFailed);
      setIsSubmitting(false);
      return;
    }

    const normalizedPlanDays = normalizePlanDays(formData.planDays);
    if (courseHasPlans && !normalizedPlanDays) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Application submission blocked: missing or invalid planDays.');
      }
      setFormError(t.applicationForm.errors.submitFailed);
      setIsSubmitting(false);
      return;
    }

    const result = await submit({
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      nationality: formData.nationality.trim(),
      desiredLevel: formData.desiredLevel.trim(),
      notes: formData.notes.trim(),
      courseId: formData.courseId,
      planDays: courseHasPlans ? normalizedPlanDays : null,
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
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10" dir={dir}>
      <div className="space-y-6">
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

        {planOptionsAvailable && activePlan && (
          <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm sm:p-5">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900">{t.applicationForm.planPicker.title}</p>
              <p className="text-xs text-gray-600">{t.applicationForm.planPicker.subtitle}</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 rtl:font-kufi md:hidden" htmlFor="portal-plan-select">
                  {t.applicationForm.planPicker.mobileLabel}
                </label>
                <div className="relative md:hidden">
                  <select
                    id="portal-plan-select"
                    className="mt-1 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 focus:border-madinah-gold focus:outline-none focus:ring-2 focus:ring-madinah-gold/40"
                    value={activePlan.id}
                    onChange={(event) => handlePlanSelect(event.target.value)}
                  >
                    {planOptions?.map((plan) => (
                      <option key={plan.id} value={plan.id} dir="auto">
                        {plan.duration}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 rtl:left-3 rtl:right-auto" />
                </div>
              </div>
              <div
                className="hidden w-full flex-wrap overflow-hidden rounded-xl border border-gray-200 bg-white md:flex"
                role="group"
                aria-label={t.applicationForm.planPicker.segmentLabel}
              >
                {planOptions?.map((plan) => {
                  const isActive = activePlan.id === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => handlePlanSelect(plan.id)}
                      className={`flex-1 min-h-[44px] min-w-[120px] px-3 py-2 text-sm font-bold transition-colors rtl:font-kufi ${
                        isActive ? 'bg-madinah-green text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      aria-pressed={isActive}
                    >
                      <Bdi dir="auto">{plan.duration}</Bdi>
                    </button>
                  );
                })}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-gray-500">{t.home.courses.labels.price}</p>
                  <Bdi dir="auto" className="text-lg font-bold text-madinah-green">
                    {activePlan.price}
                  </Bdi>
                </div>
                <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-gray-500">{t.home.courses.labels.duration}</p>
                  <Bdi dir="auto" className="text-lg font-bold text-gray-900">
                    {activePlan.duration}
                  </Bdi>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" aria-busy={isSubmitting || loading}>
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
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
