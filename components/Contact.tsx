import React from 'react';
import { Mail, Phone, MapPin as MapIcon, Instagram, Twitter, Facebook } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { INSTITUTE } from '../config/institute';
import { Bdi } from './Bdi';
import { Alert } from './Alert';

export const Contact: React.FC = () => {
  const { t, dir } = useLanguage();
  const phoneHref = `tel:${INSTITUTE.phone.replace(/[^+\d]/g, '')}`;
  const emailHref = `mailto:${INSTITUTE.email}`;
  const [statusAlert, setStatusAlert] = React.useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatusAlert(null);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        setStatusAlert({ message: t.home.contact.statusSuccess, variant: 'success' });
        form.reset();
      } else {
        setStatusAlert({ message: t.home.contact.statusError, variant: 'error' });
      }
    } catch (error) {
      setStatusAlert({ message: t.home.contact.statusError, variant: 'error' });
    }
  };

  return (
    <footer id="contact" className="bg-gradient-to-b from-madinah-sand via-madinah-green/95 to-madinah-green text-white" dir={dir}>
      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div>
            <h2 className="text-3xl font-serif font-bold mb-6 rtl:font-kufi">{t.home.contact.title}</h2>
            <p className="text-madinah-light mb-8 text-lg rtl:font-amiri rtl:text-xl">
              {t.home.contact.subtitle}
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-madinah-gold" />
                </div>
                <div>
                  <p className="text-sm text-madinah-light rtl:font-kufi">{t.home.contact.call}</p>
                  <a href={phoneHref} className="font-semibold hover:text-madinah-gold transition-colors" dir="ltr">
                    <Bdi>{INSTITUTE.phone}</Bdi>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-madinah-gold" />
                </div>
                <div>
                  <p className="text-sm text-madinah-light rtl:font-kufi">{t.home.contact.email}</p>
                  <a href={emailHref} className="font-semibold hover:text-madinah-gold transition-colors">
                    <Bdi>{INSTITUTE.email}</Bdi>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <MapIcon className="w-6 h-6 text-madinah-gold" />
                </div>
                <div>
                  <p className="text-sm text-madinah-light rtl:font-kufi">{t.home.contact.visit}</p>
                  <p className="font-semibold rtl:font-amiri rtl:text-lg">{t.home.contact.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 text-gray-800 shadow-lg">
            <h3 className="text-xl font-bold mb-6 rtl:font-kufi">{t.home.contact.formTitle}</h3>
            <form
              className="space-y-4"
              action="https://formspree.io/f/maqwygoq"
              method="POST"
              onSubmit={handleSubmit}
            >
              <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="contact-first-name" className="block text-sm font-medium text-gray-700 mb-1 rtl:font-kufi rtl:text-right">{t.home.contact.firstName}</label>
                    <input id="contact-first-name" name="firstName" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-green focus:border-transparent outline-none rtl:text-right" />
                </div>
                <div>
                    <label htmlFor="contact-last-name" className="block text-sm font-medium text-gray-700 mb-1 rtl:font-kufi rtl:text-right">{t.home.contact.lastName}</label>
                    <input id="contact-last-name" name="lastName" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-green focus:border-transparent outline-none rtl:text-right" />
                </div>
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1 rtl:font-kufi rtl:text-right">{t.home.contact.emailLabel}</label>
                <input id="contact-email" name="email" type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-green focus:border-transparent outline-none rtl:text-right" />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1 rtl:font-kufi rtl:text-right">{t.home.contact.messageLabel}</label>
                <textarea id="contact-message" name="message" rows={4} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-green focus:border-transparent outline-none rtl:text-right"></textarea>
              </div>
              <div className="space-y-2">
                <button type="submit" className="w-full py-3 bg-madinah-gold text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors rtl:font-kufi">
                  {t.home.contact.sendBtn}
                </button>
                {statusAlert && (
                  <Alert variant={statusAlert.variant}>
                    {statusAlert.message}
                  </Alert>
                )}
              </div>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-madinah-green/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-madinah-light text-center md:text-left rtl:md:text-right rtl:font-amiri">
            {t.home.contact.footer}
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:text-madinah-gold hover:bg-white/20 transition-colors"
              aria-label={t.home.contact.socials.instagram}
              title={t.home.contact.socials.instagram}
            >
              <Instagram className="w-5 h-5"/>
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:text-madinah-gold hover:bg-white/20 transition-colors"
              aria-label={t.home.contact.socials.twitter}
              title={t.home.contact.socials.twitter}
            >
              <Twitter className="w-5 h-5"/>
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:text-madinah-gold hover:bg-white/20 transition-colors"
              aria-label={t.home.contact.socials.facebook}
              title={t.home.contact.socials.facebook}
            >
              <Facebook className="w-5 h-5"/>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
