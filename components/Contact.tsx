import React from 'react';
import { Mail, MapPin as MapIcon, PhoneCall, MessageCircle, Instagram } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { INSTITUTE } from '../config/institute';

export const Contact: React.FC = () => {
  const { t, dir } = useLanguage();

  // Use `any` so we don’t depend on an exact config shape (prevents TS errors).
  const institute = INSTITUTE as any;

  const nameAr: string = institute?.nameAr ?? institute?.name_ar ?? institute?.instituteNameAr ?? 'فصحى طيبة للغة العربية';
  const nameEn: string =
    institute?.nameEn ?? institute?.name_en ?? institute?.instituteNameEn ?? 'Fo7ha Taibah Arabic Institute';

  const address: string =
    institute?.address ??
    institute?.location ??
    institute?.addressAr ??
    'المدينة المنورة - المملكة العربية السعودية';

  const phoneRaw: string = institute?.phone ?? institute?.phoneNumber ?? institute?.contactPhone ?? '+966504441945';
  const email: string = institute?.email ?? institute?.contactEmail ?? institute?.mainEmail ?? 'info-ftl@ptdima.sa';

  const phoneDigits = String(phoneRaw).replace(/[^\d]/g, '');
  const whatsappMessage =
    (t as any)?.home?.courses?.whatsappMessage ??
    'السلام عليكم، أريد الاستفسار عن دورات فصحى طيبة للغة العربية.';
  const whatsappHref = phoneDigits
    ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(whatsappMessage)}`
    : undefined;

  // Instagram only (per your instruction)
  const instagramUrl = 'https://www.instagram.com/ftl_languagecenter/';

  return (
    <footer
      id="contact"
      className="bg-gradient-to-b from-madinah-sand via-madinah-green/95 to-madinah-green text-white"
      dir={dir}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="space-y-6">
            <div>
              <p className="text-2xl sm:text-3xl font-bold rtl:font-kufi">{nameAr}</p>
              <p className="text-sm sm:text-base text-madinah-light/90">{nameEn}</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <MapIcon className="w-5 h-5 text-madinah-gold" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-madinah-light/90 rtl:font-kufi">{(t as any)?.home?.contact?.address ?? 'Address'}</p>
                <p className="font-semibold leading-relaxed rtl:font-amiri rtl:text-lg">{address}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:text-madinah-gold hover:bg-white/20 transition-colors"
                aria-label="Instagram"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>

              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-madinah-gold text-madinah-green font-semibold hover:opacity-95 transition"
                  aria-label={(t as any)?.home?.courses?.whatsapp ?? 'WhatsApp'}
                  title={(t as any)?.home?.courses?.whatsapp ?? 'WhatsApp'}
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span className="rtl:font-kufi">{(t as any)?.home?.courses?.whatsapp ?? 'WhatsApp'}</span>
                </a>
              )}
            </div>
          </div>

          {/* Contact methods */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`tel:${phoneDigits || phoneRaw}`}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <PhoneCall className="w-6 h-6 text-madinah-gold" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-madinah-light/90 rtl:font-kufi">{(t as any)?.home?.contact?.call ?? 'Call'}</p>
                  <p className="font-semibold">{phoneRaw}</p>
                </div>
              </a>

              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-madinah-gold" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-madinah-light/90 rtl:font-kufi">{(t as any)?.home?.contact?.email ?? 'Email'}</p>
                  <p className="font-semibold break-all">{email}</p>
                </div>
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-madinah-light/90 rtl:font-kufi">
                {(t as any)?.home?.contact?.subtitle ??
                  'Untuk pendaftaran dan pertanyaan, hubungi kami melalui WhatsApp, telepon, atau email.'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-sm text-madinah-light/80 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {nameEn}</p>
          <p className="rtl:font-kufi">{(t as any)?.home?.contact?.footer ?? 'All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
};
