import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { usePlacementTest } from '../contexts/PlacementTestContext';

export const CourseAdvisorModal: React.FC = () => {
  const { t, dir } = useLanguage();
  const { isOpen, toggle, open, close } = usePlacementTest();
  const navigate = useNavigate();
  const [step, setStep] = useState<'welcome' | 'q1' | 'q2' | 'result'>('welcome');
  const [recommendedId, setRecommendedId] = useState<string | null>(null);

  const handleStart = () => setStep('q1');
  
  const handleQ1 = (answer: boolean) => {
    // Q1: Business? 
    if (answer) {
        setRecommendedId('business');
        setStep('result');
    } else {
        setStep('q2');
    }
  };

  const handleQ2 = (answer: boolean) => {
    // Q2: Can read but not speak?
    if (answer) {
        setRecommendedId('immersion');
    } else {
        setRecommendedId('beginner');
    }
    setStep('result');
  };

  const handleRestart = () => {
    setStep('welcome');
    setRecommendedId(null);
    open();
  };

  const handleApply = () => {
      close();
      navigate('/portal');
  };

  const recommendedCourse = t.home.courses.list.find(c => c.id === recommendedId);

  return (
    <div dir={dir}>
      {/* Floating Action Button */}
      <button
        onClick={toggle}
        className={`fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-madinah-gold hover:bg-yellow-600'
        }`}
        aria-label={isOpen ? t.home.courseAdvisor.closeLabel : t.home.courseAdvisor.openLabel}
        title={isOpen ? t.home.courseAdvisor.closeLabel : t.home.courseAdvisor.openLabel}
      >
        {isOpen ? <X className="text-white w-6 h-6" /> : <MessageCircle className="text-white w-8 h-8" />}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 rtl:right-auto rtl:left-6 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-madinah-green p-6 text-white relative overflow-hidden">
             <div className="relative z-10">
                 <h3 className="font-serif font-bold text-xl">{t.home.courseAdvisor.title}</h3>
                 <p className="text-madinah-light text-sm opacity-90">{t.home.courseAdvisor.subtitle}</p>
             </div>
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          </div>

          {/* Content */}
          <div className="p-6 bg-white min-h-[300px] flex flex-col">
            
            {step === 'welcome' && (
                <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 animate-fade-in">
                    <div className="w-16 h-16 bg-madinah-sand rounded-full flex items-center justify-center">
                        <MessageCircle className="w-8 h-8 text-madinah-gold" />
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        {t.home.courseAdvisor.welcome}
                    </p>
                    <button 
                        onClick={handleStart}
                        className="w-full py-3 bg-madinah-gold text-white rounded-lg font-bold hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                    >
                        {t.home.courseAdvisor.startBtn} <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                </div>
            )}

            {(step === 'q1' || step === 'q2') && (
                <div className="flex-1 flex flex-col justify-center animate-fade-in">
                    <h4 className="text-lg font-bold text-gray-900 mb-6 leading-relaxed">
                        {step === 'q1' ? t.home.courseAdvisor.q1 : t.home.courseAdvisor.q2}
                    </h4>
                    <div className="space-y-3">
                        <button 
                            onClick={() => step === 'q1' ? handleQ1(true) : handleQ2(true)}
                            className="w-full py-3 border-2 border-madinah-green text-madinah-green rounded-lg font-bold hover:bg-madinah-green hover:text-white transition-all"
                        >
                            {t.home.courseAdvisor.yes}
                        </button>
                        <button 
                            onClick={() => step === 'q1' ? handleQ1(false) : handleQ2(false)}
                            className="w-full py-3 border-2 border-gray-200 text-gray-600 rounded-lg font-bold hover:border-gray-400 transition-all"
                        >
                            {t.home.courseAdvisor.no}
                        </button>
                    </div>
                </div>
            )}

            {step === 'result' && recommendedCourse && (
                <div className="flex-1 flex flex-col animate-fade-in">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 text-center">
                        {t.home.courseAdvisor.recommendation}
                    </p>
                    
                    <div className="bg-madinah-sand/30 border border-madinah-gold/30 rounded-xl p-5 mb-6">
                        <div className="flex items-start gap-3 mb-3">
                            <CheckCircle className="w-6 h-6 text-madinah-green flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-xl text-madinah-green">{recommendedCourse.title}</h4>
                                <p className="text-sm text-madinah-gold font-bold">{recommendedCourse.arabicTitle}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                            {recommendedCourse.shortDescription}
                        </p>
                        <div className="text-xs font-bold text-gray-500 bg-white/50 p-2 rounded inline-block">
                            {recommendedCourse.level}
                        </div>
                    </div>

                    <div className="mt-auto space-y-3">
                        <button 
                            onClick={handleApply}
                            className="w-full py-3 bg-madinah-green text-white rounded-lg font-bold hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                        >
                            {t.home.courseAdvisor.applyNow} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                        </button>
                        <button 
                            onClick={handleRestart}
                            className="w-full py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                            <RefreshCw className="w-4 h-4" /> {t.home.courseAdvisor.restart}
                        </button>
                    </div>
                </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
