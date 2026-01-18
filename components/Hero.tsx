import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getReducedMotionBehavior, scrollToAnchor } from '../utils/scroll';
import { WhatsAppCTA } from './WhatsAppCTA';

export const Hero: React.FC = () => {
  const { t, dir } = useLanguage();

  return (
    <section
      className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24 overflow-hidden bg-madinah-sand"
      dir={dir}
    >
      {/* Background with CSS Geometric Pattern (No External Images) */}
      <div className="absolute inset-0 z-0 bg-madinah-sand">
        <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(#c5a059 1.5px, transparent 1.5px), radial-gradient(#c5a059 1.5px, transparent 1.5px)',
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
        }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-madinah-sand/50 to-madinah-sand"></div>
      </div>

      <div id="home" data-anchor="home" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-madinah-gold/20 text-madinah-green font-medium text-sm tracking-wider uppercase mb-4 rtl:font-kufi">
            {t.home.hero.location}
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-madinah-green leading-[1.15] sm:leading-[1.12] md:leading-[1.08] rtl:font-kufi">
            {t.home.hero.titleLine1} <br />
            <span className="text-madinah-gold">{t.home.hero.titleLine2}</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-700 leading-relaxed font-light rtl:font-amiri rtl:text-2xl rtl:leading-loose">
            {t.home.hero.description}
          </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-start rtl:justify-end">
              <span className="inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm border border-madinah-gold/30 px-3 py-1.5 text-sm font-semibold text-madinah-green rtl:font-kufi">
                {t.home.hero.location}
              </span>
              <span className="inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm border border-madinah-green/20 px-3 py-1.5 text-sm font-semibold text-madinah-green rtl:font-kufi">
                {t.home.methodology.classroom.title}
              </span>
              <span className="inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm border border-madinah-green/20 px-3 py-1.5 text-sm font-semibold text-madinah-green rtl:font-kufi">
                {t.home.methodology.community.title}
              </span>
            </div>

          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <a
              href="#courses"
              onClick={(event) => {
                event.preventDefault();
                scrollToAnchor('courses', getReducedMotionBehavior());
              }}
              className="px-8 py-4 bg-madinah-green text-white rounded-full font-medium text-lg hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group rtl:font-kufi"
            >
              {t.home.hero.viewCourses}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
            </a>
            <a
              href="#about"
              onClick={(event) => {
                event.preventDefault();
                scrollToAnchor('about', getReducedMotionBehavior());
              }}
              className="px-8 py-4 bg-white/80 backdrop-blur-sm text-madinah-green border border-madinah-green rounded-full font-medium text-lg hover:bg-white transition-all rtl:font-kufi"
            >
              {t.home.hero.aboutInstitute}
            </a>
          </div>

          <p className="mt-8 text-gray-600 italic text-xl rtl:font-aref rtl:text-3xl rtl:not-italic rtl:text-madinah-green/80">
            {t.home.hero.quote}
          </p>
        </div>
      </div>
      
      {/* Decorative Bottom Pattern */}
      <div className="absolute bottom-0 w-full h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}></div>
    
      {/* Grok A: consistent WhatsApp CTA (scannability break) */}
      <div className="mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <WhatsAppCTA size="lg" />
        </div>
      </div>
</section>
  );
};
