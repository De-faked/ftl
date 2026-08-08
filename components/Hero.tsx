import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getReducedMotionBehavior, scrollToAnchor } from '../utils/scroll';
import { WhatsAppCTA } from './WhatsAppCTA';

export const Hero: React.FC = () => {
  const { t, dir } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-madinah-sand pt-20 pb-20 sm:pt-24 sm:pb-24 md:pt-28 md:pb-28" dir={dir}>
      <div className="absolute inset-0 z-0 overflow-hidden bg-madinah-sand">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-madinah-gold/10 blur-3xl ftl-float" />
        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-madinah-green/10 blur-3xl" />
        <div className="absolute -right-20 top-24 h-64 w-64 rounded-full bg-madinah-green/5 blur-3xl ftl-float" />
        <div className="absolute inset-0 opacity-[0.12]" style={{
          backgroundImage: 'radial-gradient(#b08a3c 1.2px, transparent 1.2px), radial-gradient(#b08a3c 1.2px, transparent 1.2px)',
          backgroundSize: '42px 42px',
          backgroundPosition: '0 0, 21px 21px'
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-madinah-sand" />
      </div>

      <div id="home" data-anchor="home" className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <span className="ftl-reveal inline-flex items-center gap-2 rounded-full border border-madinah-gold/30 bg-white/75 px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-madinah-green shadow-sm backdrop-blur-md rtl:font-kufi">
            <Sparkles className="h-4 w-4 text-madinah-gold" />
            {t.home.hero.location}
          </span>

          <h1 className="ftl-reveal ftl-reveal-delay-1 text-4xl font-serif font-bold leading-[1.12] text-madinah-green drop-shadow-sm sm:text-5xl md:text-6xl lg:text-7xl rtl:font-kufi">
            {t.home.hero.titleLine1}
            <br />
            <span className="bg-gradient-to-r from-madinah-gold via-[#c29b4a] to-madinah-gold bg-clip-text text-transparent">
              {t.home.hero.titleLine2}
            </span>
          </h1>

          <p className="ftl-reveal ftl-reveal-delay-2 mx-auto max-w-2xl text-lg leading-relaxed text-gray-700 sm:text-xl md:text-2xl rtl:font-amiri rtl:leading-loose">
            {t.home.hero.description}
          </p>

          <div className="ftl-reveal ftl-reveal-delay-3 flex flex-wrap justify-center gap-2.5 pt-2">
            <span className="rounded-full border border-madinah-gold/25 bg-white/70 px-4 py-2 text-sm font-semibold text-madinah-green shadow-sm backdrop-blur-sm rtl:font-kufi">
              {t.home.hero.location}
            </span>
            <span className="rounded-full border border-madinah-green/15 bg-white/70 px-4 py-2 text-sm font-semibold text-madinah-green shadow-sm backdrop-blur-sm rtl:font-kufi">
              {t.home.methodology.classroom.title}
            </span>
            <span className="rounded-full border border-madinah-green/15 bg-white/70 px-4 py-2 text-sm font-semibold text-madinah-green shadow-sm backdrop-blur-sm rtl:font-kufi">
              {t.home.methodology.community.title}
            </span>
          </div>

          <div className="ftl-reveal ftl-reveal-delay-4 flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row sm:gap-4">
            <a
              href="#courses"
              onClick={(event) => {
                event.preventDefault();
                scrollToAnchor('courses', getReducedMotionBehavior());
              }}
              className="group inline-flex min-h-[52px] items-center gap-2 rounded-full bg-madinah-green px-8 py-3.5 text-lg font-semibold text-white shadow-lg shadow-madinah-green/20 transition-all duration-300 hover:-translate-y-1 hover:bg-madinah-green/90 hover:shadow-xl rtl:font-kufi"
            >
              {t.home.hero.viewCourses}
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </a>
            <a
              href="#about"
              onClick={(event) => {
                event.preventDefault();
                scrollToAnchor('about', getReducedMotionBehavior());
              }}
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-madinah-green/35 bg-white/75 px-8 py-3.5 text-lg font-semibold text-madinah-green shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-madinah-gold hover:bg-white hover:shadow-lg rtl:font-kufi"
            >
              {t.home.hero.aboutInstitute}
            </a>
          </div>

          <p className="ftl-reveal ftl-reveal-delay-4 pt-4 text-xl italic text-madinah-green/75 rtl:font-aref rtl:text-3xl rtl:not-italic">
            {t.home.hero.quote}
          </p>

          <div className="pt-3">
            <WhatsAppCTA size="lg" className="shadow-lg shadow-madinah-green/15 transition-transform duration-300 hover:-translate-y-1" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-14 w-full bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 35%, 75% 75%, 50% 35%, 25% 75%, 0 35%)' }} />
    </section>
  );
};
