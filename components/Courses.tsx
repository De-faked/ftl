import React, { useState } from 'react';
import { Course } from '../types';
import { Check, X, Clock, MapPin, Utensils, Bus, Home, ShoppingCart, AlertCircle, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';

export const Courses: React.FC = () => {
  const { t, dir } = useLanguage();
  const { addToCart, cart } = useCart();
  const { user, getCourseStats, setCurrentView, setSelectedCourseId, setAuthIntent } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const courses: Course[] = t.courses.list;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleApplyNow = (course: Course) => {
      setSelectedCourseId(course.id);
      if (!user) {
          setAuthIntent({ view: 'APPLICATION', courseId: course.id });
          setIsAuthModalOpen(true);
          return;
      }
      setCurrentView('APPLICATION');
  };

  return (
    <>
    <section id="courses" className="py-24 bg-madinah-sand/30 relative" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-madinah-green mb-4 rtl:font-kufi">{t.courses.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto rtl:font-amiri rtl:text-xl">
            {t.courses.subtitle}
          </p>
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 relative overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 px-2 md:px-0">
          {courses.map((course) => {
            const isExpanded = expandedId === course.id;
            const isInCart = cart?.id === course.id;
            // Defensive coding: Provide fallback stats if getCourseStats fails or returns undefined
            const stats = getCourseStats(course.id, course.capacity) || {
              capacity: course.capacity,
              enrolled: 0,
              isFull: false,
              remaining: course.capacity
            };
            const isFull = stats.isFull;
            
            return (
              <div
                key={course.id}
                className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-500 ease-in-out flex flex-col snap-start shrink-0 w-[88vw] sm:w-[85vw] md:w-auto md:shrink ${
                  isExpanded ? 'ring-2 ring-madinah-gold md:col-span-3 lg:flex-row' : 'hover:shadow-2xl hover:-translate-y-1'
                }`}
              >
                {/* Standard Card Content (Visible when collapsed, Left side when expanded) */}
                <div className={`flex flex-col h-full ${isExpanded ? 'lg:w-1/3 border-b lg:border-b-0 lg:border-r rtl:lg:border-r-0 rtl:lg:border-l border-gray-100' : 'w-full'}`}>
                    <div className="h-3 bg-madinah-green w-full"></div>
                    <div className="p-8 flex-1 flex flex-col">
                        <div className="mb-6">
                            <div className="flex justify-between items-start mb-3">
                                <span className="inline-block bg-madinah-light text-madinah-green text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide rtl:font-kufi">
                                    {course.level}
                                </span>
                                {stats.remaining < 5 && !isFull && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full animate-pulse">
                                        <AlertCircle className="w-3 h-3" />
                                        {stats.remaining} Left
                                    </span>
                                )}
                                {isFull && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                        Course Full
                                    </span>
                                )}
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-gray-900 rtl:font-kufi">{course.title}</h3>
                            <p className="text-madinah-gold text-xl font-bold mt-1 rtl:font-kufi">{course.arabicTitle}</p>
                        </div>

                        <p className="text-gray-600 mb-6 text-sm leading-relaxed rtl:font-amiri rtl:text-lg flex-grow">
                            {course.shortDescription}
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-3 rounded-lg text-center">
                                <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                <span className="text-xs font-bold text-gray-700 block rtl:font-kufi">{course.duration}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg text-center">
                                <span className="text-xs font-bold text-gray-700 block rtl:font-kufi">{course.hours}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleExpand(course.id)}
                                className={`flex-1 min-h-[44px] px-4 py-3 rounded-lg font-bold transition-colors rtl:font-kufi text-base ${
                                    isExpanded
                                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    : 'bg-white border-2 border-madinah-green text-madinah-green hover:bg-madinah-green hover:text-white'
                                }`}
                            >
                                {isExpanded ? t.courses.close : t.courses.details}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleApplyNow(course); }}
                              className={`flex-1 min-h-[44px] px-4 py-3 rounded-lg font-bold transition-colors rtl:font-kufi text-base flex items-center justify-center gap-2 ${
                                isFull
                                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                  : 'bg-madinah-green text-white hover:bg-opacity-90'
                              }`}
                              disabled={isFull}
                            >
                              {isFull ? <X className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                              {isFull ? 'Full' : 'Apply Now'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Expanded Content (Visible only when expanded) */}
                {isExpanded && (
                    <div className="flex-1 p-8 bg-white animate-fade-in">
                         <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-madinah-green mb-2 rtl:font-kufi">{t.courses.details}</h3>
                                <p className="text-gray-600 rtl:font-amiri rtl:text-lg max-w-2xl">{course.fullDescription}</p>
                            </div>
                            <button
                              onClick={() => setExpandedId(null)}
                              className="text-gray-500 hover:text-red-500 inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-madinah-gold focus:ring-offset-2"
                              aria-label={t.courses.close}
                            >
                              <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Schedule & Focus */}
                            <div className="bg-madinah-sand/30 rounded-xl p-6">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 rtl:font-kufi">
                                    <Clock className="w-5 h-5 text-madinah-gold" />
                                    {t.courses.schedule}
                                </h4>
                                <p className="text-gray-700 mb-4 font-medium rtl:font-kufi">{course.schedule}</p>
                                
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider rtl:font-kufi">Focus Areas:</p>
                                    {course.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 rtl:font-amiri rtl:text-lg">
                                            <Check className="w-4 h-4 text-madinah-green" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* All Inclusive Perks */}
                            <div className="bg-madinah-green/5 rounded-xl p-6 border border-madinah-green/10">
                                <h4 className="font-bold text-gray-900 mb-4 rtl:font-kufi">{t.courses.includes}</h4>
                                <div className="space-y-4">
                                    {course.inclusions.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                {idx === 0 && <Home className="w-4 h-4 text-madinah-gold" />}
                                                {idx === 1 && <Utensils className="w-4 h-4 text-madinah-gold" />}
                                                {idx === 2 && <Bus className="w-4 h-4 text-madinah-gold" />}
                                                {idx > 2 && <Check className="w-4 h-4 text-madinah-gold" />}
                                            </div>
                                            <span className="font-medium text-gray-700 rtl:font-kufi">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                     <div className="mb-4">
                                        <span className="text-sm text-gray-500 block mb-1 rtl:font-kufi">Suitability</span>
                                        <span className="text-sm font-bold text-madinah-green rtl:font-kufi">{course.suitability}</span>
                                     </div>
                                     <button
                                        onClick={() => handleApplyNow(course)}
                                        className={`block w-full text-center min-h-[44px] px-4 py-3 bg-madinah-gold text-white rounded-lg hover:bg-yellow-600 transition-colors font-bold rtl:font-kufi ${isFull ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={isFull}
                                     >
                                        {isFull ? 'Course Full' : 'Begin Application'}
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
        <p className="md:hidden text-center text-sm text-gray-500 mt-2 rtl:font-kufi">اسحب للمزيد / Swipe for more</p>
      </div>
    </section>
    
    <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};