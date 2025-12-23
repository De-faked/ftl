import React from 'react';
import { Star, Quote, PlayCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Testimonial } from '../types';
import { Bdi } from './Bdi';

export const Testimonials: React.FC = () => {
  const { dir, t } = useLanguage();

  const testimonials: Testimonial[] = t.home.testimonials.items;

  return (
    <div className="min-h-screen bg-madinah-sand pt-24 pb-12" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <span className="text-madinah-green font-bold uppercase tracking-wider text-sm mb-2 block rtl:tracking-normal rtl:font-kufi">{t.home.testimonials.badge}</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 rtl:font-kufi">
            {t.home.testimonials.title} <span className="text-madinah-gold">{t.home.testimonials.titleAccent}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed rtl:font-amiri rtl:leading-loose">
            {t.home.testimonials.subtitle}
          </p>
        </div>

        {/* Video Placeholder Section */}
        <div className="mb-20">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-gray-900 group cursor-pointer">
                {/* Abstract Madinah-themed placeholder since no external images allowed */}
                <div className="absolute inset-0 bg-gradient-to-tr from-madinah-green to-gray-900 opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col text-white">
                    <PlayCircle className="w-20 h-20 mb-4 opacity-80 group-hover:scale-110 transition-transform duration-300" />
                    <h2 className="text-2xl font-serif font-bold rtl:font-kufi">{t.home.testimonials.videoTitle}</h2>
                    <p className="text-madinah-gold mt-2 rtl:font-amiri">{t.home.testimonials.videoSubtitle}</p>
                </div>
                <div className="absolute bottom-4 right-4 rtl:right-auto rtl:left-4 text-xs text-white/50 bg-black/50 px-2 py-1 rounded rtl:font-kufi">
                    {t.home.testimonials.videoCaption}
                </div>
            </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative hover:-translate-y-2 transition-transform duration-300">
                    <Quote className="absolute top-6 right-6 rtl:right-auto rtl:left-6 w-10 h-10 text-madinah-sand opacity-50" />
                    
                    <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                        ))}
                    </div>

                    <p className="text-gray-700 italic mb-8 leading-relaxed text-lg rtl:font-amiri rtl:leading-loose">
                      {t.home.testimonials.quotePrefix}
                      {item.text}
                      {t.home.testimonials.quoteSuffix}
                    </p>

                    <div className="flex items-center gap-4 mt-auto">
                        <div className="w-12 h-12 bg-madinah-green text-white rounded-full flex items-center justify-center font-bold text-lg">
                            {item.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 rtl:font-kufi"><Bdi>{item.name}</Bdi></h3>
                            <p className="text-xs text-madinah-gold font-bold uppercase tracking-wide rtl:tracking-normal rtl:font-kufi"><Bdi>{item.country}</Bdi></p>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-20 bg-madinah-green rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
            <div className="relative z-10">
                <h2 className="text-3xl font-serif font-bold mb-4 rtl:font-kufi">{t.home.testimonials.ctaTitle}</h2>
                <p className="text-madinah-light mb-8 max-w-xl mx-auto rtl:font-amiri rtl:leading-loose">{t.home.testimonials.ctaSubtitle}</p>
                <button className="px-8 py-4 bg-madinah-gold text-white rounded-full font-bold hover:bg-yellow-600 transition-colors shadow-lg rtl:font-kufi">
                    {t.home.testimonials.ctaButton}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};
