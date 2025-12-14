import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { INSTITUTE } from '../../config/institute';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

export const DocumentConsent: React.FC = () => {
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
          <h1 className='text-3xl font-serif font-bold text-madinah-green'>{isAr ? 'موافقة جمع الوثائق' : 'Document Collection Consent'}</h1>
          <p className='text-sm text-gray-500 mt-2'>
            {isAr ? INSTITUTE.legalLineAr : INSTITUTE.legalLineEn}
          </p>
          <div className="mt-8 space-y-6">
            {isAr ? (
              <>
                <h2 className="text-xl font-serif font-bold text-madinah-green">موافقة جمع الوثائق</h2>
                <p className="text-gray-700 leading-relaxed">إذا اخترت رفع صورة جواز السفر أو وثائق الهوية فإنك توافق على جمعها ومعالجتها لأغراض مراجعة الطلب ودعم التأشيرة.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">تنبيه البيانات الحساسة</h2>
                <p className="text-gray-700 leading-relaxed">وثائق الهوية بيانات حساسة. يجب أن يقتصر الوصول عليها على الموظفين المخولين في بيئات الإنتاج.</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-serif font-bold text-madinah-green">Consent to collect documents</h2>
                <p className="text-gray-700 leading-relaxed">If you choose to upload passport scans or identity documents, you consent to collection and processing for application review and visa-support purposes.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">Sensitive data notice</h2>
                <p className="text-gray-700 leading-relaxed">Passport and identity documents are sensitive. Only authorized staff should access them in production systems.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};