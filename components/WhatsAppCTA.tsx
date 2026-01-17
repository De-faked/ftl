import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { INSTITUTE } from '../config/institute';

type Props = {
  size?: 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  className?: string;
  message?: string;
};

export const WhatsAppCTA: React.FC<Props> = ({
  size = 'md',
  variant = 'primary',
  className = '',
  message,
}) => {
  const { t, dir } = useLanguage();

  const phoneRaw = String((INSTITUTE as any)?.phone ?? '');
  const phoneDigits = phoneRaw.replace(/\D/g, '');

  // Reuse existing i18n message if available (no hardcoded UI strings)
  const msg = message ?? (t as any)?.home?.courses?.whatsappMessage ?? '';
  const href = phoneDigits
    ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(msg)}`
    : '#contact';

  const label = (t as any)?.home?.courses?.whatsapp ?? 'WhatsApp';

  const sizeClass =
    size === 'lg'
      ? 'px-6 py-3 text-base min-h-[48px]'
      : 'px-5 py-2 text-sm min-h-[44px]';

  const variantClass =
    variant === 'primary'
      ? 'bg-madinah-green text-white hover:bg-madinah-green/90'
      : 'bg-white/80 text-madinah-green border border-madinah-green/40 hover:bg-white';

  return (
    <a
      dir={dir}
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-madinah-gold/60',
        sizeClass,
        variantClass,
        'rtl:font-kufi',
        className,
      ].join(' ')}
      aria-label={label}
      title={label}
    >
      <MessageCircle className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
};
