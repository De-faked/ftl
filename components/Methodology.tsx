import React from 'react';
import { BookOpen, Users, Clock, Calendar, Sun } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Methodology: React.FC = () => {
  const { t, dir } = useLanguage();

  return (
    <section id="methodology" className="py-12 sm:py-20 lg:py-24 bg-white" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-madinah-gold font-bold tracking-wider uppercase text-sm mb-2 block rtl:font-kufi">
            {t.hero.aboutInstitute}
          </span>
          <h2 className="text-4xl font-serif font-bold text-madinah-green mb-4 rtl:font-kufi">
            {t.methodology.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg rtl:font-amiri rtl:text-xl">
            {t.methodology.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Stats & Explanation */}
          <div className="space-y-12">
            
            {/* Classroom */}
            <div className="flex gap-6 items-start group">
                <div className="w-16 h-16 bg-madinah-green/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-madinah-green transition-colors duration-300">
                    <BookOpen className="w-8 h-8 text-madinah-green group-hover:text-white transition-colors" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 rtl:font-kufi">{t.methodology.classroom.title}</h3>
                    <p className="text-gray-600 leading-relaxed rtl:font-amiri rtl:text-lg">
                        {t.methodology.classroom.desc}
                    </p>
                </div>
            </div>

            {/* Community */}
            <div className="flex gap-6 items-start group">
                <div className="w-16 h-16 bg-madinah-gold/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-madinah-gold transition-colors duration-300">
                    <Users className="w-8 h-8 text-madinah-gold group-hover:text-white transition-colors" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 rtl:font-kufi">{t.methodology.community.title}</h3>
                    <p className="text-gray-600 leading-relaxed rtl:font-amiri rtl:text-lg">
                        {t.methodology.community.desc}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-8">
                <div className="text-center">
                    <div className="flex justify-center mb-2"><Clock className="text-gray-400 w-6 h-6"/></div>
                    <p className="font-bold text-madinah-green rtl:font-kufi">{t.methodology.stats.hours}</p>
                </div>
                <div className="text-center border-l border-r border-gray-100 px-2 rtl:border-l-0 rtl:border-r-0 rtl:border-x">
                    <div className="flex justify-center mb-2"><Calendar className="text-gray-400 w-6 h-6"/></div>
                    <p className="font-bold text-madinah-green rtl:font-kufi">{t.methodology.stats.duration}</p>
                </div>
                <div className="text-center">
                    <div className="flex justify-center mb-2"><Sun className="text-gray-400 w-6 h-6"/></div>
                    <p className="font-bold text-madinah-green rtl:font-kufi">{t.methodology.stats.activities}</p>
                </div>
            </div>

          </div>

          {/* Right Column: Images */}
          <div className="relative h-[600px] w-full hidden lg:block">
            {/* Image 1 Placeholder */}
            <div className="absolute top-0 right-0 w-2/3 h-2/3 rounded-2xl overflow-hidden shadow-2xl z-10 border-4 border-white rtl:right-auto rtl:left-0 bg-gray-200">
                <div className="w-full h-full bg-gray-200"></div>
            </div>
            {/* Image 2 Placeholder */}
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 rounded-2xl overflow-hidden shadow-2xl border-4 border-white rtl:left-auto rtl:right-0 bg-gray-300">
                 <div className="w-full h-full bg-gray-300"></div>
            </div>
            {/* Decorative Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-madinah-gold/20 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};