import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useView } from '../../contexts/ViewContext';
import { ArrowLeft } from 'lucide-react';

export const RefundPolicy: React.FC = () => {
  const { t, dir } = useLanguage();
  const { setCurrentView } = useView();
  return (
    <div className='min-h-screen bg-madinah-sand/30 pt-24 pb-16 px-4 sm:px-6 lg:px-8' dir={dir}>
      <div className='max-w-4xl mx-auto'>
        <button onClick={() => setCurrentView('LANDING')} className='inline-flex items-center gap-2 text-sm text-gray-600 hover:text-madinah-green mb-6'>
          <ArrowLeft className='w-4 h-4' />
          {t.common.back}
        </button>
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8'>
          <h1 className='text-3xl font-serif font-bold text-madinah-green'>{t.footer.legalPages.refunds.title}</h1>
          <p className='text-sm text-gray-500 mt-2'>
            {t.common.instituteLegalLine}
          </p>
          <div className="mt-8 space-y-6">
            {t.footer.legalPages.refunds.sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-serif font-bold text-madinah-green">{section.title}</h2>
                <p className="text-gray-700 leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
