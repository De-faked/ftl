import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';
import { Alert } from '../../components/Alert';
import { Bdi } from '../../components/Bdi';
import { logDevError } from '../utils/logging';

type GalleryItem = {
  id: string;
  kind: 'photo' | 'video' | 'external_video';
  storage_key: string | null;
  public_url: string | null;
  thumb_url: string | null;
  caption_ar: string | null;
  caption_en: string | null;
  caption_id: string | null;
  alt_ar: string | null;
  alt_en: string | null;
  alt_id: string | null;
  width: number | null;
  height: number | null;
  sort_order: number;
  created_at: string;
};

const trimSlash = (value: string) => value.replace(/\/+$/, '');

export const GalleryPage: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const r2PublicBase = useMemo(() => {
    const raw = import.meta.env.VITE_R2_PUBLIC_BASE_URL as string | undefined;
    return raw ? trimSlash(raw) : null;
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('gallery_items')
          .select(
            'id, kind, storage_key, public_url, thumb_url, caption_ar, caption_en, caption_id, alt_ar, alt_en, alt_id, width, height, sort_order, created_at'
          )
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (!active) return;

        if (fetchError) {
          logDevError('gallery public load failed', fetchError);
          setError(t.gallery.loadError);
          setLoading(false);
          return;
        }

        setItems((data ?? []) as GalleryItem[]);
        setLoading(false);
      } catch (err) {
        if (!active) return;
        logDevError('gallery public load threw', err);
        setError(t.gallery.loadError);
        setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [t.gallery.loadError]);

  const resolvePublicUrl = (item: GalleryItem) => {
    if (item.public_url) return item.public_url;
    if (r2PublicBase && item.storage_key) {
      return `${r2PublicBase}/${item.storage_key}`;
    }
    return null;
  };

  const resolveCaption = (item: GalleryItem) => {
    if (language === 'ar') return item.caption_ar ?? '';
    if (language === 'id') return item.caption_id ?? '';
    return item.caption_en ?? '';
  };

  const resolveAlt = (item: GalleryItem, fallbackCaption: string) => {
    if (language === 'ar') return item.alt_ar || fallbackCaption || t.gallery.fallbackAlt;
    if (language === 'id') return item.alt_id || fallbackCaption || t.gallery.fallbackAlt;
    return item.alt_en || fallbackCaption || t.gallery.fallbackAlt;
  };

  const photoItems = useMemo(() => {
    return items
      .filter((item) => item.kind === 'photo')
      .map((item) => {
        const url = resolvePublicUrl(item);
        if (!url) return null;
        const caption = resolveCaption(item);
        const altText = resolveAlt(item, caption);
        return {
          id: item.id,
          url,
          caption,
          altText,
          width: item.width,
          height: item.height,
        };
      })
      .filter(Boolean) as Array<{
      id: string;
      url: string;
      caption: string;
      altText: string;
      width: number | null;
      height: number | null;
    }>;
  }, [items, language, r2PublicBase, t.gallery.fallbackAlt]);

  const photoIndexById = useMemo(() => {
    return new Map(photoItems.map((item, index) => [item.id, index]));
  }, [photoItems]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    closeButtonRef.current?.focus();
  }, [lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxIndex(null);
        return;
      }
      if (event.key === 'ArrowRight') {
        setLightboxIndex((prev) => {
          if (prev === null) return prev;
          return (prev + 1) % photoItems.length;
        });
        return;
      }
      if (event.key === 'ArrowLeft') {
        setLightboxIndex((prev) => {
          if (prev === null) return prev;
          return (prev - 1 + photoItems.length) % photoItems.length;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, photoItems.length]);

  const activePhoto = lightboxIndex !== null ? photoItems[lightboxIndex] : null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8" dir={dir}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-gray-900 rtl:font-kufi">{t.gallery.title}</h1>
          <p className="text-sm text-gray-600">{t.gallery.subtitle}</p>
        </div>

        {loading ? (
          <section
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-5 xl:grid-cols-6"
            aria-label={t.gallery.loadingLabel}
            aria-busy="true"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="aspect-[4/3] w-full animate-pulse bg-gray-200"></div>
                <div className="space-y-2 px-3 py-2">
                  <div className="h-3 w-3/4 animate-pulse rounded-full bg-gray-200"></div>
                  <div className="h-3 w-1/2 animate-pulse rounded-full bg-gray-200"></div>
                </div>
              </div>
            ))}
          </section>
        ) : error ? (
          <Alert variant="error">
            <Bdi>{error}</Bdi>
          </Alert>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-600">
            {t.gallery.empty}
          </div>
        ) : (
          <section
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-5 xl:grid-cols-6"
            aria-label={t.gallery.sectionLabel}
          >
            {items.map((item) => {
              const resolvedUrl = resolvePublicUrl(item);
              const caption = resolveCaption(item);
              const altText = resolveAlt(item, caption);
              const photoIndex = photoIndexById.get(item.id);

              if (!resolvedUrl && item.kind !== 'external_video') {
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-gray-100 bg-white p-4 text-xs text-gray-500 sm:text-sm"
                  >
                    {t.gallery.missingMedia}
                  </div>
                );
              }

              if (item.kind === 'photo') {
                return (
                  <figure
                    key={item.id}
                    className="group rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (photoIndex === undefined) return;
                        setLightboxIndex(photoIndex);
                      }}
                      className="block w-full rounded-t-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold focus-visible:ring-offset-2"
                      aria-label={t.gallery.openLightbox}
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-gray-100">
                        <img
                          src={resolvedUrl ?? ''}
                          alt={altText}
                          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                          loading="lazy"
                          width={item.width ?? undefined}
                          height={item.height ?? undefined}
                        />
                      </div>
                    </button>
                    {caption && (
                      <figcaption className="px-3 py-2 text-xs text-gray-700 sm:text-sm">
                        <Bdi dir="auto">{caption}</Bdi>
                      </figcaption>
                    )}
                  </figure>
                );
              }

              if (item.kind === 'video') {
                return (
                  <figure
                    key={item.id}
                    className="rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-gray-100">
                      <video
                        controls
                        src={resolvedUrl ?? ''}
                        className="h-full w-full object-cover"
                        aria-label={altText}
                      />
                    </div>
                    {caption && (
                      <figcaption className="px-3 py-2 text-xs text-gray-700 sm:text-sm">
                        <Bdi dir="auto">{caption}</Bdi>
                      </figcaption>
                    )}
                  </figure>
                );
              }

              return (
                <figure
                  key={item.id}
                  className="rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-gray-100">
                    {item.thumb_url ? (
                      <img
                        src={item.thumb_url}
                        alt={t.gallery.externalThumbnailAlt}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center border-b border-gray-100 text-xs text-gray-400 sm:text-sm">
                        {t.gallery.externalVideoLabel}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 px-3 py-2 text-xs text-gray-700 sm:text-sm">
                    {caption && (
                      <p>
                        <Bdi dir="auto">{caption}</Bdi>
                      </p>
                    )}
                    {item.public_url && (
                      <a
                        href={item.public_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 font-semibold text-madinah-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold focus-visible:ring-offset-2"
                      >
                        {t.gallery.openExternalLink}
                      </a>
                    )}
                  </div>
                </figure>
              );
            })}
          </section>
        )}
      </div>
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" dir={dir}>
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setLightboxIndex(null)}
          ></div>
          <div
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.gallery.lightboxLabel}
            className="relative w-full max-w-5xl"
            tabIndex={-1}
            onKeyDown={(event) => {
              if (event.key !== 'Tab') return;
              const focusables = lightboxRef.current?.querySelectorAll<HTMLElement>(
                'button, [href], [tabindex]:not([tabindex="-1"])'
              );
              if (!focusables || focusables.length === 0) return;
              const first = focusables[0];
              const last = focusables[focusables.length - 1];
              const active = document.activeElement as HTMLElement | null;
              if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
                return;
              }
              if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
              }
            }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div className="text-sm font-semibold text-gray-600">{t.gallery.lightboxTitle}</div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  className="min-h-[40px] rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-600 hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold focus-visible:ring-offset-2"
                >
                  {t.gallery.lightboxClose}
                </button>
              </div>
              <div className="bg-black">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.altText}
                  className="max-h-[70vh] w-full object-contain"
                  width={activePhoto.width ?? undefined}
                  height={activePhoto.height ?? undefined}
                />
              </div>
              {activePhoto.caption && (
                <div className="border-t border-gray-100 px-4 py-3 text-sm text-gray-700">
                  <Bdi dir="auto">{activePhoto.caption}</Bdi>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between text-white">
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((prev) => (prev === null ? prev : (prev - 1 + photoItems.length) % photoItems.length))
                }
                className="min-h-[40px] rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {t.gallery.lightboxPrev}
              </button>
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((prev) => (prev === null ? prev : (prev + 1) % photoItems.length))
                }
                className="min-h-[40px] rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {t.gallery.lightboxNext}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
