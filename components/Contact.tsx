import React from 'react';
import { Mail, Phone, MapPin as MapIcon, Instagram, Twitter, Facebook } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { INSTITUTE } from '../config/institute';

export const Contact: React.FC = () => {
  const { t, dir } = useLanguage();

  return (
    <footer id="contact" className="text-white" dir={dir}>
      <div className="bg-madinah-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-madinah-gold rtl:font-kufi">{t.contact.title}</p>
            <h2 className="text-3xl font-serif font-bold text-madinah-green rtl:font-kufi">{t.contact.formTitle}</h2>
          </div>
          <p className="text-gray-700 max-w-2xl text-base sm:text-lg rtl:font-amiri rtl:text-xl">
            {t.contact.subtitle}
          </p>
        </div>
      </div>
      {/* Contact Section */}
      <div className="bg-madinah-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center min-h-[44px] min-w-[44px]">
                  <Phone className="w-6 h-6 text-madinah-gold" />
                </div>
                <div>
                  <p className="text-sm text-madinah-light rtl:font-kufi">{t.contact.call}</p>
                  <p className="font-semibold" dir="ltr">+966 50 123 4567</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center min-h-[44px] min-w-[44px]">
                  <Mail className="w-6 h-6 text-madinah-gold" />
                </div>
                <div>
                  <p className="text-sm text-madinah-light rtl:font-kufi">{t.contact.email}</p>
                  <p className="font-semibold">{INSTITUTE.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center min-h-[44px] min-w-[44px]">
                  <MapIcon className="w-6 h-6 text-madinah-gold" />
                </div>
                <div>
                  <p className="text-sm text-madinah-light rtl:font-kufi">{t.contact.visit}</p>
                  <p className="font-semibold rtl:font-amiri rtl:text-lg">{t.contact.address}</p>
                </div>
              </div>
            </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 text-gray-800 shadow-lg">
            <h3 className="text-xl font-bold mb-6 rtl:font-kufi text-madinah-green">{t.contact.formTitle}</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="contact-first-name" className="block text-sm font-medium text-gray-700 mb-1 rtl:font-kufi">{t.contact.firstName}</label>
                    <input id="contact-first-name" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-green focus:border-transparent outline-none" />
                </div>
                <div>
                    <label htmlFor="contact-last-name" className="block text-sm font-medium text-gray-700 mb-1 rtl:font-kufi">{t.contact.lastName}</label>
                    <input id="contact-last-name" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-green focus:border-transparent outline-none" />
                </div>
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1 rtl:font-kufi">{t.contact.emailLabel}</label>
                <input id="contact-email" type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-green focus:border-transparent outline-none" />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1 rtl:font-kufi">{t.contact.messageLabel}</label>
                <textarea id="contact-message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-green focus:border-transparent outline-none"></textarea>
              </div>
              <button type="button" className="w-full py-3 bg-madinah-gold text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors rtl:font-kufi min-h-[44px]">
                {t.contact.sendBtn}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-madinah-light text-center md:text-left rtl:font-amiri">
            {t.contact.footer}
          </p>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-madinah-gold transition-colors" aria-label="Instagram" title="Instagram">
              <Instagram className="w-5 h-5"/>
            </a>
            <a href="#" className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-madinah-gold transition-colors" aria-label="Twitter" title="Twitter">
              <Twitter className="w-5 h-5"/>
            </a>
            <a href="#" className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-madinah-gold transition-colors" aria-label="Facebook" title="Facebook">
              <Facebook className="w-5 h-5"/>
            </a>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
};