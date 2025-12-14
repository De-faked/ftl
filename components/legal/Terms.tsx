import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { INSTITUTE } from '../../config/institute';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

export const Terms: React.FC = () => {
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
          <h1 className='text-3xl font-serif font-bold text-madinah-green'>{isAr ? 'شروط الاستخدام' : 'Terms of Service'}</h1>
          <p className='text-sm text-gray-500 mt-2'>
            {isAr ? INSTITUTE.legalLineAr : INSTITUTE.legalLineEn}
          </p>
          <div className="mt-8 space-y-6">
            {isAr ? (
              <>
                <h2 className="text-xl font-serif font-bold text-madinah-green">الموافقة</h2>
                <p className="text-gray-700 leading-relaxed">باستخدامك للموقع فإنك توافق على هذه الشروط وسياسة الخصوصية.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">الخدمات</h2>
                <p className="text-gray-700 leading-relaxed">يوفر الموقع معلومات الدورات وخطوات التقديم وتجربة بوابة الطالب/الإدارة. بعض الميزات تجريبية فقط.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">مسؤوليات المستخدم</h2>
                <p className="text-gray-700 leading-relaxed">يلزم تقديم معلومات صحيحة والحفاظ على سرية بيانات الدخول.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">تحديد المسؤولية</h2>
                <p className="text-gray-700 leading-relaxed">الميزات التجريبية مقدمة كما هي. قد تتضمن شروط الإنتاج أحكاماً إضافية.</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-serif font-bold text-madinah-green">Acceptance</h2>
                <p className="text-gray-700 leading-relaxed">By using this website you agree to these terms and the privacy policy.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">Services</h2>
                <p className="text-gray-700 leading-relaxed">The platform provides course information, an application workflow, and a student/admin portal experience. Some features are demo-only.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">User responsibilities</h2>
                <p className="text-gray-700 leading-relaxed">You must provide accurate information and keep your account credentials secure.</p>
                <h2 className="text-xl font-serif font-bold text-madinah-green">Limitation of liability</h2>
                <p className="text-gray-700 leading-relaxed">Demo features are provided as-is. Production terms may include additional legal provisions.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};