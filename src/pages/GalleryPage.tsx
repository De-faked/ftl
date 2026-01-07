import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
const hasProtocol = (value: string) => /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value);
const resolveDirectOrRelativeUrl = (value: string | null, baseForRelative?: string | null) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('//') || hasProtocol(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) return trimmed;
  if (baseForRelative) {
    return joinBaseAndKey(baseForRelative, trimmed);
  }
  return `/${trimmed}`;
};
const joinBaseAndKey = (base: string, key: string) => `${trimSlash(base)}/${key.replace(/^\/+/, '')}`;
const SKELETON_CARD_COUNT = 12;
const RESPONSIVE_GRID_CLASSES = 'grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' as const;
const CARD_MEDIA_WRAPPER_BASE = 'relative w-full overflow-hidden' as const;
const CARD_MEDIA_ASPECT_CLASS = 'aspect-[4/3]' as const;
const CARD_MEDIA_ASPECT_STYLE = { aspectRatio: '4 / 3' } satisfies React.CSSProperties;

type ResolvedPhotoItem = {
  id: string;
  kind: 'photo';
  url: string;
  caption: string;
  altText: string;
  width: number | null;
  height: number | null;
};

type ResolvedVideoItem = {
  id: string;
  kind: 'video';
  url: string;
  caption: string;
  altText: string;
};

type ResolvedExternalVideoItem = {
  id: string;
  kind: 'external_video';
  caption: string;
  altText: string;
  thumbUrl: string | null;
  externalUrl: string;
};

type ResolvedGalleryItem = ResolvedPhotoItem | ResolvedVideoItem | ResolvedExternalVideoItem;

