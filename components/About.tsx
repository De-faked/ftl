import React from 'react';
import { MapPin, Users, Heart, GraduationCap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const About: React.FC = () => {
  const { t, dir } = useLanguage();

  return (
    <section id="about" className="py-12 sm:py-20 lg:py-24 bg-madinah-sand relative overflow-hidden" dir={dir}>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 w-64 h-64 bg-madinah-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 rtl:-translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 rtl:left-auto rtl:right-0 w-96 h-96 bg-madinah-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
          <div className="space-y-8">
            <h2 className="text-4xl font-serif font-bold text-madinah-green leading-tight rtl:font-kufi">
              {t.about.titleLine1} <br/>
              <span className="text-madinah-gold">{t.about.titleLine2}</span>
            </h2>
            
            <p className="text-gray-700 text-lg leading-relaxed rtl:font-amiri rtl:text-xl rtl:leading-loose">
              {t.about.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                    <MapPin className="w-8 h-8 text-madinah-gold flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-gray-900 rtl:font-kufi">{t.about.locationTitle}</h3>
                        <p className="text-sm text-gray-600 mt-1 rtl:font-amiri rtl:text-lg">{t.about.locationDesc}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                    <Users className="w-8 h-8 text-madinah-gold flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-gray-900 rtl:font-kufi">{t.about.teachersTitle}</h3>
                        <p className="text-sm text-gray-600 mt-1 rtl:font-amiri rtl:text-lg">{t.about.teachersDesc}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                    <GraduationCap className="w-8 h-8 text-madinah-gold flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-gray-900 rtl:font-kufi">{t.about.curriculumTitle}</h3>
                        <p className="text-sm text-gray-600 mt-1 rtl:font-amiri rtl:text-lg">{t.about.curriculumDesc}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                    <Heart className="w-8 h-8 text-madinah-gold flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-gray-900 rtl:font-kufi">{t.about.communityTitle}</h3>
                        <p className="text-sm text-gray-600 mt-1 rtl:font-amiri rtl:text-lg">{t.about.communityDesc}</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500 rtl:-rotate-2 rtl:hover:rotate-0 bg-gray-200">
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                     Image Placeholder
                </div>
            </div>
            <div className="absolute -bottom-6 -left-6 rtl:left-auto rtl:-right-6 bg-white p-6 rounded-lg shadow-xl max-w-xs">
                <p className="font-serif text-xl italic text-madinah-green mb-2 rtl:font-aref rtl:not-italic rtl:text-2xl">{t.about.imageCaption}</p>
                <div className="h-1 w-12 bg-madinah-gold"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};