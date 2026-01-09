import React from 'react';
import { type LucideIcon, MessageCircle, Mail, Plane, Sparkles, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { INSTITUTE } from '../config/institute';

type DurationKey = '15' | '30';
type PartnerCardId = 'groups' | 'umrah';

interface PartnerCardCopy {
  badge: string;
  title: string;
  description: string;
  points: string[];
}

const durationKeys: DurationKey[] = ['15', '30'];
const cardVisuals: Record<
  PartnerCardId,
  { accentBar: string; icon: LucideIcon; iconBg: string; bulletColor: string; tint: string }
> = {
  groups: {
    accentBar: 'from-madinah-green via-madinah-green/80 to-madinah-gold/80',
    icon: Users,
    iconBg: 'bg-madinah-green/10 text-madinah-green',
    bulletColor: 'bg-madinah-green',
    tint: 'from-white via-madinah-sand/20 to-madinah-sand/5'
  },
  umrah: {
    accentBar: 'from-madinah-gold via-madinah-gold/80 to-rose-400/70',
    icon: Plane,
    iconBg: 'bg-madinah-gold/15 text-madinah-gold/80',
    bulletColor: 'bg-madinah-gold',
    tint: 'from-white via-madinah-gold/15 to-rose-50'
  }
};

export const PartnerCardsStrip: React.FC = () => {
  const { t, dir, isRTL, language } = useLanguage();
  const copy = t.home.partnerStrip;
  const cards: Array<{ id: PartnerCardId } & PartnerCardCopy> = [
    { id: 'groups', ...(copy.cards.groups as PartnerCardCopy) },
    { id: 'umrah', ...(copy.cards.umrah as PartnerCardCopy) }
  ];
  const [selectedDurations, setSelectedDurations] = React.useState<Record<string, DurationKey>>({
    groups: '15',
    umrah: '15'
  });

  const instituteName =
    language === 'ar' ? t.common.instituteNameArabic : t.common.instituteNameLatin;
  const phoneDigits = React.useMemo(() => INSTITUTE.phone.replace(/\D/g, ''), []);
  const durationOptions = copy.durations as Record<DurationKey, string>;
  const emailHref = `mailto:${INSTITUTE.email}`;

  const handleDurationChange = (cardId: string, value: DurationKey) => {
    setSelectedDurations((prev) => ({ ...prev, [cardId]: value }));
  };

  const buildMessage = (programTitle: string, durationKey: DurationKey) => {
    const durationLabel = durationOptions[durationKey];
    return copy.messageTemplate
      .replace('{institute}', instituteName)
      .replace('{program}', programTitle)
      .replace('{duration}', durationLabel);
  };

  return (
    <section
      className="border-b border-madinah-sand bg-gradient-to-b from-white via-madinah-sand/15 to-white"
      dir={dir}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-madinah-green rtl:font-kufi">
              {copy.badge}
            </p>
            <h2 className="mt-1 text-2xl font-serif text-gray-900 sm:text-3xl rtl:font-kufi">
              {copy.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600 rtl:font-amiri">{copy.subtitle}</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-madinah-green/10 px-3 py-1 text-xs font-semibold text-madinah-green rtl:font-kufi">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {copy.targetHighlight}
            </p>
          </div>
          <p className="text-xs text-gray-500 rtl:font-kufi sm:text-sm">{copy.helper}</p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {cards.map((card) => {
            const durationKey = selectedDurations[card.id] ?? '15';
            const message = buildMessage(card.title, durationKey);
            const whatsappUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
            const visual = cardVisuals[card.id];
            const Icon = visual.icon;

            return (
              <article
                key={card.id}
                className="relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-madinah-sand/70 bg-white/95 p-6 shadow-lg ring-1 ring-black/5"
              >
                <div
                  className={`pointer-events-none absolute inset-0 opacity-70 blur-[80px] bg-gradient-to-br ${visual.tint}`}
                  aria-hidden="true"
                />
                <div
                  className={`absolute inset-x-6 top-0 h-1 rounded-full bg-gradient-to-r ${visual.accentBar}`}
                  aria-hidden="true"
                />
                <span
                  className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} inline-flex items-center rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-md`}
                >
                  {copy.specialOffer}
                </span>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl ${visual.iconBg}`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 rtl:font-kufi">
                          {card.badge}
                        </p>
                        <h3 className="text-xl font-serif text-gray-900 rtl:font-kufi">
                          {card.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 rtl:font-amiri">{card.description}</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 rtl:font-kufi">
                        {copy.durationLabel}
                      </span>
                      <label className="sm:hidden">
                        <span className="sr-only">
                          {copy.durationSwitcherLabel.replace('{program}', card.title)}
                        </span>
                        <select
                          className="w-full rounded-xl border border-madinah-sand bg-white px-3 py-2 text-sm text-gray-700 focus:border-madinah-green focus:outline-none focus:ring-1 focus:ring-madinah-green"
                          value={durationKey}
                          onChange={(event) =>
                            handleDurationChange(card.id, event.target.value as DurationKey)
                          }
                        >
                          {durationKeys.map((value) => (
                            <option key={value} value={value}>
                              {durationOptions[value]}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div
                        className="hidden items-center gap-2 rounded-full bg-white/60 p-0.5 shadow-inner sm:flex"
                        role="group"
                        aria-label={copy.durationSwitcherLabel.replace('{program}', card.title)}
                      >
                        {durationKeys.map((value) => {
                          const selected = durationKey === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => handleDurationChange(card.id, value)}
                              className={`rounded-full border px-3 py-1 text-sm transition ${
                                selected
                                  ? 'border-madinah-green bg-madinah-green text-white shadow'
                                  : 'border-transparent bg-transparent text-gray-700 hover:border-madinah-green/60'
                              }`}
                            >
                              {durationOptions[value]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <ul className="grid gap-2 text-sm text-gray-700 rtl:font-amiri">
                      {card.points.map((point: string) => (
                        <li key={point} className="flex items-start gap-2">
                          <span
                            className={`mt-1 inline-block h-2 w-2 rounded-full ${visual.bulletColor}`}
                            aria-hidden="true"
                          ></span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div
                  className={`mt-auto flex flex-col gap-2 ${isRTL ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-madinah-green px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-madinah-green/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    {copy.primaryCta}
                  </a>
                  <a
                    href={emailHref}
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-transparent px-3 py-2 text-sm font-semibold text-madinah-green transition hover:border-madinah-gold/60 hover:text-madinah-gold"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {copy.secondaryCta}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