export const GalleryPage: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawRowCount, setRawRowCount] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
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
    setRawRowCount(null);

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

        if (import.meta.env.DEV) {
          console.debug('gallery public load result', {
            rowCount: Array.isArray(data) ? data.length : 0,
            error: fetchError ?? null,
          });
        }

        if (fetchError) {
          logDevError('gallery public load failed', fetchError);
          setError(t.gallery.loadError);
          setRawRowCount(null);
          setLoading(false);
          return;
        }

        const rows = Array.isArray(data) ? data.length : 0;
        setRawRowCount(rows);
        setItems((data ?? []) as GalleryItem[]);
        setLoading(false);
      } catch (err) {
        if (!active) return;
        logDevError('gallery public load threw', err);
        setError(t.gallery.loadError);
        setRawRowCount(null);
        setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [reloadKey, t.gallery.loadError]);

  const resolvePublicUrl = useCallback(
    (item: GalleryItem) => {
      const direct = resolveDirectOrRelativeUrl(item.public_url, r2PublicBase ?? undefined);
      if (direct) return direct;
      if (item.storage_key) {
        return resolveDirectOrRelativeUrl(item.storage_key, r2PublicBase ?? undefined);
      }
      return null;
    },
    [r2PublicBase]
  );
  const resolveThumbUrl = useCallback(
    (value: string | null) => {
      const resolved = resolveDirectOrRelativeUrl(value, r2PublicBase ?? undefined);
      return resolved;
    },
    [r2PublicBase]
  );
  const handleRetry = () => setReloadKey((prev) => prev + 1);

  const resolveCaption = useCallback(
    (item: GalleryItem) => {
      if (language === 'ar') return item.caption_ar ?? '';
      if (language === 'id') return item.caption_id ?? '';
      return item.caption_en ?? '';
    },
    [language]
  );

  const resolveAlt = useCallback(
    (item: GalleryItem, fallbackCaption: string) => {
      if (language === 'ar') return item.alt_ar || fallbackCaption || t.gallery.fallbackAlt;
      if (language === 'id') return item.alt_id || fallbackCaption || t.gallery.fallbackAlt;
      return item.alt_en || fallbackCaption || t.gallery.fallbackAlt;
    },
    [language, t.gallery.fallbackAlt]
  );

  const { resolvedItems, unavailableCount } = useMemo(() => {
    return items.reduce<{ resolvedItems: ResolvedGalleryItem[]; unavailableCount: number }>((acc, item) => {
      const caption = resolveCaption(item);
      const altText = resolveAlt(item, caption);

      if (item.kind === 'photo') {
        const url = resolvePublicUrl(item);
        if (!url) {
          acc.unavailableCount += 1;
          return acc;
        }
        acc.resolvedItems.push({
          id: item.id,
          kind: 'photo',
          url,
          caption,
          altText,
          width: item.width,
          height: item.height,
        });
        return acc;
      }

      if (item.kind === 'video') {
        const url = resolvePublicUrl(item);
        if (!url) {
          acc.unavailableCount += 1;
          return acc;
        }
        acc.resolvedItems.push({
          id: item.id,
          kind: 'video',
          url,
          caption,
          altText,
        });
        return acc;
      }

      const externalUrl = resolveDirectOrRelativeUrl(item.public_url, r2PublicBase ?? undefined);
      if (!externalUrl) {
        acc.unavailableCount += 1;
        return acc;
      }
      acc.resolvedItems.push({
        id: item.id,
        kind: 'external_video',
        caption,
        altText,
        thumbUrl: resolveThumbUrl(item.thumb_url),
        externalUrl,
      });
      return acc;
    }, { resolvedItems: [], unavailableCount: 0 });
  }, [items, r2PublicBase, resolveAlt, resolveCaption, resolvePublicUrl, resolveThumbUrl]);

  const photoItems = useMemo(
    () => resolvedItems.filter((item): item is ResolvedPhotoItem => item.kind === 'photo'),
    [resolvedItems]
  );

  const photoIndexById = useMemo(() => {
    return new Map(photoItems.map((item, index) => [item.id, index]));
  }, [photoItems]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    if (photoItems.length === 0) {
      setLightboxIndex(null);
      return;
    }
    if (lightboxIndex > photoItems.length - 1) {
      setLightboxIndex(photoItems.length - 1);
    }
  }, [lightboxIndex, photoItems.length]);

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
      if (event.key === 'ArrowRight' && photoItems.length > 0) {
        setLightboxIndex((prev) => {
          if (prev === null) return prev;
          return (prev + 1) % photoItems.length;
        });
        return;
      }
      if (event.key === 'ArrowLeft' && photoItems.length > 0) {
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
  const hasResolvedItems = resolvedItems.length > 0;
  const hasPublishedRecords = items.length > 0;
  const showUnavailableNotice = unavailableCount > 0;

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (!loading && error === null && rawRowCount !== null && rawRowCount === 0) {
      console.info('gallery public load returned zero rows; verify published content or RLS policies.');
    }
  }, [error, loading, rawRowCount]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (showUnavailableNotice) {
      console.warn('gallery public skipped items without usable media URLs', { unavailableCount });
    }
  }, [showUnavailableNotice, unavailableCount]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8" dir={dir}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-gray-900 rtl:font-kufi">{t.gallery.title}</h1>
          <p className="text-sm text-gray-600">{t.gallery.subtitle}</p>
        </div>

        {loading ? (
          <section className={RESPONSIVE_GRID_CLASSES} aria-label={t.gallery.loadingLabel} aria-busy="true">
            {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                aria-hidden="true"
              >
                <div
                  className={`${CARD_MEDIA_WRAPPER_BASE} ${CARD_MEDIA_ASPECT_CLASS} bg-gray-200`}
                  style={CARD_MEDIA_ASPECT_STYLE}
                />
                <div className="space-y-2 px-4 py-3">
                  <div className="h-3 w-3/4 rounded-full bg-gray-200" />
                  <div className="h-3 w-1/2 rounded-full bg-gray-200" />
                </div>
              </div>
            ))}
          </section>
        ) : error ? (
          <Alert variant="error">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Bdi>{error}</Bdi>
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
              >
                {t.gallery.retry}
              </button>
            </div>
          </Alert>
        ) : !hasResolvedItems ? (
          hasPublishedRecords ? (
            <Alert variant="warning">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Bdi>{t.gallery.unavailableAll}</Bdi>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex items-center justify-center rounded-lg border border-amber-300 bg-white/60 px-4 py-2 text-sm font-semibold text-amber-800 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
                >
                  {t.gallery.retry}
                </button>
              </div>
            </Alert>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center text-gray-600">
              <p className="text-base font-semibold text-gray-800">{t.gallery.empty}</p>
              <p className="mt-2 text-sm text-gray-500">{t.gallery.subtitle}</p>
            </div>
          )
        ) : (
          <>
            {showUnavailableNotice && (
              <Alert variant="warning" className="mb-6">
                <Bdi>{t.gallery.unavailableSome.replace('{count}', String(unavailableCount))}</Bdi>
              </Alert>
            )}
            <section className={RESPONSIVE_GRID_CLASSES} aria-label={t.gallery.sectionLabel}>
              {resolvedItems.map((item) => {
              if (item.kind === 'photo') {
                const photoIndex = photoIndexById.get(item.id);
                const lightboxLabel = item.caption ? `${t.gallery.openLightbox} - ${item.caption}` : t.gallery.openLightbox;
                return (
                  <figure
                    key={item.id}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md focus-within:shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (photoIndex === undefined) return;
                        setLightboxIndex(photoIndex);
                      }}
                      className="relative block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      aria-label={lightboxLabel}
                    >
                      <div
                        className={`${CARD_MEDIA_WRAPPER_BASE} ${CARD_MEDIA_ASPECT_CLASS} bg-gray-100`}
                        style={CARD_MEDIA_ASPECT_STYLE}
                      >
                        <img
                          src={item.url}
                          alt={item.altText}
                          className="absolute inset-0 h-full w-full select-none object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                          width={item.width ?? undefined}
                          height={item.height ?? undefined}
                          draggable={false}
                        />
                      </div>
                    </button>
                    {item.caption && (
                      <figcaption className="border-t border-gray-50 px-4 py-3 text-xs text-gray-700 sm:text-sm">
                        <Bdi dir="auto">{item.caption}</Bdi>
                      </figcaption>
                    )}
                  </figure>
                );
              }

              if (item.kind === 'video') {
                return (
                  <figure
                    key={item.id}
                    className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md focus-within:shadow-md"
                  >
                    <div
                      className={`${CARD_MEDIA_WRAPPER_BASE} ${CARD_MEDIA_ASPECT_CLASS} bg-black`}
                      style={CARD_MEDIA_ASPECT_STYLE}
                    >
                      <video
                        controls
                        playsInline
                        src={item.url}
                        className="absolute inset-0 h-full w-full object-cover"
                        aria-label={item.altText}
                        preload="metadata"
                      />
                    </div>
                    {item.caption && (
                      <figcaption className="border-t border-gray-50 px-4 py-3 text-xs text-gray-700 sm:text-sm">
                        <Bdi dir="auto">{item.caption}</Bdi>
                      </figcaption>
                    )}
                  </figure>
                );
              }

              return (
                <figure
                  key={item.id}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md focus-within:shadow-md"
                >
                  <div
                    className={`${CARD_MEDIA_WRAPPER_BASE} ${CARD_MEDIA_ASPECT_CLASS} bg-gray-100`}
                    style={CARD_MEDIA_ASPECT_STYLE}
                  >
                    {item.thumbUrl ? (
                      <img
                        src={item.thumbUrl}
                        alt={item.altText}
                        className="absolute inset-0 h-full w-full select-none object-cover"
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 border-b border-gray-100 px-4 text-center text-xs text-gray-500 sm:text-sm">
                        <span className="font-semibold text-gray-700">{t.gallery.externalVideoLabel}</span>
                        <span>{t.gallery.missingMedia}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 border-t border-gray-50 px-4 py-3 text-xs text-gray-700 sm:text-sm">
                    {item.caption && (
                      <p>
                        <Bdi dir="auto">{item.caption}</Bdi>
                      </p>
                    )}
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-madinah-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      {t.gallery.openExternalLink}
                    </a>
                  </div>
                </figure>
              );
            })}
          </section>
          </>
        )}
      </div>
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 sm:py-12" dir={dir}>
          <div
            className="absolute inset-0 bg-black/70"
            aria-hidden="true"
            onClick={() => setLightboxIndex(null)}
          ></div>
          <div
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.gallery.lightboxLabel}
            className="relative z-10 w-full max-w-[90vw]"
            tabIndex={-1}
            onKeyDown={(event) => {
              if (event.key !== 'Tab') return;
              const focusables = lightboxRef.current?.querySelectorAll<HTMLElement>(
                'button, [href], [tabindex]:not([tabindex="-1"])'
              );
              if (!focusables || focusables.length === 0) return;
              const first = focusables[0];
              const last = focusables[focusables.length - 1];
              const activeElement = document.activeElement as HTMLElement | null;
              if (event.shiftKey && activeElement === first) {
                event.preventDefault();
                last.focus();
                return;
              }
              if (!event.shiftKey && activeElement === last) {
                event.preventDefault();
                first.focus();
              }
            }}
          >
            <div className="relative flex max-h-[80vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div className="text-sm font-semibold text-gray-600">{t.gallery.lightboxTitle}</div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  className="min-h-[40px] rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-600 hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold focus-visible:ring-offset-2"
                  aria-label={t.gallery.lightboxClose}
                >
                  {t.gallery.lightboxClose}
                </button>
              </div>
              <div className="flex flex-1 items-center justify-center bg-black px-4 py-4">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.altText}
                  className="max-h-[80vh] max-w-[90vw] select-none object-contain"
                  width={activePhoto.width ?? undefined}
                  height={activePhoto.height ?? undefined}
                  draggable={false}
                />
              </div>
              {activePhoto.caption && (
                <div className="border-t border-gray-100 px-4 py-3 text-sm text-gray-700">
                  <Bdi dir="auto">{activePhoto.caption}</Bdi>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-white">
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((prev) => (prev === null ? prev : (prev - 1 + photoItems.length) % photoItems.length))
                }
                className="min-h-[40px] rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-label={t.gallery.lightboxPrev}
              >
                {t.gallery.lightboxPrev}
              </button>
              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev === null ? prev : (prev + 1) % photoItems.length))}
                className="min-h-[40px] rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-label={t.gallery.lightboxNext}
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
