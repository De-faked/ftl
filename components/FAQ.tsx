import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const FAQ: React.FC = () => {
  const { t, dir } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-white" dir={dir}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <span className="inline-block p-3 bg-madinah-sand rounded-full mb-4">
                <HelpCircle className="w-6 h-6 text-madinah-gold" />
            </span>
            <h2 className="text-3xl font-serif font-bold text-gray-900 rtl:font-kufi">{t.faq.title}</h2>
        </div>

        <div className="space-y-4">
          {t.faq.items.map((item, index) => (
            <div 
                key={index} 
                className={`border rounded-xl transition-all duration-300 ${openIndex === index ? 'border-madinah-gold bg-madinah-sand/10 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-6 text-left rtl:text-right focus:outline-none"
              >
                <span className={`font-bold text-lg ${openIndex === index ? 'text-madinah-green' : 'text-gray-700'} rtl:font-kufi`}>
                  {item.q}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-madinah-gold flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 pt-0 text-gray-600 leading-relaxed rtl:font-amiri rtl:text-lg">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};