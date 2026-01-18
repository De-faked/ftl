import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types';
import { Check, X, Clock, Utensils, Bus, Home, AlertCircle, FileText, ChevronDown, ClipboardList, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePlacementTest } from '../contexts/PlacementTestContext';
import { SupabaseAuthModal } from './SupabaseAuthModal';
import { Bdi } from './Bdi';
import { useAuth as useSupabaseAuth } from '../src/auth/useAuth';
import { INSTITUTE } from '../config/institute';
import { normalizePlanDays } from '../src/utils/planDays';

type PlanLike = { id: string; duration: string; hours: string; price: string };

const toAsciiDigits = (input: string) =>
  input
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));

const extractFirstInt = (input: string): number | null => {
  const ascii = toAsciiDigits(String(input ?? ''));
  const m = ascii.match(/(\d{1,6})/);
  return m ? Number(m[1]) : null;
};

const planScore = (plan: PlanLike): number => {
  const h = extractFirstInt(plan.hours) ?? 0;
  const d = extractFirstInt(plan.duration) ?? 0;
  return h * 1000 + d;
};

type CoursesProps = {
  compact?: boolean;
};

export const Courses: React.FC<CoursesProps> = ({ compact = false }) => {
  const { t, dir } = useLanguage();
  const { user: supabaseUser } = useSupabaseAuth();
  const { open: openPlacementTest } = usePlacementTest();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const courses: Course[] = t.home.courses.list;
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedFeaturesId, setExpandedFeaturesId] = useState<string | null>(null);
  const [mobileDetailId, setMobileDetailId] = useState<string | null>(null);
  const [selectedPlanByCourseId, setSelectedPlanByCourseId] = useState<Record<string, string>>(() => {
    // Default to 30-day plan on first load (landing should preselect 30, not 60)
    const coursesContainer = (t as any)?.home?.courses ?? {};
    const candidates = [
      coursesContainer?.courses,
      coursesContainer?.packages,
      coursesContainer?.items,
      coursesContainer?.cards,
      coursesContainer?.programs,
      coursesContainer?.courseCards,
    ];

    let list: any[] = [];
    for (const c of candidates) {
      if (Array.isArray(c)) {
        list = c;
        break;
      }
    }

    const getPlans = (course: any): any[] =>
      (course?.plans ??
        course?.options ??
        course?.durations ??
        course?.packages ??
        course?.variants ??
        []) as any[];

    const getCourseId = (course: any): string | null => {
      const v = course?.id ?? course?.courseId ?? course?.slug ?? course?.key ?? course?.code;
      return v ? String(v) : null;
    };

    const getPlanId = (plan: any): string | null => {
      const v = plan?.id ?? plan?.planId ?? plan?.key ?? plan?.value ?? plan?.code;
      return v ? String(v) : null;
    };

    const looks30 = (plan: any): boolean => {
      const d = plan?.durationDays ?? plan?.days ?? plan?.duration ?? plan?.lengthDays;
      if (typeof d === 'number') return d === 30;
      if (typeof d === 'string') return /(^|[^0-9])30([^0-9]|$)/.test(d);
      const hay = `${plan?.id ?? ''} ${plan?.title ?? ''} ${plan?.label ?? ''} ${plan?.name ?? ''}`;
      return /(^|[^0-9])30([^0-9]|$)/.test(hay);
    };

    const next: Record<string, string> = {};
    for (const course of list) {
      const cid = getCourseId(course);
      if (!cid) continue;

      const plans = getPlans(course);
      const p30 = plans.find(looks30);
      const pid30 = p30 ? getPlanId(p30) : null;
      const pidFirst = plans.length ? getPlanId(plans[0]) : null;

      const chosen = pid30 ?? pidFirst;
      if (chosen) next[cid] = chosen;
    }
    return next;
  });
  
  // Default plan selection: always prefer 30-day on first render (do not override user choice)
  const pickDefaultPlan = (plans: any[]) => {
    if (!Array.isArray(plans) || plans.length === 0) return null;
    return (
      plans.find((pl: any) => pl?.durationDays === 30 || pl?.days === 30 || pl?.duration === 30) ||
      plans.find((pl: any) => /(^|\D)30(\D|$)/.test(String(pl?.id ?? ''))) ||
      plans.find((pl: any) => /(^|\D)30(\D|$)/.test(String(pl?.label ?? pl?.title ?? pl?.name ?? ''))) ||
      plans[0]
    );
  };

  const pickDefaultPlanId = (plans: any[]) => String(pickDefaultPlan(plans)?.id ?? plans?.[0]?.id ?? '');

  
  // Default: select 30-day option for every course card on first load (do not override user choices)
  useEffect(() => {
    const courses = ((t as any)?.home?.courses?.courses ?? []) as any[];
    if (!Array.isArray(courses) || courses.length === 0) return;

    setSelectedPlanByCourseId((prev) => {
      const next: Record<string, string> = { ...prev };
      let changed = false;

      for (const c of courses) {
        const courseId = c?.id;
        const plans = c?.plans ?? c?.packages ?? c?.options ?? c?.durations ?? [];
        if (!courseId || !Array.isArray(plans) || plans.length === 0) continue;

        if (!next[courseId]) {
          const prefer30 =
            plans.find((p: any) => p?.durationDays === 30) ||
            plans.find((p: any) => p?.days === 30) ||
            plans.find((p: any) => p?.duration === 30) ||
            plans.find((p: any) => /(^|\D)30(\D|$)/.test(String(p?.label ?? p?.title ?? p?.name ?? p?.id ?? ''))) ||
            plans[0];

          if (prefer30?.id) {
            next[courseId] = String(prefer30.id);
            changed = true;
          }
        }
      }

      return changed ? next : prev;
    });
  }, [t]);

  const detailRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollRef = useRef(false);
  const navigate = useNavigate();
  const resolveCopy = (value: string) => value.replace('{visaSupport}', t.common.visaSupport);
  const isCompact = compact;

  const handleExpand = (id: string, shouldScroll = false) => {
    setExpandedId((prev) => {
      const next = prev === id ? null : id;
      shouldScrollRef.current = shouldScroll && next === id;
      return next;
    });
  };

  const handleApplyNow = (course: Course, planDays?: string | null) => {
    const normalizedPlanDays = normalizePlanDays(planDays);
    const base = `/portal?apply=1&course=${encodeURIComponent(course.id)}`;
    const targetUrl = normalizedPlanDays ? `${base}&planDays=${encodeURIComponent(normalizedPlanDays)}` : base;

    if (!supabaseUser) {
      sessionStorage.setItem('postLoginRedirect', targetUrl);
      setIsAuthModalOpen(true);
      return;
    }
    navigate(targetUrl);
  };

  const renderChip = (label: string, value: string) => (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 rtl:font-kufi">
      <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{label}</span>
      <span className="text-xs text-gray-800 rtl:font-kufi">
        <Bdi dir="auto">{value}</Bdi>
      </span>
    </span>
  );

  const PriceSummaryBlock: React.FC<{
    priceValue?: string;
    durationLabel?: string | null;
    className?: string;
  }> = ({ priceValue, durationLabel, className = '' }) => {
    if (!priceValue && !durationLabel) return null;
    return (
      <div
        className={`flex flex-wrap items-center justify-between gap-4 rounded-xl bg-madinah-sand/30 px-4 py-3 text-sm font-semibold text-gray-700 ${className}`}
      >
        {priceValue ? (
          <div className="flex min-w-0 flex-col">
            <span className="text-xs uppercase tracking-wide text-gray-500">{t.home.courses.labels.price}</span>
            <Bdi dir="auto" className="text-lg font-extrabold text-madinah-green">
              {priceValue}
            </Bdi>
          </div>
        ) : null}
        {durationLabel ? (
          <div className="flex min-w-0 flex-col text-right rtl:text-left">
            <span className="text-xs uppercase tracking-wide text-gray-500">{t.home.courses.labels.duration}</span>
            <Bdi dir="auto" className="text-base font-bold text-gray-900">
              {durationLabel}
            </Bdi>
          </div>
        ) : null}
      </div>
    );
  };

  
  const setPlanForCourse = (courseId: string, planId: string) => {
    setSelectedPlanByCourseId((prev) => ({ ...prev, [courseId]: planId }));
  };

  const resolvePlan = (course: Course) => {
    const raw = (course as unknown as { plans?: PlanLike[] }).plans;
    const plans = raw && raw.length ? [...raw].sort((a, b) => planScore(b) - planScore(a)) : null;

    const selectedId =

      selectedPlanByCourseId[course.id] ??

      (() => {

        // Default duration preference: 30 days

        const plans: any[] =

          (course as any)?.plans ??

          (course as any)?.options ??

          (course as any)?.durations ??

          (course as any)?.packages ??

          [];

    

        const getId = (p: any) => p?.id ?? p?.planId ?? p?.key ?? p?.value ?? p?.code ?? null;

        const getDays = (p: any) => p?.durationDays ?? p?.days ?? p?.duration ?? p?.lengthDays ?? null;

    

        const looks30 = (p: any): boolean => {

          const d = getDays(p);

          if (typeof d === 'number') return d === 30;

          if (typeof d === 'string') return /(^|[^0-9])30([^0-9]|$)/.test(d) || /٣٠/.test(d);

          const hay = `${getId(p) ?? ''} ${p?.title ?? ''} ${p?.label ?? ''} ${p?.name ?? ''} ${p?.durationLabel ?? ''}`;

          return /(^|[^0-9])30([^0-9]|$)/.test(hay) || /٣٠/.test(hay);

        };

    

        const p30 = plans.find(looks30);

        const chosen = p30 ?? plans[0];

        const id = getId(chosen);

        return id ? String(id) : undefined;

      })();
    const defaultPlan = plans ? plans[0] : null;
    const selectedPlan = plans ? (plans.find((p) => p.id === selectedId) ?? defaultPlan) : null;

    const duration = selectedPlan?.duration ?? course.duration;
    const hours = selectedPlan?.hours ?? course.hours;
    const price = selectedPlan?.price ?? (course as unknown as { price?: string }).price ?? '';
    const planDays = normalizePlanDays(
      selectedPlan?.id ?? extractFirstInt(selectedPlan?.duration ?? '') ?? extractFirstInt(course.duration)
    );

    return { plans, selectedPlan, duration, hours, price, planDays };
  };

  type PlanSelectorProps = {
    course: Course;
    plans: PlanLike[];
    selectedPlanId?: string;
    stopPropagation?: boolean;
    context?: string;
  };

  const PlanSelector: React.FC<PlanSelectorProps> = ({
    course,
    plans,
    selectedPlanId,
    stopPropagation = false,
    context = 'default',
  }) => {
    if (!plans || plans.length < 2) return null;
    const selectId = `plan-select-${course.id}-${context}`;
    const activeId = selectedPlanId ?? plans[0].id;

    const handlePlanChange = (planId: string) => {
      setPlanForCourse(course.id, planId);
    };

    return (
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-600 rtl:font-kufi md:hidden" htmlFor={selectId}>
          {t.home.courses.planLabel}
        </label>
        <div className="md:hidden">
          <div className="relative">
            <select
              id={selectId}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 rtl:font-kufi focus:border-madinah-gold focus:outline-none focus:ring-2 focus:ring-madinah-gold/40"
              value={activeId}
              onChange={(event) => handlePlanChange(event.target.value)}
              aria-label={t.home.courses.planLabel}
            >
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  <Bdi dir="auto">{plan.duration}</Bdi>
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 rtl:left-3 rtl:right-auto" />
          </div>
        </div>
        <div
          className="hidden w-full flex-wrap overflow-hidden rounded-xl border border-gray-200 bg-white md:flex"
          role="group"
          aria-label={t.home.courses.planLabel}
        >
          {plans.map((plan) => {
            const isActive = activeId === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  if (stopPropagation) event.stopPropagation();
                  handlePlanChange(plan.id);
                }}
                className={`flex-1 min-h-[40px] min-w-[120px] px-3 py-2 text-sm font-bold transition-colors rtl:font-kufi ${
                  isActive ? 'bg-madinah-green text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                aria-pressed={isActive}
              >
                <Bdi dir="auto">{plan.duration}</Bdi>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

const handlePlacementTest = () => {
    openPlacementTest();
  };

  const handleWhatsApp = () => {
    const phoneDigits = INSTITUTE.phone.replace(/\D/g, '');

    const message = encodeURIComponent(t.home.courses.whatsappMessage);
    window.open(`https://wa.me/${phoneDigits}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const mobileDetailCourse = courses.find((course) => course.id === mobileDetailId);
  const mobileDetailStats = mobileDetailCourse
    ? { capacity: mobileDetailCourse.capacity, enrolled: 0, remaining: mobileDetailCourse.capacity, isFull: false }
    : null;
  const mobileDetailIsFull = mobileDetailStats?.isFull ?? false;
  const mobileDetailResolved = mobileDetailCourse ? resolvePlan(mobileDetailCourse) : null;

  useEffect(() => {
    if (!expandedId || !shouldScrollRef.current || !detailRef.current) return;
    const prefersReduced = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    detailRef.current.scrollIntoView({ block: 'start', behavior: prefersReduced ? 'auto' : 'smooth' });
    detailRef.current.focus({ preventScroll: true });
    shouldScrollRef.current = false;
  }, [expandedId]);

  useEffect(() => {
    setExpandedFeaturesId(null);
  }, [expandedId]);

  useEffect(() => {
    if (!supabaseUser) return;
    const redirectUrl = sessionStorage.getItem('postLoginRedirect');
    if (!redirectUrl) return;
    sessionStorage.removeItem('postLoginRedirect');
    setIsAuthModalOpen(false);
    navigate(redirectUrl);
  }, [supabaseUser, navigate]);

  return (
    <>
      <section
        className="py-12 sm:py-20 lg:py-24 bg-madinah-sand/30 relative pb-[calc(env(safe-area-inset-bottom)+140px)] md:pb-24"
        dir={dir}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl font-serif font-bold text-madinah-green mb-4 rtl:font-kufi">{t.home.courses.title}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto rtl:font-amiri rtl:text-xl">{t.home.courses.subtitle}</p>
          </div>

          <div id="courses" data-anchor="courses" className="h-0"></div>
          <div className="md:hidden space-y-4">
            {courses.map((course) => {
              const stats = {
                capacity: course.capacity,
                enrolled: 0,
                isFull: false,
                remaining: course.capacity,
              };
              const isFull = stats.isFull;

                const { plans, selectedPlan, duration, hours, price, planDays } = resolvePlan(course);

              return (
                <article
                  key={course.id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4"
                  aria-label={t.home.courses.labels.courseCardAria.replace('{title}', course.title)}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <h3 className="text-lg font-serif font-bold text-gray-900 rtl:font-kufi leading-tight line-clamp-2">{course.title}</h3>
                      <p className="text-madinah-gold text-sm font-bold rtl:font-kufi truncate">{course.arabicTitle}</p>
                    </div>
                    {stats.remaining < 5 && !isFull && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        {stats.remaining} {t.home.courses.left}
                      </span>
                    )}
                    {isFull && <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-1 rounded-full">{t.home.courses.full}</span>}
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed rtl:font-amiri line-clamp-2">{course.shortDescription}</p>

                  <div className="flex flex-wrap items-center gap-2">
                    {renderChip(t.home.courses.labels.level, course.level)}
                    {renderChip(t.home.courses.labels.duration, duration)}
                    {renderChip(t.home.courses.labels.mode, course.mode)}
                  </div>

                  {plans && plans.length > 1 ? (
                    <PlanSelector course={course} plans={plans} selectedPlanId={selectedPlan?.id} context="mobile-card" />
                  ) : null}

                  <PriceSummaryBlock priceValue={price} durationLabel={duration} className="mt-1" />

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleApplyNow(course, planDays)}
                      className={`w-full min-h-[48px] px-4 py-3 rounded-xl font-bold transition-colors rtl:font-kufi text-base flex items-center justify-center gap-2 ${
                        isFull ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-madinah-green text-white hover:bg-opacity-90'
                      }`}
                      disabled={isFull}
                    >
                      {isFull ? <X className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      {isFull ? t.home.courses.full : t.home.courses.apply}
                    </button>
                    <button
                      onClick={() => setMobileDetailId(course.id)}
                      className="w-full inline-flex items-center justify-center gap-2 text-madinah-green font-semibold underline-offset-4 py-3 rounded-lg hover:text-madinah-gold transition-colors rtl:font-kufi"
                    >
                      {t.home.courses.details}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-8 relative">
            {courses.map((course) => {
              const isExpanded = expandedId === course.id;
              const isFeatureListExpanded = expandedFeaturesId === course.id;
              const features = isCompact
                ? (isFeatureListExpanded ? course.features : course.features.slice(0, 3))
                : course.features;
              const stats = {
                capacity: course.capacity,
                enrolled: 0,
                isFull: false,
                remaining: course.capacity,
              };
              const isFull = stats.isFull;

                const { plans, selectedPlan, duration, hours, price, planDays } = resolvePlan(course);
              const cardBodyClass = isCompact ? 'p-5 md:p-6 gap-4 md:gap-5' : 'p-6 md:p-8 gap-5 md:gap-6';
              const statCardClass = isCompact ? 'bg-gray-50 p-2 rounded-lg text-center' : 'bg-gray-50 p-3 rounded-lg text-center';
              const descriptionClampClass = isCompact ? 'line-clamp-3' : 'line-clamp-none';

              return (
                <div
                  key={course.id}
                  className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-500 ease-in-out flex flex-col ${
                    isExpanded ? 'ring-2 ring-madinah-gold md:col-span-3 lg:flex-row' : 'hover:shadow-2xl hover:-translate-y-1'
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onClick={() => {
                    if (!isExpanded) handleExpand(course.id, true);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      if (!isExpanded) handleExpand(course.id, true);
                    }
                  }}
                >
                  <div className={`flex flex-col h-full ${isExpanded ? 'lg:w-1/3 border-b lg:border-b-0 lg:border-r rtl:lg:border-r-0 rtl:lg:border-l border-gray-100' : 'w-full'}`}>
                    <div className="h-3 bg-madinah-green w-full"></div>
                    <div className={`flex-1 flex flex-col ${cardBodyClass}`}>
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-3">
                          <span className="inline-block bg-madinah-light text-madinah-green text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide rtl:font-kufi">
                            {course.level}
                          </span>
                          {stats.remaining < 5 && !isFull && (
                            <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full animate-pulse">
                              <AlertCircle className="w-3 h-3" />
                              {stats.remaining} {t.home.courses.leftLabel}
                            </span>
                          )}
                          {isFull && (
                            <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                              {t.home.courses.courseFull}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-2xl font-serif font-bold text-gray-900 rtl:font-kufi">{course.title}</h3>
                          <p className="text-madinah-gold text-xl font-bold mt-1 rtl:font-kufi">{course.arabicTitle}</p>
                        </div>
                      </div>

                      <p className={`text-gray-600 text-sm leading-relaxed rtl:font-amiri rtl:text-lg flex-grow ${descriptionClampClass}`}>
                        {course.shortDescription}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 md:hidden" aria-label={t.home.courses.labels.quickStatsAria}>
                        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 text-xs font-semibold text-gray-700 rtl:font-kufi">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <Bdi dir="auto">{duration}</Bdi>
                        </span>
                        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 text-xs font-semibold text-gray-700 rtl:font-kufi">
                          <Bdi dir="auto">{hours}</Bdi>
                        </span>
                      </div>
                      <div className={`hidden md:grid grid-cols-3 ${isCompact ? 'gap-3 mb-0.5' : 'gap-4 mb-1'}`}>
                        <div className={statCardClass}>
                          <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                          <span className="block text-xs font-bold text-gray-700 rtl:font-kufi">
                            <Bdi dir="auto">{duration}</Bdi>
                          </span>
                        </div>
                        <div className={statCardClass}>
                          <span className="block text-xs font-bold text-gray-700 rtl:font-kufi">
                            <Bdi dir="auto">{hours}</Bdi>
                          </span>
                        </div>
                        <div className={statCardClass}>
                          <span className="block text-xs font-bold text-gray-700 rtl:font-kufi">
                            <Bdi dir="auto">{course.mode}</Bdi>
                          </span>
                        </div>
                      </div>

                      {plans && plans.length > 1 ? (
                        <div className="mt-1">
                          <PlanSelector
                            course={course}
                            plans={plans}
                            selectedPlanId={selectedPlan?.id}
                            stopPropagation
                            context="desktop-card"
                          />
                        </div>
                      ) : null}

                      <PriceSummaryBlock priceValue={price} durationLabel={duration} className="mt-3" />

                      <div className="hidden md:flex gap-3">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleExpand(course.id, true);
                          }}
                          className="flex-1 min-h-[44px] px-4 py-3 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:border-madinah-gold hover:text-madinah-gold transition-colors rtl:font-kufi flex items-center justify-center gap-2"
                        >
                          {isExpanded ? t.home.courses.close : t.home.courses.details}
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyNow(course, planDays);
                          }}
                          className={`flex-1 min-h-[44px] px-4 py-3 rounded-lg font-bold rtl:font-kufi text-sm flex items-center justify-center gap-2 ${
                            isFull ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-madinah-green text-white hover:bg-opacity-90'
                          }`}
                          disabled={isFull}
                        >
                          {isFull ? <X className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          {isFull ? t.home.courses.full : t.home.courses.applyNow}
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div
                      className={`flex-1 bg-white animate-fade-in ${isCompact ? 'p-5 md:p-6' : 'p-6 md:p-8'}`}
                      ref={detailRef}
                      tabIndex={-1}
                    >
                      <div className="flex justify-between items-start mb-6 gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-madinah-green mb-2 rtl:font-kufi">{t.home.courses.details}</h3>
                          <p className="text-gray-600 rtl:font-amiri rtl:text-lg max-w-2xl">{course.fullDescription}</p>
                        </div>
                        <button
                          onClick={() => setExpandedId(null)}
                          className="text-gray-500 hover:text-red-500 inline-flex items-center justify-center w-11 h-11 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-madinah-gold focus:ring-offset-2"
                          aria-label={t.home.courses.close}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-madinah-sand/30 rounded-xl p-6">
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 rtl:font-kufi">
                            <Clock className="w-5 h-5 text-madinah-gold" />
                            {t.home.courses.schedule}
                          </h4>
                          <p className="text-gray-700 mb-4 font-medium rtl:font-kufi">{course.schedule}</p>

                          <div className="space-y-2">
                            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider rtl:font-kufi">{t.home.courses.labels.focusAreas}</p>
                            {features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 rtl:font-amiri rtl:text-lg">
                                <Check className="w-4 h-4 text-madinah-green" />
                                <span>{feature}</span>
                              </div>
                            ))}
                            {isCompact && course.features.length > 3 && (
                              <button
                                type="button"
                                onClick={() => setExpandedFeaturesId(isFeatureListExpanded ? null : course.id)}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-madinah-green hover:text-madinah-gold transition-colors rtl:font-kufi"
                                aria-expanded={isFeatureListExpanded}
                              >
                                {isFeatureListExpanded ? t.common.less : t.common.more}
                                <ChevronDown className={`w-4 h-4 transition-transform ${isFeatureListExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="bg-madinah-green/5 rounded-xl p-6 border border-madinah-green/10">
                          <h4 className="font-bold text-gray-900 mb-4 rtl:font-kufi">{t.home.courses.includes}</h4>
                          <div className="space-y-4">
                            {course.inclusions.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                  {idx === 0 && <Home className="w-4 h-4 text-madinah-gold" />}
                                  {idx === 1 && <Utensils className="w-4 h-4 text-madinah-gold" />}
                                  {idx === 2 && <Bus className="w-4 h-4 text-madinah-gold" />}
                                  {idx > 2 && <Check className="w-4 h-4 text-madinah-gold" />}
                                </div>
                                <span className="font-medium text-gray-700 rtl:font-kufi">{resolveCopy(item)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="mb-4">
                              <span className="text-sm text-gray-500 block mb-1 rtl:font-kufi">{t.home.courses.register}</span>
                              <span className="text-sm font-bold text-madinah-green rtl:font-kufi">{course.suitability}</span>
                            </div>
                            <button
                              onClick={() => handleApplyNow(course, planDays)}
                              className={`block w-full text-center min-h-[44px] px-4 py-3 bg-madinah-gold text-white rounded-lg hover:bg-yellow-600 transition-colors font-bold rtl:font-kufi ${
                                isFull ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={isFull}
                            >
                              {isFull ? t.home.courses.courseFull : t.home.courses.applyNow}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {mobileDetailCourse && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileDetailId(null)}></div>
          <div className="relative w-full bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden animate-fade-in-up">
            <div className="p-6 space-y-4 overflow-y-auto max-h-[85vh] pb-[calc(env(safe-area-inset-bottom)+24px)]">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900 rtl:font-kufi">{mobileDetailCourse.title}</h3>
                  <p className="text-madinah-gold font-bold text-sm rtl:font-kufi">{mobileDetailCourse.arabicTitle}</p>
                </div>
                <button
                  onClick={() => setMobileDetailId(null)}
                  className="w-11 h-11 inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
                  aria-label={t.home.courses.close}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {renderChip(t.home.courses.labels.level, mobileDetailCourse.level)}
                {renderChip(t.home.courses.labels.duration, mobileDetailResolved?.duration ?? mobileDetailCourse.duration)}
                {renderChip(t.home.courses.labels.mode, mobileDetailCourse.mode)}
              </div>

              {mobileDetailResolved?.plans && mobileDetailResolved.plans.length > 1 ? (
                <PlanSelector
                  course={mobileDetailCourse}
                  plans={mobileDetailResolved.plans}
                  selectedPlanId={mobileDetailResolved.selectedPlan?.id}
                  context="mobile-detail"
                />
              ) : null}

              <p className="text-sm text-gray-700 leading-relaxed rtl:font-amiri line-clamp-4">
                {mobileDetailCourse.fullDescription}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-madinah-sand/40 rounded-xl p-4 space-y-2">
                  <h4 className="text-sm font-bold text-gray-900 rtl:font-kufi">{t.home.courses.schedule}</h4>
                  <p className="text-sm text-gray-700 rtl:font-kufi">{mobileDetailCourse.schedule}</p>
                </div>
                <div className="bg-madinah-green/5 rounded-xl p-4 space-y-2 border border-madinah-green/10">
                  <h4 className="text-sm font-bold text-gray-900 rtl:font-kufi">{t.home.courses.includes}</h4>
                  <ul className="text-sm text-gray-700 space-y-1 rtl:font-kufi list-disc list-inside">
                    {mobileDetailCourse.inclusions.slice(0, 3).map((item, idx) => (
                      <li key={idx}>{resolveCopy(item)}</li>
                    ))}
                  </ul>
            {/* All-inclusive (applies to every package) */}
            {(() => {
              const allInc = (t as any)?.home?.courses?.allInclusive;
              if (!allInc?.items?.length) return null;
              return (
                <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                  <p className="text-sm font-bold text-madinah-green rtl:font-kufi">
                    {allInc.title}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700 rtl:text-right rtl:font-amiri rtl:text-lg">
                    {allInc.items.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 rtl:flex-row-reverse">
                        <span aria-hidden="true" className="mt-1 text-madinah-gold">●</span>
                        <span className="leading-6">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}

                </div>
              </div>

              <PriceSummaryBlock
                priceValue={mobileDetailResolved?.price ?? mobileDetailCourse.price}
                durationLabel={mobileDetailResolved?.duration ?? mobileDetailCourse.duration}
                className="mt-1"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleApplyNow(mobileDetailCourse, mobileDetailResolved?.planDays ?? null)}
                  className={`col-span-1 sm:col-span-2 min-h-[48px] px-4 py-3 rounded-xl font-bold rtl:font-kufi text-base flex items-center justify-center gap-2 ${
                    mobileDetailIsFull
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-madinah-green text-white hover:bg-opacity-90'
                  }`}
                  disabled={mobileDetailIsFull}
                >
                  {t.home.courses.applyNow}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
            <button
              onClick={handlePlacementTest}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-madinah-green text-white font-bold text-sm shadow-md"
            >
              <ClipboardList className="w-4 h-4" /> {t.home.courses.placementTest}
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-madinah-gold text-white font-bold text-sm shadow-md"
            >
              <MessageCircle className="w-4 h-4" /> {t.home.courses.whatsapp}
            </button>
          </div>
        </div>
      </div>

      <SupabaseAuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
