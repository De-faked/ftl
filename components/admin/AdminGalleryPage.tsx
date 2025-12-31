import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../src/auth/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { Alert } from '../Alert';
import { Bdi } from '../Bdi';
import { logDevError } from '../../src/utils/logging';

type GalleryKind = 'photo' | 'video' | 'external_video';

type GalleryItem = {
  id: string;
  kind: GalleryKind;
  storage_key: string | null;
  public_url: string | null;
  thumb_url: string | null;
  content_type: string | null;
  size_bytes: number | null;
  caption_ar: string | null;
  caption_en: string | null;
  caption_id: string | null;
  alt_ar: string | null;
  alt_en: string | null;
  alt_id: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

type Draft = Partial<Pick<
  GalleryItem,
  | 'caption_ar'
  | 'caption_en'
  | 'caption_id'
  | 'alt_ar'
  | 'alt_en'
  | 'alt_id'
  | 'sort_order'
  | 'is_published'
  | 'public_url'
  | 'thumb_url'
>>;

const trimSlash = (value: string) => value.replace(/\/+$/, '');

const normalizeNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeText = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const AdminGalleryPage: React.FC = () => {
  const { session } = useAuth();
  const { t, language, dir } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [creatingExternal, setCreatingExternal] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [replaceFiles, setReplaceFiles] = useState<Record<string, File | null>>({});

  const [uploadKind, setUploadKind] = useState<'photo' | 'video'>('photo');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCaptionAr, setUploadCaptionAr] = useState('');
  const [uploadCaptionEn, setUploadCaptionEn] = useState('');
  const [uploadCaptionId, setUploadCaptionId] = useState('');
  const [uploadAltAr, setUploadAltAr] = useState('');
  const [uploadAltEn, setUploadAltEn] = useState('');
  const [uploadAltId, setUploadAltId] = useState('');
  const [uploadSortOrder, setUploadSortOrder] = useState('0');
  const [uploadPublished, setUploadPublished] = useState(false);

  const [externalUrl, setExternalUrl] = useState('');
  const [externalThumbUrl, setExternalThumbUrl] = useState('');
  const [externalCaptionAr, setExternalCaptionAr] = useState('');
  const [externalCaptionEn, setExternalCaptionEn] = useState('');
  const [externalCaptionId, setExternalCaptionId] = useState('');
  const [externalAltAr, setExternalAltAr] = useState('');
  const [externalAltEn, setExternalAltEn] = useState('');
  const [externalAltId, setExternalAltId] = useState('');
  const [externalSortOrder, setExternalSortOrder] = useState('0');
  const [externalPublished, setExternalPublished] = useState(false);

  const r2PublicBase = useMemo(() => {
    const raw = import.meta.env.VITE_R2_PUBLIC_BASE_URL as string | undefined;
    return raw ? trimSlash(raw) : null;
  }, []);

  const resolvePublicUrl = useCallback(
    (item: GalleryItem) => {
      if (item.public_url) return item.public_url;
      if (r2PublicBase && item.storage_key) {
        return `${r2PublicBase}/${item.storage_key}`;
      }
      return null;
    },
    [r2PublicBase]
  );

  const getLanguageLabel = useCallback(
    (code: 'ar' | 'en' | 'id') => t.common.languages[code],
    [t]
  );

  const captionLabel = useCallback(
    (code: 'ar' | 'en' | 'id') => t.admin.gallery.captionLabel.replace('{language}', getLanguageLabel(code)),
    [getLanguageLabel, t]
  );

  const altLabel = useCallback(
    (code: 'ar' | 'en' | 'id') => t.admin.gallery.altLabel.replace('{language}', getLanguageLabel(code)),
    [getLanguageLabel, t]
  );

  const resolveDraftValue = useCallback(
    <K extends keyof Draft>(item: GalleryItem, key: K, fallback: Draft[K]) =>
      drafts[item.id]?.[key] ?? (item[key as keyof GalleryItem] as Draft[K]) ?? fallback,
    [drafts]
  );

  const updateDraft = useCallback((id: string, patch: Draft) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...patch,
      },
    }));
  }, []);

  const fetchItems = useCallback(async () => {
    if (!session?.access_token) {
      setLoadError(t.admin.gallery.errors.authRequired);
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError(null);

    const response = await fetch('/api/gallery/items', {
      headers: {
        authorization: `Bearer ${session.access_token}`,
      },
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      logDevError('admin gallery load failed', payload ?? response.status);
      setLoadError(t.admin.gallery.errors.loadFailed);
      setLoading(false);
      return;
    }

    setItems((payload?.items ?? []) as GalleryItem[]);
    setLoading(false);
  }, [session?.access_token, t.admin.gallery.errors.authRequired, t.admin.gallery.errors.loadFailed]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const requireAccessToken = () => {
    if (!session?.access_token) {
      setActionError(t.admin.gallery.errors.authRequired);
      return null;
    }
    return session.access_token;
  };

  const resetAlerts = () => {
    setActionError(null);
    setSuccessMessage(null);
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetAlerts();

    const token = requireAccessToken();
    if (!token) return;

    if (!uploadFile) {
      setActionError(t.admin.gallery.errors.fileRequired);
      return;
    }

    const isImage = uploadFile.type.startsWith('image/');
    const isVideo = uploadFile.type.startsWith('video/');
    if ((uploadKind === 'photo' && !isImage) || (uploadKind === 'video' && !isVideo)) {
      setActionError(t.admin.gallery.errors.kindMismatch);
      return;
    }

    setUploading(true);

    const uploadResponse = await fetch('/api/gallery/upload-url', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        filename: uploadFile.name,
        content_type: uploadFile.type,
        size: uploadFile.size,
      }),
    });

    const uploadPayload = await uploadResponse.json().catch(() => null);
    if (!uploadResponse.ok || !uploadPayload?.upload_url) {
      logDevError('gallery upload-url failed', uploadPayload ?? uploadResponse.status);
      setActionError(t.admin.gallery.errors.uploadUrlFailed);
      setUploading(false);
      return;
    }

    const putResponse = await fetch(uploadPayload.upload_url as string, {
      method: 'PUT',
      headers: {
        'content-type': uploadPayload.content_type as string,
      },
      body: uploadFile,
    });

    if (!putResponse.ok) {
      logDevError('gallery upload put failed', putResponse.status);
      setActionError(t.admin.gallery.errors.uploadFailed);
      setUploading(false);
      return;
    }

    const createResponse = await fetch('/api/gallery/items', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        kind: uploadKind,
        storage_key: uploadPayload.key,
        public_url: uploadPayload.public_url ?? null,
        content_type: uploadPayload.content_type ?? uploadFile.type,
        size_bytes: uploadFile.size,
        caption_ar: normalizeText(uploadCaptionAr),
        caption_en: normalizeText(uploadCaptionEn),
        caption_id: normalizeText(uploadCaptionId),
        alt_ar: normalizeText(uploadAltAr),
        alt_en: normalizeText(uploadAltEn),
        alt_id: normalizeText(uploadAltId),
        sort_order: normalizeNumber(uploadSortOrder),
        is_published: uploadPublished,
      }),
    });

    const createPayload = await createResponse.json().catch(() => null);
    if (!createResponse.ok) {
      logDevError('gallery create failed', createPayload ?? createResponse.status);
      setActionError(t.admin.gallery.errors.createFailed);
      setUploading(false);
      return;
    }

    setSuccessMessage(t.admin.gallery.messages.createSuccess);
    setUploadFile(null);
    setUploadCaptionAr('');
    setUploadCaptionEn('');
    setUploadCaptionId('');
    setUploadAltAr('');
    setUploadAltEn('');
    setUploadAltId('');
    setUploadSortOrder('0');
    setUploadPublished(false);
    setUploading(false);
    await fetchItems();
  };

  const handleCreateExternal = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetAlerts();

    const token = requireAccessToken();
    if (!token) return;

    if (!externalUrl.trim()) {
      setActionError(t.admin.gallery.errors.externalUrlRequired);
      return;
    }

    setCreatingExternal(true);

    const response = await fetch('/api/gallery/items', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        kind: 'external_video',
        public_url: externalUrl.trim(),
        thumb_url: normalizeText(externalThumbUrl) ?? null,
        caption_ar: normalizeText(externalCaptionAr),
        caption_en: normalizeText(externalCaptionEn),
        caption_id: normalizeText(externalCaptionId),
        alt_ar: normalizeText(externalAltAr),
        alt_en: normalizeText(externalAltEn),
        alt_id: normalizeText(externalAltId),
        sort_order: normalizeNumber(externalSortOrder),
        is_published: externalPublished,
      }),
    });

    const payload = await response.json().catch(() => null);
    setCreatingExternal(false);

    if (!response.ok) {
      logDevError('gallery external create failed', payload ?? response.status);
      setActionError(t.admin.gallery.errors.createFailed);
      return;
    }

    setSuccessMessage(t.admin.gallery.messages.createSuccess);
    setExternalUrl('');
    setExternalThumbUrl('');
    setExternalCaptionAr('');
    setExternalCaptionEn('');
    setExternalCaptionId('');
    setExternalAltAr('');
    setExternalAltEn('');
    setExternalAltId('');
    setExternalSortOrder('0');
    setExternalPublished(false);
    await fetchItems();
  };

  const handleSaveItem = async (item: GalleryItem) => {
    resetAlerts();
    const token = requireAccessToken();
    if (!token) return;

    const draft = drafts[item.id] ?? {};
    const nextPublicUrl =
      item.kind === 'external_video'
        ? normalizeText((draft.public_url as string) ?? item.public_url ?? '')
        : undefined;

    if (item.kind === 'external_video' && !nextPublicUrl) {
      setActionError(t.admin.gallery.errors.externalUrlRequired);
      return;
    }

    setSavingId(item.id);

    const response = await fetch(`/api/gallery/items/${item.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        caption_ar: normalizeText(String(draft.caption_ar ?? item.caption_ar ?? '')),
        caption_en: normalizeText(String(draft.caption_en ?? item.caption_en ?? '')),
        caption_id: normalizeText(String(draft.caption_id ?? item.caption_id ?? '')),
        alt_ar: normalizeText(String(draft.alt_ar ?? item.alt_ar ?? '')),
        alt_en: normalizeText(String(draft.alt_en ?? item.alt_en ?? '')),
        alt_id: normalizeText(String(draft.alt_id ?? item.alt_id ?? '')),
        sort_order: normalizeNumber(String(draft.sort_order ?? item.sort_order ?? 0)),
        is_published: Boolean(draft.is_published ?? item.is_published),
        public_url: item.kind === 'external_video' ? nextPublicUrl : undefined,
        thumb_url:
          item.kind === 'external_video'
            ? normalizeText(String(draft.thumb_url ?? item.thumb_url ?? ''))
            : undefined,
      }),
    });

    const payload = await response.json().catch(() => null);
    setSavingId(null);

    if (!response.ok) {
      logDevError('gallery update failed', payload ?? response.status);
      setActionError(t.admin.gallery.errors.updateFailed);
      return;
    }

    setSuccessMessage(t.admin.gallery.messages.updateSuccess);
    await fetchItems();
  };

  const handleReplaceFile = async (item: GalleryItem) => {
    resetAlerts();
    const token = requireAccessToken();
    if (!token) return;

    const file = replaceFiles[item.id];
    if (!file) {
      setActionError(t.admin.gallery.errors.fileRequired);
      return;
    }

    setReplacingId(item.id);

    const uploadResponse = await fetch('/api/gallery/upload-url', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        filename: file.name,
        content_type: file.type,
        size: file.size,
      }),
    });

    const uploadPayload = await uploadResponse.json().catch(() => null);
    if (!uploadResponse.ok || !uploadPayload?.upload_url) {
      logDevError('gallery replace upload-url failed', uploadPayload ?? uploadResponse.status);
      setActionError(t.admin.gallery.errors.uploadUrlFailed);
      setReplacingId(null);
      return;
    }

    const putResponse = await fetch(uploadPayload.upload_url as string, {
      method: 'PUT',
      headers: {
        'content-type': uploadPayload.content_type as string,
      },
      body: file,
    });

    if (!putResponse.ok) {
      logDevError('gallery replace upload failed', putResponse.status);
      setActionError(t.admin.gallery.errors.uploadFailed);
      setReplacingId(null);
      return;
    }

    const patchResponse = await fetch(`/api/gallery/items/${item.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        storage_key: uploadPayload.key,
        public_url: uploadPayload.public_url ?? null,
        content_type: uploadPayload.content_type ?? file.type,
        size_bytes: file.size,
        delete_old: true,
      }),
    });

    const patchPayload = await patchResponse.json().catch(() => null);
    setReplacingId(null);

    if (!patchResponse.ok) {
      logDevError('gallery replace failed', patchPayload ?? patchResponse.status);
      setActionError(t.admin.gallery.errors.replaceFailed);
      return;
    }

    setSuccessMessage(t.admin.gallery.messages.replaceSuccess);
    setReplaceFiles((prev) => ({ ...prev, [item.id]: null }));
    await fetchItems();
  };

  const handleDelete = async (item: GalleryItem) => {
    resetAlerts();
    const token = requireAccessToken();
    if (!token) return;

    if (!window.confirm(t.admin.gallery.confirmDelete)) {
      return;
    }

    setDeletingId(item.id);

    const response = await fetch(`/api/gallery/items/${item.id}?delete_file=true`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const payload = await response.json().catch(() => null);
    setDeletingId(null);

    if (!response.ok) {
      logDevError('gallery delete failed', payload ?? response.status);
      setActionError(t.admin.gallery.errors.deleteFailed);
      return;
    }

    setSuccessMessage(t.admin.gallery.messages.deleteSuccess);
    await fetchItems();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8" dir={dir}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.admin.gallery.title}</h1>
          <p className="text-sm text-gray-500">{t.admin.gallery.subtitle}</p>
        </div>

        {actionError && (
          <Alert variant="error">
            <Bdi>{actionError}</Bdi>
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success">
            <Bdi>{successMessage}</Bdi>
          </Alert>
        )}

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-gray-900">{t.admin.gallery.uploadTitle}</h2>
            <p className="text-sm text-gray-500">{t.admin.gallery.uploadSubtitle}</p>
          </div>
          <form onSubmit={handleUpload} className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {t.admin.gallery.kindLabel}
              <select
                value={uploadKind}
                onChange={(event) => setUploadKind(event.target.value as 'photo' | 'video')}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={uploading}
              >
                <option value="photo">{t.admin.gallery.kinds.photo}</option>
                <option value="video">{t.admin.gallery.kinds.video}</option>
              </select>
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {t.admin.gallery.fileLabel}
              <input
                type="file"
                accept={uploadKind === 'photo' ? 'image/*' : 'video/*'}
                onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={uploading}
              />
            </label>

            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {captionLabel('ar')}
              <input
                type="text"
                value={uploadCaptionAr}
                onChange={(event) => setUploadCaptionAr(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={uploading}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {captionLabel('en')}
              <input
                type="text"
                value={uploadCaptionEn}
                onChange={(event) => setUploadCaptionEn(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={uploading}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {captionLabel('id')}
              <input
                type="text"
                value={uploadCaptionId}
                onChange={(event) => setUploadCaptionId(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={uploading}
              />
            </label>

            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {altLabel('ar')}
              <input
                type="text"
                value={uploadAltAr}
                onChange={(event) => setUploadAltAr(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={uploading}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {altLabel('en')}
              <input
                type="text"
                value={uploadAltEn}
                onChange={(event) => setUploadAltEn(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={uploading}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {altLabel('id')}
              <input
                type="text"
                value={uploadAltId}
                onChange={(event) => setUploadAltId(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={uploading}
              />
            </label>

            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {t.admin.gallery.sortOrderLabel}
              <input
                type="number"
                value={uploadSortOrder}
                onChange={(event) => setUploadSortOrder(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={uploading}
              />
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 mt-6">
              <input
                type="checkbox"
                checked={uploadPublished}
                onChange={(event) => setUploadPublished(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-madinah-green focus:ring-madinah-gold"
                disabled={uploading}
              />
              {t.admin.gallery.publishedLabel}
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={uploading}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-madinah-green px-4 py-2 text-sm font-semibold text-white hover:bg-madinah-green/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? t.admin.gallery.states.uploading : t.admin.gallery.actions.upload}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-gray-900">{t.admin.gallery.externalVideoTitle}</h2>
            <p className="text-sm text-gray-500">{t.admin.gallery.externalVideoSubtitle}</p>
          </div>
          <form onSubmit={handleCreateExternal} className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-semibold text-gray-600 md:col-span-2">
              {t.admin.gallery.publicUrlLabel}
              <input
                type="url"
                value={externalUrl}
                onChange={(event) => setExternalUrl(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600 md:col-span-2">
              {t.admin.gallery.thumbUrlLabel}
              <input
                type="url"
                value={externalThumbUrl}
                onChange={(event) => setExternalThumbUrl(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
            </label>

            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {captionLabel('ar')}
              <input
                type="text"
                value={externalCaptionAr}
                onChange={(event) => setExternalCaptionAr(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {captionLabel('en')}
              <input
                type="text"
                value={externalCaptionEn}
                onChange={(event) => setExternalCaptionEn(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {captionLabel('id')}
              <input
                type="text"
                value={externalCaptionId}
                onChange={(event) => setExternalCaptionId(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
            </label>

            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {altLabel('ar')}
              <input
                type="text"
                value={externalAltAr}
                onChange={(event) => setExternalAltAr(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {altLabel('en')}
              <input
                type="text"
                value={externalAltEn}
                onChange={(event) => setExternalAltEn(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {altLabel('id')}
              <input
                type="text"
                value={externalAltId}
                onChange={(event) => setExternalAltId(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
            </label>

            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {t.admin.gallery.sortOrderLabel}
              <input
                type="number"
                value={externalSortOrder}
                onChange={(event) => setExternalSortOrder(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 mt-6">
              <input
                type="checkbox"
                checked={externalPublished}
                onChange={(event) => setExternalPublished(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-madinah-green focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
              {t.admin.gallery.publishedLabel}
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={creatingExternal}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-madinah-green px-4 py-2 text-sm font-semibold text-white hover:bg-madinah-green/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creatingExternal ? t.admin.gallery.states.creating : t.admin.gallery.actions.create}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{t.admin.gallery.itemsTitle}</h2>
              <p className="text-sm text-gray-500">{t.admin.gallery.itemsSubtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => void fetchItems()}
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:border-madinah-gold"
              disabled={loading}
            >
              {t.admin.gallery.actions.refresh}
            </button>
          </div>

          {loading ? (
            <div className="mt-4 text-sm text-gray-500">{t.admin.gallery.states.loading}</div>
          ) : loadError ? (
            <div className="mt-4">
              <Alert variant="error">
                <Bdi>{loadError}</Bdi>
              </Alert>
            </div>
          ) : items.length === 0 ? (
            <div className="mt-4 text-sm text-gray-500">{t.admin.gallery.empty}</div>
          ) : (
            <div className="mt-6 space-y-6">
              {items.map((item) => {
                const resolvedUrl = resolvePublicUrl(item);
                const previewCaption =
                  language === 'ar'
                    ? item.caption_ar
                    : language === 'id'
                    ? item.caption_id
                    : item.caption_en;
                const isPublished = resolveDraftValue(item, 'is_published', item.is_published) as boolean;
                const sortOrder = resolveDraftValue(item, 'sort_order', item.sort_order ?? 0) as number;

                return (
                  <div key={item.id} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
                        <div className="w-full max-w-xs overflow-hidden rounded-xl bg-white shadow-sm">
                          {item.kind === 'photo' && resolvedUrl && (
                            <img
                              src={resolvedUrl}
                              alt={previewCaption ?? t.admin.gallery.previewFallback}
                              className="h-48 w-full object-cover"
                              loading="lazy"
                            />
                          )}
                          {item.kind === 'video' && resolvedUrl && (
                            <video
                              controls
                              src={resolvedUrl}
                              className="h-48 w-full object-cover"
                            />
                          )}
                          {item.kind === 'external_video' && (
                            <div className="p-3 text-sm text-gray-600 space-y-2">
                              {item.thumb_url ? (
                                <img
                                  src={item.thumb_url}
                                  alt={t.gallery.externalThumbnailAlt}
                                  className="h-40 w-full rounded-lg object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-200 text-xs text-gray-400">
                                  {t.admin.gallery.externalPreviewFallback}
                                </div>
                              )}
                              {item.public_url ? (
                                <a
                                  href={item.public_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sm font-semibold text-madinah-green hover:underline"
                                >
                                  {t.gallery.openExternalLink}
                                </a>
                              ) : null}
                            </div>
                          )}
                          {!resolvedUrl && item.kind !== 'external_video' && (
                            <div className="flex h-48 items-center justify-center text-xs text-gray-400">
                              {t.admin.gallery.previewFallback}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                            {item.kind === 'photo'
                              ? t.admin.gallery.kinds.photo
                              : item.kind === 'video'
                              ? t.admin.gallery.kinds.video
                              : t.admin.gallery.kinds.externalVideo}
                          </div>
                          {item.storage_key && (
                            <div>
                              <span className="text-xs font-semibold text-gray-500">{t.admin.gallery.storageKeyLabel}</span>
                              <div className="text-xs text-gray-600">
                                <Bdi>{item.storage_key}</Bdi>
                              </div>
                            </div>
                          )}
                          {item.content_type && (
                            <div>
                              <span className="text-xs font-semibold text-gray-500">{t.admin.gallery.contentTypeLabel}</span>
                              <div className="text-xs text-gray-600">{item.content_type}</div>
                            </div>
                          )}
                          {typeof item.size_bytes === 'number' && (
                            <div>
                              <span className="text-xs font-semibold text-gray-500">{t.admin.gallery.sizeLabel}</span>
                              <div className="text-xs text-gray-600">{item.size_bytes}</div>
                            </div>
                          )}
                          {resolvedUrl && (
                            <div>
                              <span className="text-xs font-semibold text-gray-500">{t.admin.gallery.publicUrlLabel}</span>
                              <div className="text-xs text-gray-600 break-all">
                                <Bdi>{resolvedUrl}</Bdi>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {item.kind !== 'external_video' && (
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-gray-600">
                              {t.admin.gallery.replaceFileLabel}
                              <input
                                type="file"
                                accept={item.kind === 'photo' ? 'image/*' : 'video/*'}
                                onChange={(event) =>
                                  setReplaceFiles((prev) => ({
                                    ...prev,
                                    [item.id]: event.target.files?.[0] ?? null,
                                  }))
                                }
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => void handleReplaceFile(item)}
                              disabled={replacingId === item.id}
                              className="inline-flex min-h-[36px] items-center justify-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-madinah-gold disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {replacingId === item.id ? t.admin.gallery.states.replacing : t.admin.gallery.actions.replace}
                            </button>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => void handleDelete(item)}
                          disabled={deletingId === item.id}
                          className="inline-flex min-h-[36px] items-center justify-center rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === item.id ? t.admin.gallery.states.deleting : t.admin.gallery.actions.delete}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {item.kind === 'external_video' && (
                        <>
                          <label className="space-y-1 text-sm font-semibold text-gray-600 md:col-span-2">
                            {t.admin.gallery.publicUrlLabel}
                            <input
                              type="url"
                              value={String(resolveDraftValue(item, 'public_url', item.public_url ?? '') || '')}
                              onChange={(event) => updateDraft(item.id, { public_url: event.target.value })}
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                            />
                          </label>
                          <label className="space-y-1 text-sm font-semibold text-gray-600 md:col-span-2">
                            {t.admin.gallery.thumbUrlLabel}
                            <input
                              type="url"
                              value={String(resolveDraftValue(item, 'thumb_url', item.thumb_url ?? '') || '')}
                              onChange={(event) => updateDraft(item.id, { thumb_url: event.target.value })}
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                            />
                          </label>
                        </>
                      )}

                      <label className="space-y-1 text-sm font-semibold text-gray-600">
                        {captionLabel('ar')}
                        <input
                          type="text"
                          value={String(resolveDraftValue(item, 'caption_ar', item.caption_ar ?? ''))}
                          onChange={(event) => updateDraft(item.id, { caption_ar: event.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                        />
                      </label>
                      <label className="space-y-1 text-sm font-semibold text-gray-600">
                        {captionLabel('en')}
                        <input
                          type="text"
                          value={String(resolveDraftValue(item, 'caption_en', item.caption_en ?? ''))}
                          onChange={(event) => updateDraft(item.id, { caption_en: event.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                        />
                      </label>
                      <label className="space-y-1 text-sm font-semibold text-gray-600">
                        {captionLabel('id')}
                        <input
                          type="text"
                          value={String(resolveDraftValue(item, 'caption_id', item.caption_id ?? ''))}
                          onChange={(event) => updateDraft(item.id, { caption_id: event.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                        />
                      </label>

                      <label className="space-y-1 text-sm font-semibold text-gray-600">
                        {altLabel('ar')}
                        <input
                          type="text"
                          value={String(resolveDraftValue(item, 'alt_ar', item.alt_ar ?? ''))}
                          onChange={(event) => updateDraft(item.id, { alt_ar: event.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                        />
                      </label>
                      <label className="space-y-1 text-sm font-semibold text-gray-600">
                        {altLabel('en')}
                        <input
                          type="text"
                          value={String(resolveDraftValue(item, 'alt_en', item.alt_en ?? ''))}
                          onChange={(event) => updateDraft(item.id, { alt_en: event.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                        />
                      </label>
                      <label className="space-y-1 text-sm font-semibold text-gray-600">
                        {altLabel('id')}
                        <input
                          type="text"
                          value={String(resolveDraftValue(item, 'alt_id', item.alt_id ?? ''))}
                          onChange={(event) => updateDraft(item.id, { alt_id: event.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                        />
                      </label>

                      <label className="space-y-1 text-sm font-semibold text-gray-600">
                        {t.admin.gallery.sortOrderLabel}
                        <input
                          type="number"
                          value={String(sortOrder)}
                          onChange={(event) =>
                            updateDraft(item.id, {
                              sort_order: event.target.value === '' ? 0 : Number(event.target.value),
                            })
                          }
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                        />
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 mt-6">
                        <input
                          type="checkbox"
                          checked={Boolean(isPublished)}
                          onChange={(event) => updateDraft(item.id, { is_published: event.target.checked })}
                          className="h-4 w-4 rounded border-gray-300 text-madinah-green focus:ring-madinah-gold"
                        />
                        {t.admin.gallery.publishedLabel}
                      </label>

                      <div className="md:col-span-2">
                        <button
                          type="button"
                          onClick={() => void handleSaveItem(item)}
                          disabled={savingId === item.id}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {savingId === item.id ? t.admin.gallery.states.saving : t.admin.gallery.actions.save}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
