import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { INSTITUTE } from '../../config/institute';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
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
          <h1 className='text-3xl font-serif font-bold text-madinah-green'>{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</h1>
          <p className='text-sm text-gray-500 mt-2'>
            {isAr ? INSTITUTE.legalLineAr : INSTITUTE.legalLineEn}
          </p>
          <div className="mt-8 space-y-6">
            {isAr ? (
              <>
                <h2 className="text-xl font-serif font-bold text-madinah-green">ما الذي نجمعه</h2>
                <p className="text-gray-700 leading-relaxed">قد نجمع معلومات الاتصال وبيانات الطلب. وإذا قمت برفع صورة جواز السفر أو وثائق الهوية فسيتم جمعها لأغراض التسجيل ودعم التأشيرة.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">كيف نستخدم البيانات</h2>
                <p className="text-gray-700 leading-relaxed">نستخدم بياناتك لمعالجة الطلبات والتواصل معك وإدارة التسجيل وتجهيز خطابات دعم التأشيرة عند الحاجة.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">الاحتفاظ بالبيانات</h2>
                <p className="text-gray-700 leading-relaxed">في وضع العرض (Demo) تُحفظ البيانات داخل متصفحك فقط. في الإنتاج سيتم تحديد مدة الاحتفاظ ويمكنك طلب الحذف حسب الأنظمة.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">حقوقك</h2>
                <p className="text-gray-700 leading-relaxed">يمكنك طلب الوصول أو التصحيح أو الحذف وفقاً للأنظمة المعمول بها.</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-serif font-bold text-madinah-green">What we collect</h2>
                <p className="text-gray-700 leading-relaxed">We may collect your contact information and application details. If you upload passport scans or identity documents, they are collected for enrollment and visa-support purposes.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">How we use data</h2>
                <p className="text-gray-700 leading-relaxed">We use your data to process applications, communicate with you, manage enrollment, and prepare visa-support documentation when applicable.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">Data retention</h2>
                <p className="text-gray-700 leading-relaxed">In demo mode, data is stored in your browser only. In production, retention periods will be defined and you may request deletion where legally possible.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">Your rights</h2>
                <p className="text-gray-700 leading-relaxed">You can request access, correction, or deletion of your data as permitted by applicable laws.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};