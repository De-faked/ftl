import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { INSTITUTE } from '../../config/institute';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

export const RefundPolicy: React.FC = () => {
  const { language, dir } = useLanguage();
  const { setCurrentView } = useAuth();
  const isAr = language === 'ar';
  return (
    <div className='min-h-screen bg-madinah-sand/30 pt-24 pb-16 px-4 sm:px-6 lg:px-8' dir={dir}>
      <div className='max-w-4xl mx-auto'>
        <button onClick={() => setCurrentView('LANDING')} className='inline-flex items-center gap-2 text-sm text-gray-600 hover:text-madinah-green mb-6'>
          <ArrowLeft className='w-4 h-4' />
          {isAr ? 'العودة' : 'Back'}
        </button>
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8'>
          <h1 className='text-3xl font-serif font-bold text-madinah-green'>{isAr ? 'سياسة الاسترجاع' : 'Refund Policy'}</h1>
          <p className='text-sm text-gray-500 mt-2'>
            {isAr ? INSTITUTE.legalLineAr : INSTITUTE.legalLineEn}
          </p>
          <div className="mt-8 space-y-6">
            {isAr ? (
              <>
                <h2 className="text-xl font-serif font-bold text-madinah-green">أهلية الاسترجاع</h2>
                <p className="text-gray-700 leading-relaxed">تخضع الاسترجاعات لسياسة المعهد وتاريخ بدء الدورة والرسوم الإدارية.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">طريقة الطلب</h2>
                <p className="text-gray-700 leading-relaxed">تواصل مع المعهد مرفقاً رقم الطالب ومرجع الدفع.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">مدة المعالجة</h2>
                <p className="text-gray-700 leading-relaxed">تُراجع الطلبات خلال مدة معقولة وفقاً للسياسة.</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-serif font-bold text-madinah-green">Refund eligibility</h2>
                <p className="text-gray-700 leading-relaxed">Refunds depend on the institute policy, course start date, and administrative fees.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">How to request</h2>
                <p className="text-gray-700 leading-relaxed">Contact the institute with your student ID and payment reference.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">Processing time</h2>
                <p className="text-gray-700 leading-relaxed">Requests are reviewed within a reasonable time frame in accordance with policy.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};