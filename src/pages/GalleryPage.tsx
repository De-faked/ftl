import React, { useEffect, useMemo, useState } from 'react';
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
  sort_order: number;
  created_at: string;
};

const trimSlash = (value: string) => value.replace(/\/+$/, '');

export const GalleryPage: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            'id, kind, storage_key, public_url, thumb_url, caption_ar, caption_en, caption_id, alt_ar, alt_en, alt_id, sort_order, created_at'
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

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8" dir={dir}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-gray-900 rtl:font-kufi">{t.gallery.title}</h1>
          <p className="text-sm text-gray-600">{t.gallery.subtitle}</p>
        </div>

        {loading ? (
          <div className="text-sm text-gray-500">{t.common.loading}</div>
        ) : error ? (
          <Alert variant="error">
            <Bdi>{error}</Bdi>
          </Alert>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-600">
            {t.gallery.empty}
          </div>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label={t.gallery.sectionLabel}>
            {items.map((item) => {
              const resolvedUrl = resolvePublicUrl(item);
              const caption = resolveCaption(item);
              const altText = resolveAlt(item, caption);

              if (!resolvedUrl && item.kind !== 'external_video') {
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-500"
                  >
                    {t.gallery.missingMedia}
                  </div>
                );
              }

              if (item.kind === 'photo') {
                return (
                  <figure key={item.id} className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <img
                      src={resolvedUrl ?? ''}
                      alt={altText}
                      className="h-56 w-full rounded-t-2xl object-cover"
                      loading="lazy"
                    />
                    {caption && (
                      <figcaption className="px-4 py-3 text-sm text-gray-700">{caption}</figcaption>
                    )}
                  </figure>
                );
              }

              if (item.kind === 'video') {
                return (
                  <figure key={item.id} className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <video
                      controls
                      src={resolvedUrl ?? ''}
                      className="h-56 w-full rounded-t-2xl object-cover"
                      aria-label={altText}
                    />
                    {caption && (
                      <figcaption className="px-4 py-3 text-sm text-gray-700">{caption}</figcaption>
                    )}
                  </figure>
                );
              }

              return (
                <figure key={item.id} className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                  {item.thumb_url ? (
                    <img
                      src={item.thumb_url}
                      alt={t.gallery.externalThumbnailAlt}
                      className="h-56 w-full rounded-t-2xl object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center rounded-t-2xl border-b border-gray-100 text-sm text-gray-400">
                      {t.gallery.externalVideoLabel}
                    </div>
                  )}
                  <div className="space-y-2 px-4 py-3 text-sm text-gray-700">
                    {caption && <p>{caption}</p>}
                    {item.public_url && (
                      <a
                        href={item.public_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 font-semibold text-madinah-green hover:underline"
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
    </div>
  );
};

export default GalleryPage;
