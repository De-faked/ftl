import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types';
import { Check, X, Clock, Utensils, Bus, Home, AlertCircle, FileText, ChevronDown, ClipboardList, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePlacementTest } from '../contexts/PlacementTestContext';
import { SupabaseAuthModal } from './SupabaseAuthModal';
import { useAuth as useSupabaseAuth } from '../src/auth/useAuth';

export const Courses: React.FC = () => {
  const { t, dir } = useLanguage();
  const { user: supabaseUser } = useSupabaseAuth();
  const { open: openPlacementTest } = usePlacementTest();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const courses: Course[] = t.home.courses.list;
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mobileDetailId, setMobileDetailId] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollRef = useRef(false);
  const navigate = useNavigate();
  const resolveCopy = (value: string) => value.replace('{visaSupport}', t.common.visaSupport);

  const handleExpand = (id: string, shouldScroll = false) => {
    setExpandedId((prev) => {
      const next = prev === id ? null : id;
      shouldScrollRef.current = shouldScroll && next === id;
      return next;
    });
  };

  const handleApplyNow = (course: Course) => {
    const targetUrl = `/portal?apply=1&course=${encodeURIComponent(course.id)}`;
    if (!supabaseUser) {
      sessionStorage.setItem('postLoginRedirect', targetUrl);
      setIsAuthModalOpen(true);
      return;
    }
    navigate(targetUrl);
  };

  const renderChip = (label: string, value: string) => (
    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-50 text-xs font-semibold text-gray-700 rtl:font-kufi">
      <span className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">{label}</span>
      <span className="text-xs text-gray-800 rtl:font-kufi">{value}</span>
    </span>
  );

  const handlePlacementTest = () => {
    openPlacementTest();
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(t.home.courses.whatsappMessage);
    window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const mobileDetailCourse = courses.find((course) => course.id === mobileDetailId);
  const mobileDetailStats = mobileDetailCourse
    ? { capacity: mobileDetailCourse.capacity, enrolled: 0, remaining: mobileDetailCourse.capacity, isFull: false }
    : null;
  const mobileDetailIsFull = mobileDetailStats?.isFull ?? false;

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
        id="packages"
        className="py-12 sm:py-16 bg-madinah-sand/30"
        dir={dir}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-4xl font-serif font-bold text-madinah-green mb-4 rtl:font-kufi">{t.home.courses.title}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto rtl:font-amiri rtl:text-xl">{t.home.courses.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {courses.map((course) => {
              const isExpanded = expandedId === course.id;
              const stats = {
                capacity: course.capacity,
                enrolled: 0,
                isFull: false,
                remaining: course.capacity,
              };
              const isFull = stats.isFull;

              return (
                <React.Fragment key={course.id}>
                  <article
                    className="md:hidden bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4"
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
                      {renderChip(t.home.courses.labels.duration, course.duration)}
                      {renderChip(t.home.courses.labels.mode, course.mode)}
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleApplyNow(course)}
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

                  <div
                    className={`hidden md:flex bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-500 ease-in-out flex-col ${
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
                      <div className="p-6 md:p-8 flex-1 flex flex-col gap-5 md:gap-6">
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

                        <p className="text-gray-600 text-sm leading-relaxed rtl:font-amiri rtl:text-lg flex-grow line-clamp-2 md:line-clamp-none">
                          {course.shortDescription}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 md:hidden" aria-label={t.home.courses.labels.quickStatsAria}>
                          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 text-xs font-semibold text-gray-700 rtl:font-kufi">
                            <Clock className="w-4 h-4 text-gray-500" />
                            {course.duration}
                          </span>
                          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 text-xs font-semibold text-gray-700 rtl:font-kufi">
                            {course.hours}
                          </span>
                        </div>
                        <div className="hidden md:grid grid-cols-3 gap-4 mb-1">
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                            <span className="text-xs font-bold text-gray-700 block rtl:font-kufi">{course.duration}</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <span className="text-xs font-bold text-gray-700 block rtl:font-kufi">{course.hours}</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <span className="text-xs font-bold text-gray-700 block rtl:font-kufi">{course.mode}</span>
                          </div>
                        </div>

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
                              handleApplyNow(course);
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
                        className="flex-1 p-6 md:p-8 bg-white animate-fade-in"
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
                              {course.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 rtl:font-amiri rtl:text-lg">
                                  <Check className="w-4 h-4 text-madinah-green" />
                                  <span>{feature}</span>
                                </div>
                              ))}
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
                                onClick={() => handleApplyNow(course)}
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
                </React.Fragment>
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
                {renderChip(t.home.courses.labels.duration, mobileDetailCourse.duration)}
                {renderChip(t.home.courses.labels.mode, mobileDetailCourse.mode)}
              </div>

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
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleApplyNow(mobileDetailCourse)}
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
