import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { GraduationCap, Globe2, Sparkles } from 'lucide-react';

export const Teachers: React.FC = () => {
  const { t, dir } = useLanguage();
  const teachers = t.teachers.list;

  return (
    <section id="teachers" className="py-12 md:py-24 bg-white" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <p className="text-sm font-semibold text-madinah-gold tracking-[0.3em] uppercase mb-3 rtl:tracking-normal rtl:font-kufi">
            {t.teachers.badge}
          </p>
          <h2 className="text-4xl font-serif font-bold text-gray-900 leading-tight mb-4 rtl:font-kufi">
            {t.teachers.title}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed rtl:font-amiri rtl:text-xl rtl:leading-loose">
            {t.teachers.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teachers.map((teacher: typeof teachers[number]) => (
            <div
              key={teacher.name}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-madinah-sand/80 flex items-center justify-center text-madinah-green font-bold text-lg">
                    {teacher.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 rtl:font-kufi">{teacher.name}</h3>
                    <p className="text-sm text-madinah-gold font-semibold">{teacher.role}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-madinah-green/10 text-madinah-green text-xs font-semibold">
                  {t.teachers.experienceLabel.replace('{years}', teacher.experience)}
                </span>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed rtl:font-amiri rtl:text-lg rtl:leading-loose">
                {teacher.bio}
              </p>

              <div className="flex items-center gap-3 text-sm text-gray-700">
                {teacher.type === 'curriculum' && <GraduationCap className="w-4 h-4 text-madinah-gold" />} 
                {teacher.type === 'immersion' && <Globe2 className="w-4 h-4 text-madinah-gold" />} 
                {teacher.type === 'delivery' && <Sparkles className="w-4 h-4 text-madinah-gold" />} 
                <span className="font-semibold rtl:font-kufi">{teacher.focus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
