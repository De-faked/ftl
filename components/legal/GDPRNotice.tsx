import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { INSTITUTE } from '../../config/institute';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

export const GDPRNotice: React.FC = () => {
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
          <h1 className='text-3xl font-serif font-bold text-madinah-green'>{isAr ? 'إشعار GDPR' : 'GDPR Notice'}</h1>
          <p className='text-sm text-gray-500 mt-2'>
            {isAr ? INSTITUTE.legalLineAr : INSTITUTE.legalLineEn}
          </p>
          <div className="mt-8 space-y-6">
            {isAr ? (
              <>
                <h2 className="text-xl font-serif font-bold text-madinah-green">إشعار GDPR</h2>
                <p className="text-gray-700 leading-relaxed">إذا كنت في الاتحاد الأوروبي/المنطقة الاقتصادية الأوروبية فقد تكون لك حقوق بموجب GDPR. في وضع العرض تُحفظ البيانات محلياً داخل متصفحك. في الإنتاج يجب تطبيق الأساس القانوني والاحتفاظ ومعالجة طلبات أصحاب البيانات.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">جهة الاتصال</h2>
                <p className="text-gray-700 leading-relaxed">تواصل مع المعهد لطلبات GDPR.</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-serif font-bold text-madinah-green">GDPR notice</h2>
                <p className="text-gray-700 leading-relaxed">If you are in the EU/EEA, you may have rights under GDPR. This demo stores data locally in your browser. Production deployments must implement lawful basis, retention, and data subject request handling.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">Controller contact</h2>
                <p className="text-gray-700 leading-relaxed">Contact the institute for GDPR-related requests.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};