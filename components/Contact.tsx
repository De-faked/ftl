import React from 'react';
import { Mail, MapPin as MapIcon, Instagram, PhoneCall, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { INSTITUTE } from '../config/institute';
import { Bdi } from './Bdi';
import { Alert } from './Alert';

export const Contact: React.FC = () => {
  const { t, dir } = useLanguage();
  const phoneHref = `tel:${INSTITUTE.phone.replace(/[^+\d]/g, '')}`;
  const emailHref = `mailto:${INSTITUTE.email}`;
  const phoneDigits = INSTITUTE.phone.replace(/\D/g, '');
  const whatsappHref = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(t.home.courses.whatsappMessage)}`;
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
    <footer className="bg-gradient-to-b from-madinah-sand via-madinah-green/95 to-madinah-green text-white" dir={dir}>
      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div id="contact" data-anchor="contact" className="h-0"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div>
            <h2 className="text-3xl font-serif font-bold mb-6 rtl:font-kufi">{t.home.contact.title}</h2>
            <p className="text-madinah-light mb-8 text-lg rtl:font-amiri rtl:text-xl">
              {t.home.contact.subtitle}
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
</div>
        </div>
      </div>
    </footer>
  );
};
